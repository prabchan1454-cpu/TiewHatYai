"""Google Gemini AI client for Travel Songkhla (น้องเที่ยว)."""

import base64
import json
import logging
import os
import re
import time

import httpx
from google import genai
from google.genai import types

from .prompts import SYSTEM_PROMPT, lang_directive
from .places import lookup_places, get_gold_rate

# Tools น้องเที่ยว can call during chat to fetch real, deterministic facts
# (opening hours / open-now status / prices) instead of guessing.
CHAT_TOOLS = [lookup_places, get_gold_rate]

logger = logging.getLogger(__name__)

# gemini-2.5-flash: fast, excellent Thai, multimodal, free-tier quota available.
# (gemini-2.0-flash free tier is currently allocated 0 on this project — 429.)
MODEL = "gemini-2.5-flash"

# Unicode blocks น้องเที่ยว should never output
_FOREIGN_SCRIPT = re.compile(
    "[຀-໿"  # Lao
    "ༀ-࿿"  # Tibetan
    "က-႟"  # Myanmar
    "ᄀ-ᇿ"  # Hangul Jamo
    "ក-៿"  # Khmer
    "぀-ヿ"  # Hiragana + Katakana
    "㐀-䶿"  # CJK Ext A
    "一-鿿"  # CJK Unified
    "가-힯"  # Hangul Syllables
    "豈-﫿"  # CJK Compatibility
    "؀-ۿ]+"  # Arabic
)


def _load_keys() -> list[str]:
    """Collect Gemini API keys from env: GEMINI_API_KEY (primary) plus optional
    backups GEMINI_API_KEY_2..5 and/or a comma-separated GEMINI_API_KEYS.
    Backups let us fail over automatically when the primary hits its daily
    free-tier quota (each key has its own quota)."""
    raw = [os.environ.get("GEMINI_API_KEY", "")]
    raw += [os.environ.get(f"GEMINI_API_KEY_{i}", "") for i in range(2, 6)]
    raw += os.environ.get("GEMINI_API_KEYS", "").split(",")
    seen, keys = set(), []
    for k in (x.strip() for x in raw):
        if k and k not in seen:
            seen.add(k)
            keys.append(k)
    return keys


_keys = _load_keys()
_key_idx = 0


def _current_key() -> str | None:
    return _keys[_key_idx] if _keys else os.environ.get("GEMINI_API_KEY")


def _advance_key() -> bool:
    """Rotate to the next key. Returns True only if a backup key exists."""
    global _key_idx
    if len(_keys) <= 1:
        return False
    _key_idx = (_key_idx + 1) % len(_keys)
    return True


def get_client() -> genai.Client:
    return genai.Client(api_key=_current_key())


def _strip_foreign(text: str) -> str:
    """Safety net: drop stray characters from unwanted scripts."""
    cleaned = _FOREIGN_SCRIPT.sub("", text)
    cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)
    cleaned = re.sub(r" +([,.!?])", r"\1", cleaned)
    return cleaned.strip()


def _extract_json(raw: str):
    """Parse JSON from a model response, tolerating ```json fences."""
    text = (raw or "").strip()
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    for opener, closer in (("{", "}"), ("[", "]")):
        start = text.find(opener)
        end = text.rfind(closer)
        if start != -1 and end > start:
            return json.loads(text[start : end + 1])
    raise ValueError(f"Model did not return valid JSON: {raw[:200]}")


def _call_with_retry(fn, retries: int = 5):
    """Call fn() with retries on transient 429/503 errors. On a quota error
    (429/RESOURCE_EXHAUSTED) it fails over to a backup API key immediately
    (no wait); for other transient errors it backs off. fn() must fetch the
    client via get_client() so a rotated key takes effect on the next attempt."""
    last = None
    for attempt in range(retries):
        try:
            return fn()
        except Exception as exc:
            msg = str(exc).lower()
            is_quota = "resource_exhausted" in msg or "429" in msg
            # "has been closed" / timeouts = transient httpx/connection hiccups;
            # retrying gets a fresh client (get_client() runs inside fn).
            is_transient = (
                is_quota or "503" in msg or "unavailable" in msg
                or "has been closed" in msg or "timed out" in msg or "timeout" in msg
            )
            if not is_transient or attempt >= retries - 1:
                raise
            last = exc
            # Quota hit → switch to a backup key and retry right away.
            if is_quota and _advance_key():
                logger.warning("Gemini quota hit — switching to backup key #%d", _key_idx + 1)
                continue
            wait = 1.5 * (attempt + 1)
            logger.warning("Transient AI error (attempt %d), retrying in %.1fs: %s", attempt + 1, wait, exc)
            time.sleep(wait)
    raise last


def _gemini_role(role: str) -> str:
    """Gemini accepts only 'user' and 'model'. The frontend uses 'assistant'
    for AI turns, so map it (and anything non-user) to 'model'."""
    return "user" if role == "user" else "model"


# ── Cross-provider fallback: Groq (OpenAI-compatible) keeps the chat alive when
# all Gemini keys are exhausted. Text-only — tools/vision/JSON stay on Gemini. ──
_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
_GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")


