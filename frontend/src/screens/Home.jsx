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
  HeartPulse,
  BookOpen,
  Brain,
  Store,
  BarChart3,
} from "lucide-react";
import Mascot from "../components/Mascot";
import WovenBand from "../components/WovenBand";

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
    glow: "shadow-[0_0_16px_rgba(201,150,47,0.4)]",
    iconBg: "bg-gold/20 text-gold",
    border: "border-gold/25",
  },
];

// "Super-app" services beyond tourism — the modules that answer the judges'
// "expand beyond tourism" + "entertainment" + "business value" feedback.
const MORE = [
  { id: "essentials", Icon: HeartPulse, titleKey: "ess.homeCard",   descKey: "ess.homeCardDesc",   iconBg: "bg-boat/15 text-boat",   border: "border-boat/25" },
  { id: "legends",    Icon: BookOpen,   titleKey: "leg.homeCard",   descKey: "leg.homeCardDesc",   iconBg: "bg-ink/10 text-ink dark:bg-white/10 dark:text-plaster", border: "border-ink/15 dark:border-white/15" },
  { id: "quiz",       Icon: Brain,      titleKey: "quiz.homeCard",  descKey: "quiz.homeCardDesc",  iconBg: "bg-lae/15 text-lae-deep dark:text-lae", border: "border-lae/25" },
  { id: "businesses", Icon: Store,      titleKey: "biz.homeCard",   descKey: "biz.homeCardDesc",   iconBg: "bg-sage/20 text-sage",   border: "border-sage/30" },
  { id: "impact",     Icon: BarChart3,  titleKey: "impact.homeCard", descKey: "impact.homeCardDesc", iconBg: "bg-gold/15 text-gold",  border: "border-gold/25" },
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

      {/* ── Player Hero — "level signboard" (เมืองเก่า meets ทะเล) ──── */}
      <section className="relative overflow-hidden rounded-3xl bg-lae shadow-hero dark:bg-lae-deep">
        {/* Koh Yo woven stripe — signature element */}
        <WovenBand className="h-2.5" />

        {/* faint sun-over-sea glow */}
        <div className="pointer-events-none absolute right-0 top-2 h-40 w-40 rounded-full opacity-25 blur-2xl" style={{ background: "radial-gradient(circle, #E6BE63, transparent 70%)" }} />

        <div className="relative p-5">
          {/* Level + XP */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-plaster/70">
                {t("home.yourLevel")}
              </p>
              <h2 className="font-display mt-1 text-[28px] leading-none text-plaster">
                {t("level." + lvl.name)}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-sm font-extrabold text-ink shadow-[0_2px_8px_rgba(201,150,47,0.45)]">
              <Zap className="h-3.5 w-3.5" fill="currentColor" />
              <span className="tnum">{state.xp} XP</span>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <XpBar
              xp={state.xp}
              min={lvl.min}
              max={next?.min ?? lvl.min + 1}
              trackClass="bg-ink/25"
              fillClass="bg-gradient-to-r from-gold to-[#E6BE63]"
            />
            <p className="mt-1.5 text-[11px] font-medium text-plaster/75">
              {next
                ? t("home.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
                : t("home.maxLevel")}
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-4 flex gap-2">
            {[
              { icon: Flag, label: t("home.questsDone"), value: state.completedQuests.length, color: "text-gold" },
              { icon: Stamp, label: t("passport.progress", { done: stampsCount, total: LANDMARKS.length }), value: `${stampPct}%`, color: "text-plaster" },
              { icon: Award, label: t("home.rewardsGot"), value: state.badges.length, color: "text-boat" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-ink/15 py-2.5">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="tnum text-base font-extrabold text-plaster">{value}</span>
                <span className="text-center text-[9px] leading-tight text-plaster/55">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adventure Map CTA ────────────────────────────────────── */}
      <button
        onClick={() => onNavigate("map")}
        className="group flex w-full items-center gap-3 rounded-3xl bg-gradient-to-br from-lagoon to-deep p-4 text-left text-white shadow-[0_8px_24px_rgba(15,185,177,0.3)] transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/50"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 transition group-hover:bg-white/30">
          <MapPin className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-extrabold">{t("map.homeCard")}</p>
          <p className="mt-0.5 text-xs font-semibold opacity-80">{t("map.explored", { done: stampsCount, total: LANDMARKS.length })}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
      </button>

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

      {/* ── More services (super-app modules) ────────────────────── */}
      <section>
        <h2 className="mb-2.5 px-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
          {t("home.moreTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {MORE.map((m) => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className={`flex flex-col items-start gap-2 rounded-2xl border ${m.border} bg-white p-3 text-left transition duration-200 active:scale-[0.97] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 dark:bg-[#0e1a2e] dark:hover:bg-white/5`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${m.iconBg}`}>
                <m.Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">{t(m.titleKey)}</span>
                <span className="mt-0.5 block text-[11px] leading-tight text-slate-500 dark:text-slate-400">{t(m.descKey)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

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
