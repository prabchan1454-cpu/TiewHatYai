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

const TABS = [
  { id: "home", key: "tab.home", icon: "🏠" },
  { id: "chat", key: "tab.chat", icon: "💬" },
  { id: "quests", key: "tab.quests", icon: "🎯" },
  { id: "recommend", key: "tab.recommend", icon: "⭐" },
  { id: "profile", key: "tab.profile", icon: "🏅" },
];

export default function App() {
  const progress = useProgress();
  const { state, update } = progress;
  const auth = useAuth();
  const { t } = useT();
  const [tab, setTab] = useState("home");

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
    <div className="mx-auto flex h-screen max-w-md flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          {auth.user?.photoURL ? (
            <img src={auth.user.photoURL} alt="" className="h-9 w-9 rounded-full" />
          ) : (
            <img src="/logo.svg" alt="TiewHatyai" className="h-9 w-9 rounded-lg" />
          )}
          <div>
            <h1 className="font-extrabold leading-none text-deep">{t("app.greeting", { name: displayName })}</h1>
            <p className="text-xs text-slate-400">{t("level." + lvl.name)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <div className="rounded-full bg-mango/15 px-3 py-1 text-sm font-bold text-sunset">
            ⚡ {state.xp} XP
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === "home" && <Home progress={progress} onNavigate={setTab} />}
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

      <nav className="grid grid-cols-5 border-t border-slate-200 bg-white">
        {TABS.map((tb) => {
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition ${
                tab === tb.id ? "text-sunset" : "text-slate-400"
              }`}
            >
              <span className="text-xl">{tb.icon}</span>
              {t(tb.key)}
            </button>
          );
        })}
      </nav>

      <RewardOverlay reward={progress.reward} onClose={progress.clearReward} />
    </div>
  );
}
