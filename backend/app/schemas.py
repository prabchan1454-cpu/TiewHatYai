"""Pydantic models — request bodies and Claude structured-output schemas."""

from typing import Literal, Optional

from pydantic import BaseModel, Field

Difficulty = Literal["Easy", "Medium", "Hard"]
Level = Literal["Beginner", "Explorer", "Adventurer", "Master"]
Rarity = Literal["Common", "Rare", "Epic", "Legendary"]
Confidence = Literal["high", "medium", "low"]


# ---- Structured outputs returned by Claude ----

class Quest(BaseModel):
    quest_name: str
    quest_story: str
    difficulty: Difficulty
    objective: str
    location_hint: str
    reward_xp: int
    reward_badge: str


class Place(BaseModel):
    rank: int
    place_name: str
    category: str
    why_recommended: str
    highlight: str
    best_time: str
    local_tip: str
    approximate_area: str


class Recommendations(BaseModel):
    places: list[Place] = Field(..., description="Exactly 3 recommended places")


class Verification(BaseModel):
    verified: bool
    confidence: Confidence
    message: str
    partial_credit: bool
    feedback: str


class Badge(BaseModel):
    badge_title: str
    badge_description: str
    flavor_text: str
    rarity: Rarity


# ---- Request bodies from the frontend ----

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class QuestRequest(BaseModel):
    user_location_area: str = "หาดใหญ่"
    user_level: Level = "Beginner"
    completed_quests: list[str] = []


class RecommendRequest(BaseModel):
    categories: str
    vibe: str = ""
    budget: str = "ปานกลาง"
    companion: str = "คนเดียว"


class VerifyRequest(BaseModel):
    quest_name: str
    quest_objective: str
    location_hint: str = ""
    user_description: str
    photo_base64: Optional[str] = None
    photo_media_type: str = "image/jpeg"


class BadgeRequest(BaseModel):
    badge_name: str
    quest_completed: str