def _groq_chat(messages: list[dict], system: str, max_tokens: int = 1024) -> str:
    """Fallback chat reply via Groq. Raises if GROQ_API_KEY is not configured."""
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY not set — no fallback available")
    # Groq has no tools — strip the tool-calling section so it doesn't pretend
    # to "look up" data, and lead with a hard ban on guessing hours/prices
    # (otherwise the model extrapolates opening times from the curated list).
    sys = re.sub(r"## Live Data Tools.*?(?=\n## )", "", system, flags=re.DOTALL)
    guard = (
        "‼️ สำคัญที่สุด: ขณะนี้ระบบข้อมูลแบบเรียลไทม์ปิดอยู่ คุณ**ไม่รู้**เวลาเปิด-ปิด "
        "และราคาของสถานที่ใด ๆ. ห้ามบอกเวลาเปิด-ปิดหรือราคาเป็นตัวเลขโดยเด็ดขาด "
        "(ห้ามแต่ง ห้ามเดา ห้ามสมมุติ). ถ้าผู้ใช้ถามเวลาเปิด-ปิดหรือราคา ให้ตอบว่า "
        "ไม่แน่ใจ และแนะนำให้เช็ก Google Maps หรือโทรถามร้านก่อนไป. "
        "แนะนำสถานที่/ของกินได้ตามปกติ แต่ห้ามใส่ตัวเลขเวลา/ราคาเด็ดขาด.\n\n"
    )
    msgs = [{"role": "system", "content": guard + sys}]
    for m in messages:
        role = m["role"] if m["role"] in ("user", "assistant", "system") else "assistant"
        content = m.get("content") or ""
        if m.get("image_base64"):
            content = (content + " (ผู้ใช้แนบรูปมาด้วย แต่ตอนนี้ระบบดูรูปไม่ได้ชั่วคราว)").strip()
        msgs.append({"role": role, "content": content})
    resp = httpx.post(
        _GROQ_URL,
        timeout=30.0,
        headers={"Authorization": f"Bearer {key}"},
        json={"model": _GROQ_MODEL, "messages": msgs, "max_tokens": max_tokens, "temperature": 0.5},
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"] or ""


def chat(messages: list[dict], lang: str = "th", max_tokens: int = 4096) -> str:
    """Multi-turn chat with the น้องเที่ยว system prompt. Supports image attachments."""
    system = SYSTEM_PROMPT + lang_directive(lang)

    history = []
    for m in messages[:-1]:
        if m.get("image_base64"):
            image_bytes = base64.b64decode(m["image_base64"])
            history.append(
                types.Content(
                    role=_gemini_role(m["role"]),
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=m.get("image_mime", "image/jpeg")),
                        types.Part.from_text(text=m["content"] or "ช่วยอธิบายรูปภาพนี้ในบริบทของสงขลาหาดใหญ่ด้วยนะคะ"),
                    ],
                )
            )
        else:
            history.append(types.Content(role=_gemini_role(m["role"]), parts=[types.Part.from_text(text=m["content"])]))

    last = messages[-1]
    if last.get("image_base64"):
        image_bytes = base64.b64decode(last["image_base64"])
        last_parts = [
            types.Part.from_bytes(data=image_bytes, mime_type=last.get("image_mime", "image/jpeg")),
            types.Part.from_text(text=last["content"] or "ช่วยอธิบายรูปภาพนี้ในบริบทของสงขลาหาดใหญ่ด้วยนะคะ"),
        ]
    else:
        last_parts = [types.Part.from_text(text=last["content"])]

    # Create one stable client per request (reused across retries — this is the
    # pattern that works through the threadpool server). Recreate only when a
    # quota error has rotated us to a different key.
    cstate = {"idx": _key_idx, "c": get_client()}

    def _do():
        if cstate["idx"] != _key_idx:
            cstate["c"], cstate["idx"] = get_client(), _key_idx
        resp = cstate["c"].models.generate_content(
            model=MODEL,
            contents=history + [types.Content(role="user", parts=last_parts)],
            config=types.GenerateContentConfig(
                system_instruction=system,
                max_output_tokens=max_tokens,
                temperature=0.5,
                tools=CHAT_TOOLS,
            ),
        )
        return resp.text or ""

    try:
        return _strip_foreign(_call_with_retry(_do).strip())
    except Exception as exc:  # noqa: BLE001
        if os.environ.get("GROQ_API_KEY"):
            logger.warning("Gemini chat failed (%s) — falling back to Groq", str(exc)[:100])
            return _strip_foreign(_groq_chat(messages, system, max_tokens=min(max_tokens, 1024)).strip())
        raise


def complete_text(user_prompt: str, max_tokens: int = 512, system: str | None = None) -> str:
    """One-shot text reply (e.g. onboarding greeting)."""
    cstate = {"idx": _key_idx, "c": get_client()}

    def _do():
        if cstate["idx"] != _key_idx:
            cstate["c"], cstate["idx"] = get_client(), _key_idx
        resp = cstate["c"].models.generate_content(
            model=MODEL,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system,
                max_output_tokens=max_tokens,
                temperature=0.7,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        return resp.text or ""

    return _call_with_retry(_do).strip()


def complete_json(
    prompt: str,
    max_tokens: int = 1024,
    image_base64: str | None = None,
    image_mime: str = "image/jpeg",
):
    """One-shot JSON completion, optionally with an attached image."""

    if image_base64:
        parts = [
            types.Part.from_bytes(data=base64.b64decode(image_base64), mime_type=image_mime),
            types.Part.from_text(text=prompt),
        ]
    else:
        parts = [types.Part.from_text(text=prompt)]

    cstate = {"idx": _key_idx, "c": get_client()}

    def _do():
        if cstate["idx"] != _key_idx:
            cstate["c"], cstate["idx"] = get_client(), _key_idx
        resp = cstate["c"].models.generate_content(
            model=MODEL,
            contents=[types.Content(role="user", parts=parts)],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=max_tokens,
                temperature=0.7,
                response_mime_type="application/json",
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        return resp.text or ""

    raw = _call_with_retry(_do)
    return _extract_json(raw)
