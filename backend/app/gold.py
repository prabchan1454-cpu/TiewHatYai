"""Live Thai gold price (Gold Traders Association) for น้องเที่ยว.

Exposed to the chat model as a tool. Prices fluctuate during the day, so the
model must present them as approximate "as of now", never fixed. Fails soft:
on any error the gold field is simply omitted (no error placeholder shown).
"""

import os
import time

import httpx

# Community mirror of the Gold Traders Association of Thailand feed. Overridable
# so the endpoint can be swapped without code changes. Confirm shape before
# relying on it in production.
_GOLD_API_URL = os.environ.get("GOLD_API_URL", "https://api.chnwt.dev/thai-gold-api/latest")
_CACHE_TTL = 900  # 15 minutes — prices update a few times a day at most

_cache: dict | None = None
_cache_at: float = 0.0


def _to_int(v) -> int | None:
    try:
        return int(str(v).replace(",", "").strip())
    except (TypeError, ValueError):
        return None


def get_gold_rate() -> dict:
    """Get the current Thai gold price (96.5% gold, ทองรูปพรรณ/ทองแท่ง buy & sell).
    Call this when the user asks about gold prices or visits a gold shop.

    Returns:
        {"available": true, "bar_buy", "bar_sell", "ornament_buy", "ornament_sell",
         "unit": "บาท", "as_of": "...", "note": "ราคาโดยประมาณ ณ ตอนนี้"} on success,
        or {"available": false} if the rate can't be fetched (omit gold from the reply).
    """
    global _cache, _cache_at
    now = time.time()
    if _cache is not None and (now - _cache_at) < _CACHE_TTL:
        return _cache

    try:
        resp = httpx.get(_GOLD_API_URL, timeout=6.0)
        resp.raise_for_status()
        data = resp.json()
        # The chnwt mirror shape: {"response": {"price": {"gold": {...}, "gold_bar": {...}, "update_time": ...}}}
        price = (data.get("response") or {}).get("price") or data.get("price") or data
        bar = price.get("gold_bar") or price.get("gold_bullion") or {}
        orn = price.get("gold") or price.get("gold_jewelry") or {}
        result = {
            "available": True,
            "bar_buy": _to_int(bar.get("buy")),
            "bar_sell": _to_int(bar.get("sell")),
            "ornament_buy": _to_int(orn.get("buy")),
            "ornament_sell": _to_int(orn.get("sell")),
            "unit": "บาท (ทอง 96.5%)",
            "as_of": price.get("update_time") or data.get("response", {}).get("date") or "ล่าสุด",
            "note": "ราคาโดยประมาณ ณ ตอนนี้ / approximate, as of now",
        }
        # If every field came back empty the shape is wrong — treat as unavailable.
        if not any([result["bar_buy"], result["bar_sell"], result["ornament_buy"], result["ornament_sell"]]):
            return {"available": False}
        _cache, _cache_at = result, now
        return result
    except Exception:  # noqa: BLE001 — fail soft, never break the chat
        return {"available": False}
