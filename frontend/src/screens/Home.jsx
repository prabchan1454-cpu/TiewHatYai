import { Card, Button, XpBar } from "../components/ui";
import WeatherCard from "../components/WeatherCard";
import { levelFor, nextLevel } from "../lib/progress";
import { frameRing } from "../lib/unlocks";
import { LANDMARKS } from "../lib/landmarks";
import { useT } from "../lib/i18n.jsx";
import {
  MessageCircle,
  Compass,
  Sparkles,
  Trophy,
  Flag,
  Award,
  ChevronRight,
  Stamp,
  Users,
  Zap,
  MapPin,
} from "lucide-react";
import Mascot from "../components/Mascot";

const LINKS = [
  {
    id: "chat",
    Icon: MessageCircle,
    key: "chat",
    glow: "shadow-[0_0_16px_rgba(15,185,177,0.4)]",
    iconBg: "bg-lagoon/20 text-lagoon",
    border: "border-lagoon/20",
  },
  {
    id: "quests",
    Icon: Compass,
    key: "quests",
    glow: "shadow-[0_0_16px_rgba(255,122,69,0.4)]",
    iconBg: "bg-sunset/20 text-sunset",
    border: "border-sunset/20",
  },
  {
    id: "recommend",
    Icon: Sparkles,
    key: "recommend",
    glow: "shadow-[0_0_16px_rgba(255,176,32,0.4)]",
    iconBg: "bg-mango/20 text-mango",
    border: "border-mango/20",
  },
  {
    id: "profile",
    Icon: Trophy,
    key: "profile",
    glow: "shadow-[0_0_16px_rgba(168,85,247,0.4)]",
    iconBg: "bg-purple-500/20 text-purple-400",
    border: "border-purple-500/20",
  },
];

export default function Home({ progress, onNavigate }) {
  const { t } = useT();
  const { state } = progress;
  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - lvl.min) / (next.min - lvl.min)) * 100))
    : 100;
  const stampsCount = (state.collectedStamps || []).length;
  const stampPct = Math.round((stampsCount / LANDMARKS.length) * 100);

  return (
    <div className="space-y-4 p-4 pb-6">
      <WeatherCard />

      {/* ── Player Hero Card ──────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-hero-mesh-light p-5 shadow-hero dark:bg-hero-mesh">
        {/* decorative compass texture */}
        <svg className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-5 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="50" x2="95" y2="50" />
          <polygon points="50,10 54,40 50,45 46,40" fill="currentColor" stroke="none" />
        </svg>

        {/* Level + XP */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-deep/40 dark:text-white/40">
              {t("home.yourLevel")}
            </p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-deep dark:text-white">
              {t("level." + lvl.name)}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-mango/20 px-3 py-1.5 text-sm font-extrabold text-mango">
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            <span className="tnum">{state.xp} XP</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <XpBar xp={state.xp} min={lvl.min} max={next?.min ?? lvl.min + 1} />
          <p className="mt-1.5 text-[11px] text-deep/50 dark:text-white/45">
            {next
              ? t("home.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
              : t("home.maxLevel")}
          </p>
        </div>

        {/* Quick stats */}
        <div className="mt-4 flex gap-2">
          {[
            { icon: Flag, label: t("home.questsDone"), value: state.completedQuests.length, color: "text-sunset" },
            { icon: Stamp, label: t("passport.progress", { done: stampsCount, total: LANDMARKS.length }), value: `${stampPct}%`, color: "text-mango" },
            { icon: Award, label: t("home.rewardsGot"), value: state.badges.length, color: "text-lagoon" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-deep/8 py-2.5 dark:bg-white/8">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className={`tnum text-base font-extrabold text-deep dark:text-white`}>{value}</span>
              <span className="text-center text-[9px] leading-tight text-deep/40 dark:text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Passport CTA ─────────────────────────────────────────── */}
      <button
        onClick={() => onNavigate("passport")}
        className="group flex w-full items-center gap-3 rounded-3xl bg-gradient-to-br from-sunset to-mango p-4 text-left text-deep shadow-[0_8px_24px_rgba(255,122,69,0.35)] transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/30 group-hover:bg-white/40 transition">
          <Stamp className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-extrabold">{t("passport.homeCard")}</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-deep/20">
            <div className="h-full rounded-full bg-deep/60 transition-all duration-500" style={{ width: `${stampPct}%` }} />
          </div>
          <p className="mt-0.5 text-xs font-semibold opacity-70">
            {stampsCount} / {LANDMARKS.length} stamps
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
      </button>

      {/* ── Community check-in ───────────────────────────────────── */}
      <button
        onClick={() => onNavigate("checkins")}
        className="flex w-full items-center gap-3 rounded-2xl border border-lagoon/20 bg-lagoon/5 p-3.5 text-left transition duration-200 hover:bg-lagoon/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/20 text-lagoon">
          <Users className="h-5 w-5" />
        </span>
        <p className="flex-1 font-semibold text-slate-900 dark:text-white">{t("checkin.homeCard")}</p>
        <ChevronRight className="h-5 w-5 shrink-0 text-lagoon/50" />
      </button>

      {/* ── Active quest or CTA ──────────────────────────────────── */}
      {state.activeQuest ? (
        <div className="rounded-3xl bg-white border border-sunset/25 p-4 shadow-[0_0_20px_rgba(255,122,69,0.08)] dark:bg-[#0e1a2e] dark:shadow-[0_0_20px_rgba(255,122,69,0.12)]">
          <div className="flex items-center gap-1.5 text-sunset">
            <Flag className="h-3.5 w-3.5" />
            <p className="text-xs font-bold uppercase tracking-wide">{t("home.activeQuest")}</p>
          </div>
          <h3 className="mt-2 font-bold text-slate-900 dark:text-white">{state.activeQuest.quest_name}</h3>
          <Button onClick={() => onNavigate("quests")} variant="game" className="mt-3 w-full">
            {t("home.continueQuest")}
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 p-4 text-center dark:bg-[#0e1a2e] dark:border-white/10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lagoon/15 text-lagoon">
            <Compass className="h-6 w-6" />
          </span>
          <p className="mt-3 font-bold text-slate-900 dark:text-white">{t("home.noActiveQuest")}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("home.noActiveQuestDesc")}</p>
          <Button onClick={() => onNavigate("quests")} variant="game" className="mt-4 w-full">
            {t("home.getQuest")}
          </Button>
        </div>
      )}

      {/* ── Navigation shortcuts ─────────────────────────────────── */}
      <section>
        <h2 className="mb-2.5 px-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
          {t("home.keepGoing")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className={`flex flex-col items-start gap-3 rounded-2xl border ${l.border} bg-white p-4 text-left transition duration-200 hover:${l.glow} active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 dark:bg-[#0e1a2e]`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${l.iconBg}`}>
                <l.Icon className="h-5 w-5" />
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">{t(`home.link.${l.key}.title`)}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
