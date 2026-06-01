import { useCallback, useEffect, useState } from "react";

const KEY = "tiewhatyai_progress_v1";

// XP thresholds -> level. Index = level tier.
export const LEVELS = [
  { name: "Beginner", thai: "นักเที่ยวมือใหม่", min: 0 },
  { name: "Explorer", thai: "นักสำรวจ", min: 200 },
  { name: "Adventurer", thai: "นักผจญภัย", min: 600 },
  { name: "Master", thai: "เซียนหาดใหญ่", min: 1200 },
];

const DEFAULT = {
  xp: 0,
  preferences: null, // { categories, vibe, budget, companion }
  started: false, // passed the landing hero page
  guest: false, // chose to continue without signing in
  onboarded: false,
  activeQuest: null, // current quest object the user is working on
  completedQuests: [], // [quest_name]
  history: [], // [{ quest_name, reward_xp, completedAt, isDaily }] newest first
  badges: [], // [{ badge_title, badge_description, flavor_text, rarity, earnedAt }]
  daily: { issuedDate: null, completedDate: null, streak: 0 }, // YYYY-MM-DD strings
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
      const entry = { quest_name: questName, reward_xp: xp || 0, completedAt: Date.now(), isDaily };
      let daily = s.daily;
      if (isDaily) {
        const streak = s.daily.completedDate === yesterdayStr() ? s.daily.streak + 1 : 1;
        daily = { ...s.daily, completedDate: todayStr(), streak };
      }
      return {
        ...s,
        xp: s.xp + (already ? 0 : xp || 0),
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
    reset,
    reward,
    celebrate,
    updateReward,
    clearReward,
  };
}
