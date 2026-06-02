"""Groq AI client for TiewHatyai (free tier — no credit card needed)."""

import json
import os
import re
import time
from functools import lru_cache

from groq import Groq, APIStatusError

from .prompts import SYSTEM_PROMPT, lang_directive

# llama-3.3-70b-versatile: fast, great Thai, generous free quota
MODEL = "llama-3.3-70b-versatile"
# Use vision model only when a photo is attached
VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


@lru_cache(maxsize=1)
def get_client() -> Groq:
    return Groq(api_key=os.environ.get("GROQ_API_KEY"))


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


def _call(messages: list[dict], max_tokens: int = 1024, json_mode: bool = False, model: str = MODEL) -> str:
    """Call Groq with simple retry on transient 429/5xx."""
    kwargs = dict(model=model, messages=messages, max_tokens=max_tokens)
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    last = None
    for attempt in range(4):
        try:
            resp = get_client().chat.completions.create(**kwargs)
            return resp.choices[0].message.content or ""
        except APIStatusError as exc:
            if exc.status_code in (429, 503) and attempt < 3:
                last = exc
                time.sleep(1.5 * (attempt + 1))
                continue
            raise
    raise last


def chat(messages: list[dict], lang: str = "th", max_tokens: int = 4096) -> str:
    """Multi-turn chat with the น้องเที่ยว system prompt."""
    history = [{"role": "system", "content": SYSTEM_PROMPT + lang_directive(lang)}] + [
        {"role": m["role"], "content": m["content"]} for m in messages
    ]
    return _call(history, max_tokens=max_tokens).strip()


def complete_text(user_prompt: str, max_tokens: int = 512, system: str | None = None) -> str:
    """One-shot text reply (e.g. onboarding greeting)."""
    msgs = []
    if system:
        msgs.append({"role": "system", "content": system})
    msgs.append({"role": "user", "content": user_prompt})
    return _call(msgs, max_tokens=max_tokens).strip()


def complete_json(
    prompt: str,
    max_tokens: int = 1024,
    image_base64: str | None = None,
    image_mime: str = "image/jpeg",
):
    """One-shot JSON completion, optionally with an attached image."""
    if image_base64:
        data_url = f"data:{image_mime};base64,{image_base64}"
        msgs = [{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": data_url}},
                {"type": "text", "text": prompt},
            ],
        }]
        raw = _call(msgs, max_tokens=max_tokens, json_mode=True, model=VISION_MODEL)
    else:
        msgs = [{"role": "user", "content": prompt}]
        raw = _call(msgs, max_tokens=max_tokens, json_mode=True)
    return _extract_json(raw)
