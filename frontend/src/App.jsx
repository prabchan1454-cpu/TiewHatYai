import { useEffect, useState, lazy, Suspense } from "react";
import { useProgress, levelFor } from "./lib/progress";
import { useAuth } from "./lib/auth";
import { syncScore } from "./lib/leaderboard";
import { useT } from "./lib/i18n.jsx";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
// Secondary tabs are code-split so they (and their deps) load on first visit.
const Chat = lazy(() => import("./screens/Chat"));
const Quests = lazy(() => import("./screens/Quests"));
const Recommend = lazy(() => import("./screens/Recommend"));
const Achievements = lazy(() => import("./screens/Achievements"));
import RewardOverlay from "./components/RewardOverlay";
import Tutorial from "./components/Tutorial";
import Mascot from "./components/Mascot";
import { Spinner, LangToggle, ThemeToggle } from "./components/ui";
import { House, MessageCircle, Compass, Sparkles, Trophy, Zap } from "lucide-react";

const TABS = [
  { id: "home", key: "tab.home", Icon: House },
  { id: "chat", key: "tab.chat", Icon: MessageCircle },
  { id: "quests", key: "tab.quests", Icon: Compass },
  { id: "recommend", key: "tab.recommend", Icon: Sparkles },
  { id: "profile", key: "tab.profile", Icon: Trophy },
];
const TAB_ORDER = TABS.map((t) => t.id);

export default function App() {
  const progress = useProgress();
  const { state, update } = progress;
  const auth = useAuth();
  const { t } = useT();
  const [tab, setTab] = useState("home");
  const [slideDir, setSlideDir] = useState("right");

  // Keep the signed-in user's leaderboard row in sync with their XP/badges.
  // Runs before the early returns below so hook order stays stable.
  useEffect(() => {
    if (auth.user) {
      syncScore(auth.user, {
        xp: state.xp,
        level: levelFor(state.xp).name,
        badges: state.badges.length,
      });
    }
  }, [auth.user, state.xp, state.badges.length]);

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
      <div className="flex min-h-screen items-center justify-center">
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

  const lvl = levelFor(state.xp);
  const displayName = auth.user?.displayName?.split(" ")[0] || t("app.defaultName");

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-canvas dark:bg-[#0e1525]">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          {auth.user?.photoURL ? (
            <img src={auth.user.photoURL} alt="" className="h-9 w-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-700" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-mango/15 ring-2 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
              <Mascot size={34} />
            </span>
          )}
          <div>
            <h1 className="text-[15px] font-bold leading-tight text-deep dark:text-slate-100">{t("app.greeting", { name: displayName })}</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("level." + lvl.name)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LangToggle />
          <div className="flex items-center gap-1.5 rounded-full bg-deep px-3 py-1.5 text-sm font-bold text-white dark:bg-slate-800 dark:ring-1 dark:ring-white/10">
            <Zap className="h-3.5 w-3.5 text-mango" fill="currentColor" />
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
          {tab === "home" && <Home progress={progress} onNavigate={navigate} />}
          {tab === "chat" && <Chat greeting={null} />}
          {tab === "quests" && <Quests progress={progress} />}
          {tab === "recommend" && <Recommend preferences={state.preferences} onNavigate={navigate} />}
          {tab === "profile" && (
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

      <nav className="grid grid-cols-5 border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => navigate(tb.id)}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[12px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sunset/50 ${
                active ? "text-sunset" : "text-slate-400 hover:text-deep dark:hover:text-slate-100"
              }`}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-sunset" />
              )}
              <tb.Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              {t(tb.key)}
            </button>
          );
        })}
      </nav>

      <RewardOverlay reward={progress.reward} onClose={progress.clearReward} />

      {!state.tutorialSeen && <Tutorial onClose={() => update({ tutorialSeen: true })} />}
    </div>
  );
}
