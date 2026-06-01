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
  onboarded: false,
  activeQuest: null, // current quest object the user is working on
  completedQuests: [], // [quest_name]
  badges: [], // [{ badge_title, badge_description, flavor_text, rarity, earnedAt }]
};

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

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const completeQuest = useCallback((questName, xp) => {
    setState((s) => {
      if (s.completedQuests.includes(questName)) return s;
      return {
        ...s,
        xp: s.xp + (xp || 0),
        completedQuests: [...s.completedQuests, questName],
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

  return { state, update, completeQuest, addBadge, reset };
}
