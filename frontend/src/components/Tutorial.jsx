import { useState } from "react";
import { Button } from "./ui";
import Mascot from "./Mascot";
import { useT } from "../lib/i18n.jsx";
import { House, MessageCircle, Compass, Sparkles, Trophy, MapPinned, Camera, Star } from "lucide-react";

// Walkthrough steps. `key` maps to i18n entries tut.<key>.title / tut.<key>.desc.
const STEPS = [
  { Icon: MapPinned,      gradient: "from-sunset to-mango",          key: "intro" },
  { Icon: Camera,         gradient: "from-emerald-400 to-lagoon",     key: "gameloop" },
  { Icon: House,          gradient: "from-lagoon to-deep",            key: "home" },
  { Icon: MessageCircle,  gradient: "from-sky-400 to-lagoon",         key: "chat" },
  { Icon: Compass,        gradient: "from-amber-500 to-sunset",       key: "quests" },
  { Icon: Sparkles,       gradient: "from-violet-400 to-fuchsia-400", key: "recommend" },
  { Icon: Trophy,         gradient: "from-mango to-sunset",           key: "profile" },
];

function GameLoopDiagram({ t }) {
  const steps = [
    { emoji: "📍", label: t("tut.gameloop.step1") },
    { emoji: "📸", label: t("tut.gameloop.step2") },
    { emoji: "⚡", label: t("tut.gameloop.step3") },
  ];
  return (
    <div className="mx-auto flex max-w-xs items-center justify-center gap-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-lagoon text-2xl shadow-md">
              {s.emoji}
            </span>
            <span className="text-center text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-tight max-w-[56px]">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <span className="mb-5 text-lg font-extrabold text-mango">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

// First-run feature walkthrough, also replayable from the profile screen.
// Mirrors the onboarding step UI (icon + dots + back/next).
export default function Tutorial({ onClose }) {
  const { t } = useT();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);

  const step = STEPS[i];
  const Icon = step.Icon;
  const last = i === STEPS.length - 1;

  function go(n) {
    setDir(n > i ? "right" : "left");
    setAnimKey((k) => k + 1);
    setI(n);
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:hover:text-slate-100"
        >
          {t("tut.skip")}
        </button>

        <div
          key={animKey}
          className={`pt-4 ${dir === "right" ? "animate-slide-in-right" : "animate-slide-in-left"}`}
        >
          {step.key === "intro" ? (
            <Mascot size={96} className="mx-auto block" float interactive />
          ) : step.key === "gameloop" ? (
            <GameLoopDiagram t={t} />
          ) : (
            <span
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
            >
              <Icon className="h-10 w-10" strokeWidth={2} />
            </span>
          )}
          <h2 className="mt-4 text-center text-xl font-extrabold text-deep dark:text-slate-100">
            {t(`tut.${step.key}.title`)}
          </h2>
          <p className="mt-2 text-center leading-relaxed text-slate-600 dark:text-slate-300">
            {t(`tut.${step.key}.desc`)}
          </p>
        </div>

        <div className="my-5 flex justify-center gap-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === i ? "w-7 bg-sunset" : idx < i ? "w-2 bg-mango" : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {i > 0 && (
            <button
              onClick={() => go(i - 1)}
              className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("tut.back")}
            </button>
          )}
          <Button onClick={() => (last ? onClose() : go(i + 1))} className={i > 0 ? "flex-1" : "w-full"}>
            {last ? t("tut.done") : t("tut.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
