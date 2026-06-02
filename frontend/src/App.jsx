import { useState } from "react";
import { useProgress, levelFor } from "./lib/progress";
import { useAuth } from "./lib/auth";
import { useT } from "./lib/i18n.jsx";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Quests from "./screens/Quests";
import Recommend from "./screens/Recommend";
import Achievements from "./screens/Achievements";
import RewardOverlay from "./components/RewardOverlay";
import { Spinner, LangToggle } from "./components/ui";
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
    <div className="mx-auto flex h-screen max-w-md flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          {auth.user?.photoURL ? (
            <img src={auth.user.photoURL} alt="" className="h-9 w-9 rounded-full ring-2 ring-slate-100" />
          ) : (
            <img src="/logo.svg" alt="TiewHatyai" className="h-9 w-9 rounded-xl" />
          )}
          <div>
            <h1 className="text-[15px] font-bold leading-tight text-deep">{t("app.greeting", { name: displayName })}</h1>
            <p className="text-xs font-medium text-slate-500">{t("level." + lvl.name)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <div className="flex items-center gap-1.5 rounded-full bg-deep px-3 py-1.5 text-sm font-bold text-white">
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
        {tab === "home" && <Home progress={progress} onNavigate={navigate} />}
        {tab === "chat" && <Chat greeting={null} />}
        {tab === "quests" && <Quests progress={progress} />}
        {tab === "recommend" && <Recommend preferences={state.preferences} />}
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
      </main>

      <nav className="grid grid-cols-5 border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => navigate(tb.id)}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sunset/50 ${
                active ? "text-sunset" : "text-slate-400 hover:text-deep"
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
    </div>
  );
}
