# TiewHatyai — Product & Competition Strategy

> **TiewHatyai (เที่ยวหาดใหญ่)** — a gamified tourism **and local-living super-app** for Hat Yai & Songkhla. Discover attractions, eat, explore verified quests, and also find hospitals, emergencies, transport, local legends, and deals — all in one app.

This document is the product strategy for the startup/innovation competition. It responds point-by-point to the judges' 9 comments and pairs each strategic claim with something **already shipping in the product** (so the demo backs the pitch).

---

## TL;DR — the one-paragraph pitch

Every other map app tells you *where* a place is. TiewHatyai makes you *go* — with **photo-verified quests** that prove a real visit, a **30-stamp passport** that deliberately spreads tourists across all 10 districts of Songkhla (not just Hat Yai's 3 famous spots), and a **local-living layer** (hospitals, emergency SOS, transport, legends, deals) that turns a one-trip tourist app into a **daily-use app for residents too**. It routes real foot traffic to local SMEs and gives the city a live map of where visitors actually go. Nobody else combines verified gamified exploration + hyperlocal culture + local-living utility for this region.

---

## A. Impact & Outcomes

### Measurable benefits by stakeholder
| Stakeholder | Benefit | Proof in product |
|---|---|---|
| **Tourists** | Faster planning, discovery beyond the obvious, safer trips | AI guide, verified quests, Essentials/SOS |
| **Residents** | Daily utility: health, emergency, transport, public services | Local Living module |
| **Businesses / SMEs** | Free verified listing + paid promotion + routed foot traffic | Souvenir quests → `community:true` landmarks; Business portal |
| **Government / DMO (TAT, municipality)** | Anonymized map of where visitors actually go → evidence for tourism-spreading policy | Per-district stamp data; Impact dashboard |

### KPIs / success metrics
- **Engagement:** DAU/MAU, D1/D7/D30 retention, sessions/week, streak distribution.
- **Tourism spread:** stamps per district, quests completed, unique landmarks visited (proves redistribution beyond Hat Yai).
- **Economic:** businesses listed, promotions redeemed, souvenir-quest completions, estimated routed foot traffic.
- **Social:** check-ins, likes/replies, verified UGC photos.
- **Utility/safety:** emergency-info opens, essential-service lookups.

### How to demonstrate impact during judging
1. Open the **live Impact dashboard** (real numbers from local progress + Firestore, seeded for demo).
2. Run the **verified-quest loop live** (snap → AI verifies → XP) — tangible "real visit" proof that can't be faked.
3. Show the **per-district stamp spread** as evidence the platform redistributes tourism away from Hat Yai's core.

---

## B. Platform Expansion — "Local Living" hub

New categories (curated, same data shape as the existing landmarks dataset):

| Category | Examples | Why it adds value |
|---|---|---|
| **Healthcare** | สงขลานครินทร์ (ม.อ.), หาดใหญ่, กรุงเทพหาดใหญ่, ราษฎร์ยินดี; clinics, 24h pharmacies | #1 trust/safety gap in tourism apps; makes app useful to residents |
| **Emergency** | One-tap SOS: 1669 medical · 191 police · 199 fire · 1155 tourist police | Genuine social value; judges explicitly asked |
| **Transport** | Hat Yai Int'l Airport, Junction railway, BKS terminal, songthaew routes, border vans, Ko Yo ferry | Solves the hardest part of a southern-Thailand trip |
| **Public services** | Municipality, immigration, post, banks/ATM, tourist police, Malaysian consulate | Utility for residents + cross-border visitors |
| **Education & lifestyle** | ม.อ., ม.ทักษิณ, ราชภัฏ; markets, gyms, co-working, places of worship | Engages the huge student/resident base → daily users |
| **Residential / relocation** | Neighborhood guides, rough rent ranges | Serves the "moving to Hat Yai" long tail |

---

## C. Business Model & Monetization

**Revenue streams (layered):**
1. **Freemium business listings** — free basic; **Premium** adds photos/video, promotions, top placement, analytics, review replies.
2. **Featured / sponsored placement** — paid appearance in recommendations, map pins, "near you" (labeled).
3. **Promotion / coupon engine** — deals redeemed via in-app QR; fee or rev-share per redemption.
4. **Sponsored quests** — a shop sponsors a quest routing players to it (unique to this app's mechanic).
5. **DMO / government** — sell anonymized tourism-flow dashboards + run official campaigns.
6. **Affiliate** — hotels/tours/transport referrals.
7. **Cosmetic IAP** (later) — optional passport/cosmetic packs; gameplay stays free.

**Pricing (affordable for local SMEs):**

| Tier | Price | Includes |
|---|---|---|
| **Starter** | ฿0 | Basic verified listing, map pin, 1 photo |
| **Pro** | ฿199/mo | Gallery, 1 active promotion, review replies, basic analytics |
| **Premium** | ฿499/mo | Top placement, unlimited promos, sponsored-quest eligibility, full analytics |

Annual discount; **first 3 months free** for early adopters to seed the directory; **pay-per-result** options (per redemption / featured-day) so micro-businesses pay only for outcomes.

**Revenue opportunity (illustrative, conservative):** Hat Yai + Songkhla hold thousands of F&B/retail SMEs. 500 paying businesses × ฿250/mo avg ≈ **฿1.5M/yr recurring**, before sponsored quests, coupon rev-share, and DMO contracts.

---

## D. Self-Service Business Portal

A `business` role + Firestore-backed flow (mirrors the existing check-in data pattern) lets owners:
- **Register / claim** a profile (name, category, GPS, hours, contact).
- **Upload photos/videos** (reuses the in-app image-compression pipeline).
- **Manage promotions** (title, % off, valid dates, redemption QR).
- **Respond to reviews / check-ins**.
- **View analytics** (views, map taps, promo redemptions, quest routes).
- **Buy ad packages** (featured placement, sponsored quest) — checkout via PromptPay/Stripe.

**Competition MVP:** directory + self-service submission form + promotions display + a simple analytics card. (Full ad checkout = roadmap.)

---

## E. Unique Competitive Advantage

| Competitor | What they do | Gap TiewHatyai fills |
|---|---|---|
| **Google Maps** | Comprehensive, generic | No gamification, no curation, no local culture/legends, thin Thai hyperlocal depth |
| **TripAdvisor / Traveloka** | Booking + reviews | Foreign-tourist-centric, thin on Songkhla's small towns, nothing for residents |
| **Wongnai** | Food/restaurant reviews | No exploration game, no passport, no living/emergency utility |
| **TAT / municipal sites** | Static brochures | No engagement, no UGC, not mobile-native |

**The moat (what nobody else offers):**
1. **Photo-verified, gamified exploration** — XP/passport/badges tied to *proven* real visits.
2. **Hyperlocal + community-driven** — curated for *this* province in Thai, plus resident UGC.
3. **Tourism + Local-Living super-app** — the only app serving tourists *and* residents.
4. **Legends / mysteries / fortune layer** — culture as playable content; impossible to copy at scale.
5. **Routes real foot traffic to local SMEs** → measurable economic value.

---

## F. Feature Innovation (40 features by category)

**Tourism:** (1) verified passport ✅ (2) AI itinerary builder (3) themed trails — street-art/temple/seafood (4) audio walking tours (5) "near me now" suggestions (6) multi-day route planner.

**Local Living:** (7) hospital/clinic finder ✅ (8) 24h pharmacy locator ✅ (9) transport hub + songthaew guide ✅ (10) public-services directory ✅ (11) ATM/bank/exchange finder (12) neighborhood/relocation guide.

**Entertainment:** (13) local legends library ✅ (14) ghost-story night trails ✅ (15) fortune/sacred-wish spots ✅ (16) urban-legend map (17) interactive AI storytelling (18) "mystery of the week".

**Community:** (19) check-in feed ✅ (20) likes/replies ✅ (21) user-submitted hidden gems (22) local-guide profiles (23) photo contests.

**AI:** (24) AI trip planner (25) AI legend-narrator (26) AI photo verification ✅ (27) personalized daily push.

**Gamification:** (28) quests ✅ (29) daily streaks ✅ (30) achievements/collections ✅ (31) district-completion challenges (32) seasonal/festival events ✅ + (33) local trivia quiz ✅.

**Business Tools:** (34) self-service listing ✅ (35) promotions/coupons ✅ (36) sponsored quests (37) business analytics (38) featured placement.

**Safety & Emergency:** (39) one-tap SOS dialer ✅ (40) nearest-hospital locator + offline emergency card ✅.

(✅ = shipped or shipping in this competition build.)

---

## G. Engagement & Retention

- **Daily quest + streak** ✅ — surfaced prominently; add streak-freeze reward.
- **Daily login reward + "mystery of the day"** legend/quiz to pull users back.
- **Collections** — district sets, legend sets, food sets → badge + cosmetic on completion.
- **Rankings** — overall + **weekly** + quiz leaderboards (weekly resets re-engage).
- **Exploration challenges** — "visit 3 districts this month"; seasonal/festival quests ✅.
- **Push notifications** (PWA infra ready) — daily quest, nearby legend, friend check-in.
- **Seasonal events** — Songkran / vegetarian-festival limited badges & quests.

---

## H. Hidden Gems & Entertainment (the differentiator)

A **"ตำนานหาดใหญ่–สงขลา / Legends & Mysteries"** module — each story anchored to a real landmark coordinate, so reading drives a real visit:
- **Secret locations / hidden gems** (extends the existing hidden-gems AI mode).
- **Mystery trails** — multi-stop story quests.
- **Fortune-telling / sacred-wish spots** — shrines with etiquette + a "make a wish" interaction.
- **Local legends** — ตำนานหัวนายแรง (Kao Seng), หลวงปู่ทวด (Wat Pha Kho), the Golden Mermaid, old-town tales.
- **Ghost stories / night trails** — opt-in evening engagement.
- **Cultural mysteries** — Chino-Portuguese / plural-culture puzzles.
- **Treasure hunts** — photo-verified clue chains (reuse the quest+verify engine).
- **Interactive storytelling** — chat-driven branching stories with น้องเที่ยว.

**Why it works:** entertainment that *teaches local culture*, generates UGC, can't be replicated by global apps, and routes visits to real (often community) sites — engagement + cultural preservation + economic value in one feature.

---

## I. Competition-Winning Strategy

**What makes it stand out**
- A working, polished, *deployable* product (not a mockup) with a tight verified gameplay loop.
- Clear **dual value: tourists + residents** super-app — broader impact than any pure tourism entry.
- **Measurable** economic + social + tourism-spread impact, on a live dashboard.
- A genuinely **unique, culture-rich entertainment layer** no competitor has.

**What judges will find most impressive**
- The photo-verified anti-cheat quest loop.
- The live Impact/KPI dashboard.
- The self-service business-portal MVP (shows a scalable model).
- The Legends module (memorable, demoable, local).

**Weaknesses addressed before presenting**
| Weakness | Fix |
|---|---|
| Thin "beyond tourism" content | Local Living module |
| No demonstrated business/monetization | Business directory MVP + pricing |
| Engagement claims unquantified | Impact dashboard |
| Brand/scope confusion (Songkhla vs Hat Yai) | Rebrand to **TiewHatyai**, dual-area positioning |
| Half-built social features | Finish likes/replies |

---

## Roadmap

**Phase 1 — Competition build (now, ~2 weeks):** Rebrand → Local Living + SOS → Legends & Mysteries → Local quiz → check-in likes/replies → Impact dashboard → business directory MVP.

**Phase 2 — Post-competition (1–3 mo):** Full business portal + payments (PromptPay), promotion QR redemption, sponsored quests, push notifications, weekly leaderboard.

**Phase 3 — Scale (3–12 mo):** DMO data partnership, expand to neighboring southern provinces, native apps, audio tours, AI itinerary planner.

---

## KPI scorecard (targets for pilot)

| Metric | Target (3-mo pilot) |
|---|---|
| MAU | 5,000 |
| D7 retention | ≥ 25% |
| Stamps collected across ≥ 7 districts | ≥ 60% of active users |
| Businesses listed | 200 (50 paid) |
| Quests completed | 15,000 |
| Emergency/essential lookups | 3,000 |
