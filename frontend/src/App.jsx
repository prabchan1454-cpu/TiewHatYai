import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { useProgress, levelFor, levelIndex, LEVELS } from "./lib/progress";
import { frameRing, perksForLevel, TITLES } from "./lib/unlocks";
import { useAuth } from "./lib/auth";
import { syncScore } from "./lib/leaderboard";
import { useT } from "./lib/i18n.jsx";
import { initAudioUnlock } from "./lib/sfx";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Onboarding from "./screens/Onboarding";
import Survey from "./screens/Survey";
import Home from "./screens/Home";
const Chat = lazy(() => import("./screens/Chat"));
const Quests = lazy(() => import("./screens/Quests"));
const Recommend = lazy(() => import("./screens/Recommend"));
const Achievements = lazy(() => import("./screens/Achievements"));
const Passport = lazy(() => import("./screens/Passport"));
const Checkins = lazy(() => import("./screens/Checkins"));
const AdventureMap = lazy(() => import("./screens/AdventureMap"));
const Essentials = lazy(() => import("./screens/Essentials"));
const Legends = lazy(() => import("./screens/Legends"));
const Quiz = lazy(() => import("./screens/Quiz"));
const Businesses = lazy(() => import("./screens/Businesses"));
const Impact = lazy(() => import("./screens/Impact"));
import RewardOverlay from "./components/RewardOverlay";
import Tutorial from "./components/Tutorial";
import Mascot from "./components/Mascot";
import { Spinner, LangToggle, ThemeToggle } from "./components/ui";
import { House, MessageCircle, Compass, Sparkles, Trophy, Zap } from "lucide-react";

const TABS = [
  { id: "home",      key: "tab.home",      Icon: House },
  { id: "chat",      key: "tab.chat",      Icon: MessageCircle },
  { id: "quests",    key: "tab.quests",    Icon: Compass },
  { id: "recommend", key: "tab.recommend", Icon: Sparkles },
  { id: "profile",   key: "tab.profile",   Icon: Trophy },
];
const TAB_ORDER = TABS.map((t) => t.id);

