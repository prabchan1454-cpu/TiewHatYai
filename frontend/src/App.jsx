import { useState } from "react";
import { useProgress, levelFor } from "./lib/progress";
import Landing from "./screens/Landing";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Quests from "./screens/Quests";
import Recommend from "./screens/Recommend";
import Achievements from "./screens/Achievements";
import RewardOverlay from "./components/RewardOverlay";

const TABS = [
  { id: "home", label: "หน้าหลัก", icon: "🏠" },
  { id: "chat", label: "น้องเที่ยว", icon: "💬" },
  { id: "quests", label: "เควส", icon: "🎯" },
  { id: "recommend", label: "แนะนำ", icon: "⭐" },
  { id: "profile", label: "รางวัล", icon: "🏅" },
];

export default function App() {
  const progress = useProgress();
  const { state, update } = progress;
  const [tab, setTab] = useState("home");

  if (!state.started) {
    return <Landing onStart={() => update({ started: true })} />;
  }

  if (!state.onboarded) {
    return (
      <Onboarding
        onDone={(preferences) => update({ onboarded: true, preferences })}
      />
    );
  }

  const lvl = levelFor(state.xp);

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="font-extrabold leading-none text-deep">เที่ยวหาดใหญ่</h1>
            <p className="text-xs text-slate-400">{lvl.thai}</p>
          </div>
        </div>
        <div className="rounded-full bg-mango/15 px-3 py-1 text-sm font-bold text-sunset">
          ⚡ {state.xp} XP
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === "home" && <Home progress={progress} onNavigate={setTab} />}
        {tab === "chat" && <Chat greeting={null} />}
        {tab === "quests" && <Quests progress={progress} />}
        {tab === "recommend" && <Recommend preferences={state.preferences} />}
        {tab === "profile" && <Achievements progress={progress} />}
      </main>

      <nav className="grid grid-cols-5 border-t border-slate-200 bg-white">
        {TABS.map((t) => {
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition ${
                tab === t.id ? "text-sunset" : "text-slate-400"
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </nav>

      <RewardOverlay reward={progress.reward} onClose={progress.clearReward} />
    </div>
  );
}
