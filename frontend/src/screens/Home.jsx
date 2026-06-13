import { Card, Button } from "../components/ui";
import WeatherCard from "../components/WeatherCard";
import { levelFor, nextLevel } from "../lib/progress";
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
} from "lucide-react";

const LINKS = [
  { id: "chat", Icon: MessageCircle, key: "chat", tint: "bg-sunset/10 text-sunset" },
  { id: "quests", Icon: Compass, key: "quests", tint: "bg-lagoon/10 text-lagoon" },
  { id: "recommend", Icon: Sparkles, key: "recommend", tint: "bg-mango/15 text-amber-600" },
  { id: "profile", Icon: Trophy, key: "profile", tint: "bg-deep/10 text-deep" },
];

export default function Home({ progress, onNavigate }) {
  const { t } = useT();
  const { state } = progress;
  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - lvl.min) / (next.min - lvl.min)) * 100))
    : 100;

  return (
    <div className="space-y-4 p-4 pb-6">
      <WeatherCard />

      {/* Committed navy hero — the one drenched moment on this screen */}
      <section className="rounded-3xl bg-deep p-5 text-white shadow-hero dark:ring-1 dark:ring-white/10">
        <div>
          <p className="text-xs font-medium text-white/55">{t("home.yourLevel")}</p>
          <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight">
            {t("level." + lvl.name)}
          </h2>
        </div>
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-mango transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">
            {next
              ? t("home.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
              : t("home.maxLevel")}
          </p>
        </div>
      </section>

      {/* Songkhla Passport — the signature "go there for real" feature */}
      <button
        onClick={() => onNavigate("passport")}
        className="flex w-full items-center gap-3 rounded-3xl bg-gradient-to-br from-sunset to-mango p-4 text-left text-deep shadow-hero transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/30">
          <Stamp className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-extrabold">{t("passport.homeCard")}</p>
          <p className="text-xs font-semibold opacity-80">
            {t("passport.progress", {
              done: (state.collectedStamps || []).length,
              total: LANDMARKS.length,
            })}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
      </button>

      {/* Community check-in feed */}
      <button
        onClick={() => onNavigate("checkins")}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-card transition duration-200 hover:shadow-lift active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40 dark:border-slate-800 dark:bg-slate-900"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
          <Users className="h-5 w-5" />
        </span>
        <p className="flex-1 font-semibold text-deep dark:text-slate-100">{t("checkin.homeCard")}</p>
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
      </button>

      {/* One stat card, split by a divider — not two identical big-number cards */}
      <Card className="flex items-stretch divide-x divide-slate-100 p-0 dark:divide-slate-800">
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
            <Flag className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep dark:text-slate-100">
              {state.completedQuests.length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t("home.questsDone")}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset/10 text-sunset">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep dark:text-slate-100">
              {state.badges.length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t("home.rewardsGot")}</p>
          </div>
        </div>
      </Card>

      {state.activeQuest ? (
        <Card>
          <div className="flex items-center gap-1.5 text-sunset">
            <Flag className="h-3.5 w-3.5" />
            <p className="text-xs font-bold">{t("home.activeQuest")}</p>
          </div>
          <h3 className="mt-2 font-bold text-deep dark:text-slate-100">{state.activeQuest.quest_name}</h3>
          <Button onClick={() => onNavigate("quests")} className="mt-3 w-full">
            {t("home.continueQuest")}
          </Button>
        </Card>
      ) : (
        <Card className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lagoon/10 text-lagoon">
            <Compass className="h-6 w-6" />
          </span>
          <p className="mt-3 font-bold text-deep dark:text-slate-100">{t("home.noActiveQuest")}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("home.noActiveQuestDesc")}</p>
          <Button onClick={() => onNavigate("quests")} variant="lagoon" className="mt-4 w-full">
            {t("home.getQuest")}
          </Button>
        </Card>
      )}

      <section>
        <h2 className="mb-2.5 px-1 text-sm font-bold text-deep dark:text-slate-100">{t("home.keepGoing")}</h2>
        <div className="space-y-2">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-card transition duration-200 hover:shadow-lift active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${l.tint}`}>
                <l.Icon className="h-5 w-5" />
              </span>
              <p className="flex-1 font-semibold text-deep dark:text-slate-100">{t(`home.link.${l.key}.title`)}</p>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
