# Product

## Register

product

## Users

Thai travelers, mostly students and young adults, exploring จังหวัดสงขลา (Songkhla province) — from หาดใหญ่ (Hat Yai) to เมืองสงขลา (the old town and Samila Beach), เกาะยอ and nearby districts. They use the app on a phone, one-handed, often outdoors and on the move: deciding where to eat, what to see, and chasing quests for fun. Thai-first, with an English toggle. Built for the "I-New Gen" competition, so it is also judged as a portfolio piece.

## Product Purpose

A gamified AI travel companion that turns sightseeing into a game you have to *actually go and play*. Where typical travel apps are passive ("read reviews and info"), Travel Songkhla is active: the guide "น้องเที่ยว" answers questions and hands out quests, but earning rewards requires **visiting the real place and submitting a photo the AI verifies** — so going-for-real beats faking it.

The loop is built around three signature pillars:
- **Photo-verified quests** (incl. souvenir-hunt quests that send travelers to local shops).
- **Songkhla Passport** — collect a stamp at each of 12 iconic landmarks across the province, shown on a map, to spread visitors province-wide rather than clustering in Hat Yai.
- **Community check-ins** — a shared feed + map where signed-in travelers post where they've been, so real people promote Songkhla organically.

Personal progress (XP, level, badges, stamps) lives in localStorage so the app works instantly even without login; the backend is a thin stateless AI proxy, while leaderboard and check-ins use Firebase. Success means a traveler opens it, gets a useful quest or recommendation in seconds, goes somewhere real, and comes back to collect more.

## Brand Personality

Friendly, local, energetic, trustworthy. The voice is a warm Thai friend who knows Songkhla well, not a corporate brochure. Three words: playful, warm, guiding. It should feel designed and intentional, not like a generic template.

## Anti-references

- The "generic AI gamified app": emoji used as the icon system, gradients on every card, identical big-number stat cards, everything the same rounded-3xl pill.
- Corporate fintech/SaaS coldness. This is travel and play, not a banking dashboard.
- Over-decoration: glassmorphism, neon, bouncy motion, sticker overload.

## Design Principles

1. **Intentional warmth.** The fun is carried by color, type, and one or two delight moments, not by decorating every surface. Restraint is what separates "designed" from "AI made it".
2. **Built for the thumb, outdoors.** Mobile-first, high-contrast, large touch targets, readable in sunlight.
3. **One clear action per screen.** The traveler is mid-trip; the primary thing to do should be obvious.
4. **Reward the loop.** Quests, XP, and badges are the heart; their moments should feel earned and celebratory without becoming noise.
5. **Local, not generic.** Lean on the Songkhla / southern-Thai identity — the Golden Mermaid, the Sino-Portuguese old town, the lake and the sea — in copy and imagery rather than stock travel clichés.

## Accessibility & Inclusion

Target WCAG AA: body text ≥ 4.5:1, interactive controls have visible keyboard focus, all animation respects `prefers-reduced-motion`. Thai and English must both render cleanly in Noto Sans Thai. Touch targets ≥ 44px.
