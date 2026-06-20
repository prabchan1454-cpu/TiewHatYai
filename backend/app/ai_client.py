"""Google Gemini AI client for Travel Songkhla (น้องเที่ยว)."""

import base64
import json
import logging
import os
import re
import time

from google import genai
from google.genai import types

from .prompts import SYSTEM_PROMPT, lang_directive

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


def get_client() -> genai.Client:
    return genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))


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


def _call_with_retry(fn, retries: int = 4):
    """Call fn() with exponential backoff on transient 429/503 errors."""
    last = None
    for attempt in range(retries):
        try:
            return fn()
        except Exception as exc:
            # Try to detect rate-limit / server errors from google-genai exceptions
            msg = str(exc).lower()
            is_transient = "429" in msg or "503" in msg or "resource_exhausted" in msg
            if is_transient and attempt < retries - 1:
                last = exc
                wait = 1.5 * (attempt + 1)
                logger.warning("Transient AI error (attempt %d), retrying in %.1fs: %s", attempt + 1, wait, exc)
                time.sleep(wait)
                continue
            raise
    raise last


def _gemini_role(role: str) -> str:
    """Gemini accepts only 'user' and 'model'. The frontend uses 'assistant'
    for AI turns, so map it (and anything non-user) to 'model'."""
    return "user" if role == "user" else "model"


def chat(messages: list[dict], lang: str = "th", max_tokens: int = 4096) -> str:
    """Multi-turn chat with the น้องเที่ยว system prompt. Supports image attachments."""
    client = get_client()
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

    def _do():
        resp = client.models.generate_content(
            model=MODEL,
            contents=history + [types.Content(role="user", parts=last_parts)],
            config=types.GenerateContentConfig(
                system_instruction=system,
                max_output_tokens=max_tokens,
                temperature=0.5,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        return resp.text or ""

    return _strip_foreign(_call_with_retry(_do).strip())


def complete_text(user_prompt: str, max_tokens: int = 512, system: str | None = None) -> str:
    """One-shot text reply (e.g. onboarding greeting)."""
    client = get_client()

    def _do():
        resp = client.models.generate_content(
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
    client = get_client()

    if image_base64:
        parts = [
            types.Part.from_bytes(data=base64.b64decode(image_base64), mime_type=image_mime),
            types.Part.from_text(text=prompt),
        ]
    else:
        parts = [types.Part.from_text(text=prompt)]

    def _do():
        resp = client.models.generate_content(
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
