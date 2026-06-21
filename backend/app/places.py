"""Curated Songkhla place dataset + open/closed logic, exposed to น้องเที่ยว
as a Gemini tool (`lookup_places`).

The model has no reliable knowledge of opening hours or prices, so those facts
live here and are computed deterministically (Asia/Bangkok time). The model only
narrates the result in Nong Tiew's voice.
"""

import json
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from .gold import get_gold_rate  # re-exported as a tool from ai_client

_BANGKOK = ZoneInfo("Asia/Bangkok")
_DATA_FILE = Path(__file__).parent / "data" / "places.json"

with _DATA_FILE.open(encoding="utf-8") as fh:
    PLACES: list[dict] = json.load(fh)

# Categories that actually have data — used to answer "no data" politely.
CATEGORIES_WITH_DATA = {p["category"] for p in PLACES}

# Free-form words → canonical category id. Lets the model pass the user's own
# wording (Thai or English) and still resolve to our categories.
CATEGORY_ALIASES = {
    "restaurant": ["restaurant", "ร้านอาหาร", "อาหาร", "ของกิน", "ติ่มซำ", "ซีฟู้ด", "seafood", "food", "eat", "ร้านข้าว"],
    "cafe": ["cafe", "café", "คาเฟ่", "กาแฟ", "coffee", "ร้านกาแฟ", "ร้านนั่งชิล"],
    "hotel": ["hotel", "โรงแรม", "ที่พัก", "รีสอร์ท", "resort", "hostel", "โฮสเทล", "ที่นอน", "stay", "พัก"],
    "gold_shop": ["gold", "ทอง", "ร้านทอง", "ห้างทอง", "gold shop", "goldshop", "ทองคำ"],
    "pharmacy": ["pharmacy", "ร้านยา", "ขายยา", "ยา", "drug", "drugstore"],
    "market": ["market", "ตลาด", "ตลาดนัด", "night market", "ตลาดน้ำ", "floating market", "ของฝาก"],
}


def now_bangkok() -> datetime:
    return datetime.now(_BANGKOK)


def normalize_category(text: str) -> str | None:
    """Map a free-form category word to a canonical id, or None if unknown."""
    if not text:
        return None
    t = text.strip().lower()
    if t in CATEGORY_ALIASES:
        return t
    for cat, aliases in CATEGORY_ALIASES.items():
        if any(a in t for a in aliases):
            return cat
    return None


def _hm(s: str) -> int:
    h, m = s.split(":")
    return int(h) * 60 + int(m)


def compute_status(place: dict, now: datetime) -> dict:
    """Return {open_now, todays_hours, reliable} for a place at `now`.

    - hours_24 → always open.
    - hours missing/null → reliable=False, open_now=None (caller must hedge).
    - handles overnight ranges (close <= open) on both sides of midnight.
    """
    if place.get("hours_24"):
        return {"open_now": True, "todays_hours": "เปิด 24 ชั่วโมง", "reliable": True}

    hours = place.get("hours")
    if not hours:
        return {"open_now": None, "todays_hours": None, "reliable": False}

    cur = now.hour * 60 + now.minute
    today = now.weekday()          # Mon=0 .. Sun=6
    yesterday = (today - 1) % 7

    by_day: dict[int, list[dict]] = {}
    for h in hours:
        by_day.setdefault(h["day"], []).append(h)

    open_now = False
    for h in by_day.get(today, []):
        o, c = _hm(h["open"]), _hm(h["close"])
        if c > o:                  # same-day range
            if o <= cur < c:
                open_now = True
        else:                      # overnight: open this evening
            if cur >= o:
                open_now = True
    for h in by_day.get(yesterday, []):
        o, c = _hm(h["open"]), _hm(h["close"])
        if c <= o and cur < c:     # spillover from last night's overnight session
            open_now = True

    todays = by_day.get(today, [])
    if todays:
        label = ", ".join(f'{h["open"]}–{h["close"]}' for h in todays)
    elif open_now:
        label = "เปิดต่อเนื่องจากเมื่อคืน"
    else:
        label = "วันนี้ปิด"
    return {"open_now": open_now, "todays_hours": label, "reliable": True}