export default function App() {
  const progress = useProgress();
  const { state, update } = progress;
  const auth = useAuth();
  const { t } = useT();
  const [tab, setTab] = useState("home");
  const [slideDir, setSlideDir] = useState("right");

  // Unlock Web Audio on the first user gesture so effect-triggered SFX
  // (reward overlay, level-up) aren't silenced by the autoplay policy.
  useEffect(() => { initAudioUnlock(); }, []);

  useEffect(() => {
    if (auth.user) {
      syncScore(auth.user, {
        xp: state.xp,
        level: levelFor(state.xp).name,
        badges: state.badges.length,
      });
    }
  }, [auth.user, state.xp, state.badges.length]);

  const prevLevelIdx = useRef(levelIndex(state.xp));
  useEffect(() => {
    const idx = levelIndex(state.xp);
    if (idx > prevLevelIdx.current) {
      progress.celebrate({
        levelUp: t("level." + LEVELS[idx].name),
        unlocked: perksForLevel(idx).map((p) => t(p)),
      });
    }
    prevLevelIdx.current = idx;
  }, [state.xp, progress, t]);

  function navigate(newTab) {
    const oldIdx = TAB_ORDER.indexOf(tab);
    const newIdx = TAB_ORDER.indexOf(newTab);
    setSlideDir(newIdx >= oldIdx ? "right" : "left");
    setTab(newTab);
  }

  if (!state.started) {
    return <Landing onStart={() => update({ started: true })} />;
  }

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4fc] dark:bg-[#0e1525]">
        <Spinner label={t("app.loading")} />
      </div>
    );
  }

  if (!auth.user && !state.guest) {
    return <Login auth={auth} onGuest={() => update({ guest: true })} />;
  }

  if (!state.onboarded) {
    return (
      <Onboarding
        onDone={(preferences) => update({ onboarded: true, preferences })}
      />
    );
  }

  if (!state.surveyDone) {
    return (
      <Survey
        onDone={(responses) => update({ surveyDone: true, surveyResponses: responses })}
      />
    );
  }

  const lvl = levelFor(state.xp);
  const equippedTitle = TITLES.find((x) => x.id === state.cosmetics?.title);
  const displayName =
    auth.user?.displayName?.split(" ")[0] || state.preferences?.name || t("app.defaultName");

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-[#f0f4fc] dark:bg-[#0a1120]">
      {/* Game HUD Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-white/8 dark:bg-deep/95">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {auth.user?.photoURL ? (
              <img
                src={auth.user.photoURL}
                alt=""
                className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-deep ${frameRing(state.cosmetics?.frame)}`}
              />
            ) : (
              <span className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-mango/20 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-deep ${frameRing(state.cosmetics?.frame)}`}>
                <Mascot size={34} />
              </span>
            )}
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-deep bg-emerald-400" />
          </div>
          <div>
            <h1 className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white">
              {t("app.greeting", { name: displayName })}
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-white/50">
              {equippedTitle ? t(equippedTitle.labelKey) : t("level." + lvl.name)}
            </p>
          </div>
        </div>

        {/* Right: XP + toggles */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LangToggle />
          <div className="flex items-center gap-1 rounded-full bg-mango/20 px-3 py-1.5 text-xs font-extrabold text-mango shadow-[0_0_12px_rgba(255,176,32,0.3)]">
            <Zap className="h-3 w-3" fill="currentColor" />
            <span className="tnum">{state.xp}</span>
          </div>
        </div>
      </header>

      <main
        key={tab}
        className={`flex-1 overflow-y-auto no-scrollbar ${
          slideDir === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
        }`}
      >
        <Suspense fallback={<div className="flex justify-center p-10"><Spinner label={t("app.loading")} /></div>}>
          {tab === "home"      && <Home progress={progress} onNavigate={navigate} />}
          {tab === "passport"  && <Passport progress={progress} onBack={() => navigate("home")} />}
          {tab === "checkins"  && <Checkins auth={auth} onBack={() => navigate("home")} />}
          {tab === "map"       && <AdventureMap progress={progress} onNavigate={navigate} onBack={() => navigate("home")} />}
          {tab === "essentials" && <Essentials onBack={() => navigate("home")} />}
          {tab === "legends"   && <Legends progress={progress} onNavigate={navigate} onBack={() => navigate("home")} />}
          {tab === "quiz"      && <Quiz progress={progress} onBack={() => navigate("home")} />}
          {tab === "businesses" && <Businesses auth={auth} onBack={() => navigate("home")} />}
          {tab === "impact"    && <Impact progress={progress} onBack={() => navigate("home")} />}
          {tab === "chat"      && <Chat greeting={null} />}
          {tab === "quests"    && <Quests progress={progress} />}
          {tab === "recommend" && <Recommend preferences={state.preferences} xp={state.xp} onNavigate={navigate} />}
          {tab === "profile"   && (
            <Achievements
              progress={progress}
              auth={auth}
              onLogout={() => {
                auth.logout();
                update({ guest: false });
              }}
            />
          )}
        </Suspense>
      </main>

      {/* Game-inspired bottom nav */}
      <nav className="grid grid-cols-5 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-white/8 dark:bg-deep/95">
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => navigate(tb.id)}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sunset/50 ${
                active ? "text-sunset" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {/* Glowing active dot above icon */}
              {active && (
                <span className="absolute top-0.5 h-1 w-1 rounded-full bg-sunset nav-glow-sunset" />
              )}
              <tb.Icon
                className={`h-5 w-5 transition-transform duration-200 ${active ? "scale-110" : ""}`}
                strokeWidth={active ? 2.4 : 1.8}
              />
              <span className={active ? "text-sunset" : "text-slate-500 dark:text-slate-600"}>
                {t(tb.key)}
              </span>
            </button>
          );
        })}
      </nav>

      <RewardOverlay reward={progress.reward} onClose={progress.clearReward} />

      {!state.tutorialSeen && <Tutorial onClose={() => update({ tutorialSeen: true })} />}
    </div>
  );
}
