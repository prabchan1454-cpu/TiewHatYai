# Design

Visual system for TiewHatyai. Register: product. Direction: refined-playful — keep the warmth, drop the AI tells (gradient-on-every-card, emoji icon system, identical big-number stat grids, uniform rounded-3xl).

## Theme

Light, warm, mobile-first. A clean cool-white canvas lets the brand navy and the sunset/mango/lagoon accents do the work. Color strategy is **Restrained**: solid surfaces plus one accent per context. Exactly two surfaces earn a **Committed** treatment — the navy "level" hero and the Landing screen — so they read as deliberate moments, not the default.

## Color

Brand (unchanged identity, do not re-tint):
- `deep` #1b2a4a — navy. Headings, primary text, the one committed hero surface.
- `sunset` #ff7a45 — primary accent. Primary actions, active nav, current selection.
- `mango` #ffb020 — warm secondary. XP, rewards, streaks, progress fill.
- `lagoon` #0fb9b1 — cool accent. Secondary actions, location/quest hints, info.

Neutrals (Tailwind slate):
- canvas `#f7f8fb` (body), surface `white`, line `slate-200`, hairline `slate-100`.
- ink `deep` / `slate-900`; body `slate-700`; muted `slate-500` (floor for real text, ≥4.5:1); never slate-400/300 for text that carries meaning.

Rules: gradients are reserved for the two committed surfaces only. Semantic states use a fixed vocabulary — emerald (success/verified), amber (warning/almost), rose (error), sky/violet (badge rarity). Accent colors are for action and state, not decoration.

## Typography

One family: **Noto Sans Thai** (Thai + Latin), weights 400/500/600/700/800. Scale (rem, fixed not fluid):
- Hero number: 2rem–2.25rem / extrabold / `tabular-nums`
- Page title (h1): 1.25rem / bold
- Section (h2): 1rem–1.125rem / semibold
- Body: 0.875rem–1rem / regular, leading-relaxed
- Label / meta: 0.75rem / medium, `slate-500`, sentence case (no all-caps eyebrows)

Numbers (XP, stats, distances) use `tabular-nums` so they don't jitter.

## Iconography

**lucide-react** (MIT), stroke width 2, 18–24px, `currentColor`. Replaces all system/structural emoji (nav, onboarding section heads, quick-links, inline meta). Emoji are kept only as game-flavor content: badge faces, the 🐘 mascot, celebration. Place ranks render as numbered chips, not medal emoji.

Nav: House, MessageCircle, Compass, Sparkles, Trophy. Meta: MapPin, Clock, Camera, LocateFixed, Share2, ChevronRight.

## Components

- **Card**: `rounded-2xl`, white, `border border-slate-100`. Shadow only when elevated or interactive (`shadow-sm` resting → `shadow-md` hover). Not every card is shadowed; the hairline border is the default separator. No nested cards.
- **Hero (committed)**: `deep` navy fill, mango/orange accents, used once per screen max (level card).
- **Button**: `rounded-2xl`, weight 700, 200ms transition, `active:scale-95`, visible `focus-visible` ring. Variants: primary (sunset), lagoon, soft (white+border), ghost. Disabled dims + `cursor-not-allowed`.
- **Pill / chip**: `rounded-full`, `text-xs` 700. Toned by semantic role (rarity, difficulty, accent).
- **Stat row**: stats live in one bordered card split by dividers, NOT as separate identical big-number cards (kills the hero-metric tell).
- **Inputs**: hairline border, `focus:border-sunset` + `focus:ring-sunset/30`, placeholder at `slate-400` but real text at `slate-700+`.
- Every interactive control has default / hover / focus-visible / active / disabled.

## Layout

App shell: centered `max-w-md` column, sticky top bar, content scroll area, bottom tab bar. Spacing rhythm on a 4px grid; vary section spacing (don't stack identical `space-y-4` everywhere). Flex for 1D rows, grid only for true 2D. Touch targets ≥ 44px.

## Motion

150–250ms, ease-out. Tab change slides L/R; rewards pop; XP floats; lists may stagger. State-conveying only, no decorative loops. Every animation has a `prefers-reduced-motion: reduce` fallback (global override in index.css). No bounce/elastic on UI controls.
