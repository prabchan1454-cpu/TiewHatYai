"""TiewHatyai backend — a stateless Claude proxy for the 6 น้องเที่ยว prompts."""

from dotenv import load_dotenv

# override=True so a blank ANTHROPIC_API_KEY already in the environment
# can't shadow the real key in .env.
load_dotenv(override=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import ai_client as ai
from . import prompts, schemas

app = FastAPI(title="TiewHatyai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _guard(fn):
    """Run an AI call and turn failures into clean HTTP errors."""
    try:
        return fn()
    except Exception as exc:  # noqa: BLE001 — surface a friendly message to the demo UI
        raise HTTPException(status_code=502, detail=f"AI error: {exc}") from exc


@app.get("/api/health")
def health():
    return {"status": "ok", "guide": "น้องเที่ยว"}


# Prompt 5 — Onboarding greeting (natural text in the chosen language).
@app.post("/api/onboard")
def onboard(req: schemas.OnboardRequest | None = None):
    lang = req.lang if req else "th"
    text = _guard(
        lambda: ai.complete_text(
            prompts.ONBOARDING_PROMPT + prompts.lang_directive(lang),
            max_tokens=400,
            system=prompts.SYSTEM_PROMPT,
        )
    )
    return {"message": text}


# Prompt 1 — Main chat.
@app.post("/api/chat")
def chat(req: schemas.ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="messages cannot be empty")
    history = [{"role": m.role, "content": m.content} for m in req.messages]
    reply = _guard(lambda: ai.chat(history, lang=req.lang))
    return {"reply": reply}


# Prompt 2 — Quest generator.
@app.post("/api/quest", response_model=schemas.Quest)
def quest(req: schemas.QuestRequest):
    prompt = prompts.quest_prompt(req.user_location_area, req.user_level, req.completed_quests)
    data = _guard(lambda: ai.complete_json(prompt + prompts.lang_directive(req.lang)))
    return schemas.Quest(**data)


# Prompt 3 — Personalized recommendations (exactly 3 places).
@app.post("/api/recommend", response_model=schemas.Recommendations)
def recommend(req: schemas.RecommendRequest):
    prompt = prompts.recommend_prompt(req.categories, req.vibe, req.budget, req.companion)
    data = _guard(lambda: ai.complete_json(prompt + prompts.lang_directive(req.lang), max_tokens=1500))
    places = data if isinstance(data, list) else data.get("places", [])
    return schemas.Recommendations(places=[schemas.Place(**p) for p in places])


# Prompt 4 — Quest verification (optional photo).
@app.post("/api/verify", response_model=schemas.Verification)
def verify(req: schemas.VerifyRequest):
    prompt = prompts.verify_prompt(
        req.quest_name, req.quest_objective, req.location_hint, req.user_description
    )
    data = _guard(
        lambda: ai.complete_json(
            prompt + prompts.lang_directive(req.lang),
            image_base64=req.photo_base64,
            image_mime=req.photo_media_type,
        )
    )
    return schemas.Verification(**data)


# Prompt 6 — Badge description generator.
@app.post("/api/badge", response_model=schemas.Badge)
def badge(req: schemas.BadgeRequest):
    prompt = prompts.badge_prompt(req.badge_name, req.quest_completed)
    data = _guard(lambda: ai.complete_json(prompt + prompts.lang_directive(req.lang)))
    return schemas.Badge(**data)
