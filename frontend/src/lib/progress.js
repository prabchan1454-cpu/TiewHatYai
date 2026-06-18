import { useCallback, useEffect, useState } from "react";

const KEY = "travelsongkhla_progress_v1";

// XP thresholds -> level. Index = level tier.
// Tuned for a short-trip travel companion, not a long-lived grind game: the
// first tier lands in ~1 quest for instant momentum, and the top tier is
// reachable over a dedicated trip (mixing quests, daily streaks, and stamps).
export const LEVELS = [
  { name: "Beginner", thai: "นักเที่ยวมือใหม่", min: 0 },
  { name: "Explorer", thai: "นักสำรวจ", min: 120 },
  { name: "Adventurer", thai: "นักผจญภัย", min: 320 },
  { name: "Master", thai: "เซียนสงขลา", min: 580 },
  { name: "Legend", thai: "ตำนานสงขลา", min: 880 },
  { name: "Ambassador", thai: "ทูตสงขลา", min: 1250 },
];

// Daily streak bonus: returning a few days running beats grinding many quests
// in one sitting. Escalates with the streak and caps so it stays balanced.
export const STREAK_BONUS_STEP = 15;
export const STREAK_BONUS_CAP = 5; // bonus stops growing after a 5-day streak
export function streakBonus(streak) {
  return Math.min(Math.max(streak, 0), STREAK_BONUS_CAP) * STREAK_BONUS_STEP;
}
// The streak value a daily completion *will* produce, given today's state —
// lets the UI preview the bonus before the state update lands.
export function nextStreak(daily) {
  if (!daily) return 1;
  return daily.completedDate === yesterdayStr() ? daily.streak + 1 : 1;
}

// Index of the level for a given XP — the basis for level-gated unlocks.
export function levelIndex(xp) {
  let idx = 0;
  LEVELS.forEach((lvl, i) => {
    if (xp >= lvl.min) idx = i;
  });
  return idx;
}

const DEFAULT = {
  xp: 0,
  preferences: null, // { categories, vibe, budget, companion, dateStart, dateEnd, duration, festivals }
  started: false, // passed the landing hero page
  guest: false, // chose to continue without signing in
  onboarded: false,
  tutorialSeen: false, // shown the feature walkthrough once after onboarding
  activeQuest: null, // current quest object the user is working on
  completedQuests: [], // [quest_name]
  history: [], // [{ quest_name, reward_xp, completedAt, isDaily }] newest first
  badges: [], // [{ badge_title, badge_description, flavor_text, rarity, earnedAt }]
  daily: { issuedDate: null, completedDate: null, streak: 0 }, // YYYY-MM-DD strings
  collectedStamps: [], // [{ id, collectedAt }] — Songkhla Passport landmark stamps
  unlockedLegends: [], // [{ id, unlockedAt }] — Legends & Mysteries visited/unlocked
  cosmetics: { title: null, frame: null, cover: null }, // chosen level-unlocked cosmetics
  surveyDone: false, // "รู้จักสงขลา" self-assessment survey shown once after onboarding
  surveyResponses: null, // { [questionId]: optionIndex }
};

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayStr(d);
}

export function levelFor(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) if (xp >= lvl.min) current = lvl;
  return current;
}

export function nextLevel(xp) {
  return LEVELS.find((l) => l.min > xp) || null;
}

function load() {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...DEFAULT };
  }
}

export function useProgress() {
  const [state, setState] = useState(load);
  const [reward, setReward] = useState(null); // { xp, badge } celebration

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const celebrate = useCallback((r) => setReward(r), []);
  const updateReward = useCallback(
    (patch) => setReward((r) => (r ? { ...r, ...patch } : r)),
    []
  );
  const clearReward = useCallback(() => setReward(null), []);

  const update = useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const completeQuest = useCallback((questName, xp, { isDaily = false } = {}) => {
    setState((s) => {
      const already = s.completedQuests.includes(questName);
      let daily = s.daily;
      let bonus = 0;
      if (isDaily) {
        const streak = s.daily.completedDate === yesterdayStr() ? s.daily.streak + 1 : 1;
        if (!already) bonus = streakBonus(streak);
        daily = { ...s.daily, completedDate: todayStr(), streak };
      }
      const base = already ? 0 : xp || 0;
      const entry = { quest_name: questName, reward_xp: base, bonus_xp: bonus, completedAt: Date.now(), isDaily };
      return {
        ...s,
        xp: s.xp + base + bonus,
        completedQuests: already ? s.completedQuests : [...s.completedQuests, questName],
        history: [entry, ...s.history],
        daily,
      };
    });
  }, []);

  const issueDaily = useCallback((quest) => {
    setState((s) => ({
      ...s,
      activeQuest: { ...quest, isDaily: true },
      daily: { ...s.daily, issuedDate: todayStr() },
    }));
  }, []);

  // Collect a Songkhla Passport stamp. Idempotent: a landmark stamps once and
  // its XP is awarded only on the first collect.
  const collectStamp = useCallback((id, xp) => {
    setState((s) => {
      if (s.collectedStamps.some((st) => st.id === id)) return s;
      return {
        ...s,
        xp: s.xp + (xp || 0),
        collectedStamps: [...s.collectedStamps, { id, collectedAt: Date.now() }],
      };
    });
  }, []);

  // Unlock a Legends & Mysteries story by visiting it. Idempotent: a story
  // unlocks once and its XP is awarded only on the first unlock.
  const unlockLegend = useCallback((id, xp) => {
    setState((s) => {
      const list = s.unlockedLegends || [];
      if (list.some((u) => u.id === id)) return s;
      return {
        ...s,
        xp: s.xp + (xp || 0),
        unlockedLegends: [...list, { id, unlockedAt: Date.now() }],
      };
    });
  }, []);

  const addBadge = useCallback((badge) => {
    setState((s) => {
      if (s.badges.some((b) => b.badge_title === badge.badge_title)) return s;
      return { ...s, badges: [...s.badges, { ...badge, earnedAt: Date.now() }] };
    });
  }, []);

  const reset = useCallback(() => setState({ ...DEFAULT }), []);

  return {
    state,
    update,
    completeQuest,
    issueDaily,
    addBadge,
    collectStamp,
    unlockLegend,
    reset,
    reward,
    celebrate,
    updateReward,
    clearReward,
  };
}
