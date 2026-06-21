// What XP/levels actually unlock — the "reward the loop" payoff.
// Everything here is gated by LEVEL INDEX (see levelIndex in progress.js), so
// climbing levels turns XP into tangible perks: features (hidden-gems mode,
// expert quests) and cosmetics (titles, avatar frames, passport covers).
//
// Cosmetic `value`s are Tailwind class fragments applied inline by the screens,
// so no new theming system is needed. Labels are i18n keys resolved with t().

import { levelIndex, LEVELS } from "./progress";

// --- Cosmetic catalogs. `level` = the level index required to unlock. ---

export const TITLES = [
  { id: "explorer", level: 1, labelKey: "title.explorer" },
  { id: "master", level: 3, labelKey: "title.master" },
  { id: "legend", level: 4, labelKey: "title.legend" },
  { id: "ambassador", level: 5, labelKey: "title.ambassador" },
];

// `ring` is the avatar ring color class; default (no frame) keeps the plain ring.
export const FRAMES = [
  { id: "lagoon", level: 1, labelKey: "frame.lagoon", ring: "ring-lagoon" },
  { id: "mango", level: 3, labelKey: "frame.mango", ring: "ring-mango" },
  { id: "gold", level: 5, labelKey: "frame.gold", ring: "ring-amber-400" },
];

// `gradient` is the passport hero gradient; the default matches the original.
export const COVERS = [
  { id: "default", level: 0, labelKey: "cover.default", gradient: "from-boat to-gold" },
  { id: "sea", level: 2, labelKey: "cover.sea", gradient: "from-lae to-[#5FB8AE]" },
  { id: "night", level: 4, labelKey: "cover.night", gradient: "from-ink to-lae-deep" },
  { id: "gold", level: 5, labelKey: "cover.gold", gradient: "from-gold to-[#E6BE63]" },
];

export const DEFAULT_FRAME_RING = "ring-slate-100 dark:ring-slate-700";
export const DEFAULT_COVER = COVERS[0];

// Level index at which each feature unlocks.
const HIDDEN_GEMS_LEVEL = 2; // Adventurer
const EXPERT_QUESTS_LEVEL = 3; // Master

// The full perk ladder shown on the profile screen — one row per level that
// grants something, listing its perk label keys. `xp` is the threshold.
export const LADDER = [
  { level: 1, xp: LEVELS[1].min, perks: ["unlock.frameTitle"] },
  { level: 2, xp: LEVELS[2].min, perks: ["unlock.hiddenGems", "unlock.coverSea"] },
  { level: 3, xp: LEVELS[3].min, perks: ["unlock.expert", "unlock.frameMango", "unlock.titleMaster"] },
  { level: 4, xp: LEVELS[4].min, perks: ["unlock.coverNight", "unlock.titleLegend"] },
  { level: 5, xp: LEVELS[5].min, perks: ["unlock.frameGold", "unlock.coverGold", "unlock.titleAmbassador"] },
];

// Everything a player at `xp` has unlocked: feature flags + the cosmetic options
// they may equip (always includes the level-0 defaults).
export function getUnlocks(xp) {
  const idx = levelIndex(xp);
  const avail = (catalog) => catalog.filter((c) => idx >= c.level);
  return {
    levelIndex: idx,
    hiddenGems: idx >= HIDDEN_GEMS_LEVEL,
    expertQuests: idx >= EXPERT_QUESTS_LEVEL,
    titles: avail(TITLES),
    frames: avail(FRAMES),
    covers: avail(COVERS),
  };
}

// Resolve the ring class for the player's chosen frame id (falls back to plain).
export function frameRing(frameId) {
  return FRAMES.find((f) => f.id === frameId)?.ring || DEFAULT_FRAME_RING;
}

// Resolve the gradient class for the player's chosen cover id (falls back).
export function coverGradient(coverId) {
  return COVERS.find((c) => c.id === coverId)?.gradient || DEFAULT_COVER.gradient;
}

// Perks newly granted when crossing from one level index to another — used to
// tell the player exactly what they just earned in the level-up celebration.
export function perksForLevel(idx) {
  const row = LADDER.find((r) => r.level === idx);
  return row ? row.perks : [];
}