def format_place_for_model(place: dict, now: datetime) -> dict:
    st = compute_status(place, now)
    out = {
        "name": place["name_th"],
        "name_en": place.get("name_en"),
        "category": place["category"],
        "area": place["area"],
        "open_now": st["open_now"],        # True | False | None
        "todays_hours": st["todays_hours"],
        "hours_reliable": st["reliable"],
    }
    if place.get("phone"):
        out["phone"] = place["phone"]
    if place.get("details"):
        out["details"] = place["details"]
    return out


def lookup_places(query: str = "", category: str = "") -> dict:
    """Search the Songkhla place database for real opening hours, open/closed
    status (Asia/Bangkok), and prices. Call this whenever the user asks about a
    specific place or any category of place (restaurants, cafes, hotels, gold
    shops, pharmacies, markets, or anything else).

    Args:
        query: What the user is looking for — a place name, area, or keywords
            (e.g. "ร้านอาหารแถวสมิหลา", "Centara hotel"). May be empty.
        category: The place category the user asked about, in their own words
            (e.g. "ร้านอาหาร", "hotel", "ร้านทอง", "ร้านสักลาย"). Always pass this
            when the user asks about a category, so missing categories can be
            reported honestly.

    Returns:
        {"results": [places...]} where each place has open_now (true/false/null),
        todays_hours, hours_reliable, and any price details; or
        {"no_data_category": "<category>"} if that category isn't in the system;
        or {"results": []} if nothing matched.
    """
    cat_arg = (category or "").strip()
    cat_id = normalize_category(cat_arg) if cat_arg else None
    if cat_arg and (cat_id is None or cat_id not in CATEGORIES_WITH_DATA):
        return {"no_data_category": cat_arg}

    q = (query or "").strip().lower()
    if cat_id is None and q:
        cat_id = normalize_category(q)

    candidates = [p for p in PLACES if p["category"] == cat_id] if cat_id else list(PLACES)

    def score(p: dict) -> int:
        hay = f'{p["name_th"]} {p.get("name_en","")} {p["area"]}'.lower()
        return sum(1 for tok in q.split() if tok and tok in hay)

    if q:
        ranked = sorted(candidates, key=score, reverse=True)
        matched = [p for p in ranked if score(p) > 0]
        results = matched if matched else candidates
    else:
        results = candidates

    results = results[:5]
    if not results:
        return {"results": []}

    now = now_bangkok()
    return {"results": [format_place_for_model(p, now) for p in results]}


def _norm(s: str) -> str:
    return re.sub(r"[\s()\"'.,\-–]+", " ", (s or "").lower()).strip()


def match_place(name: str) -> dict | None:
    """Conservatively match an AI-recommended place name to a dataset entry.
    Containment either way on the normalized TH/EN name (min 6 chars to avoid
    trivial substring hits). Returns the place or None. Bias is toward NO match
    rather than a wrong one — better to show no status than the wrong hours.
    """
    n = _norm(name)
    if len(n) < 4:
        return None
    for p in PLACES:
        for c in (_norm(p["name_th"]), _norm(p.get("name_en", ""))):
            if len(c) >= 6 and (c in n or n in c):
                return p
    return None


def enrich_recommendation(name: str) -> dict | None:
    """For a recommended place, return real {open_now, todays_hours,
    hours_reliable, details} from the dataset if we have a confident match,
    else None (the card then shows no status — never a guessed one)."""
    p = match_place(name)
    if not p:
        return None
    st = compute_status(p, now_bangkok())
    out = {
        "open_now": st["open_now"],
        "todays_hours": st["todays_hours"],
        "hours_reliable": st["reliable"],
    }
    if p.get("details"):
        out["details"] = p["details"]
    return out


__all__ = [
    "lookup_places", "get_gold_rate", "now_bangkok", "compute_status",
    "match_place", "enrich_recommendation",
]
