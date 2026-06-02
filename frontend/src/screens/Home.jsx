import { Card, Button } from "../components/ui";
import { levelFor, nextLevel } from "../lib/progress";
import { useT } from "../lib/i18n.jsx";

const LINKS = [
  { id: "chat", icon: "💬", key: "chat" },
  { id: "quests", icon: "🎯", key: "quests" },
  { id: "recommend", icon: "⭐", key: "recommend" },
  { id: "profile", icon: "🏅", key: "profile" },
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
    <div className="space-y-4 p-4">
      <Card className="bg-gradient-to-br from-sunset to-mango text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">{t("home.yourLevel")}</p>
            <h2 className="text-2xl font-extrabold">{t("level." + lvl.name)}</h2>
          </div>
          <div className="rounded-full bg-white/20 px-4 py-2 text-lg font-bold">
            ⚡ {state.xp} XP
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-white/80">
            {next
              ? t("home.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
              : t("home.maxLevel")}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <div className="text-3xl font-extrabold text-lagoon">{state.completedQuests.length}</div>
          <p className="text-xs font-semibold text-slate-500">{t("home.questsDone")}</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-extrabold text-sunset">{state.badges.length}</div>
          <p className="text-xs font-semibold text-slate-500">{t("home.rewardsGot")}</p>
        </Card>
      </div>

      {state.activeQuest ? (
        <Card className="border-2 border-sunset/30">
          <p className="text-xs font-bold uppercase text-sunset">{t("home.activeQuest")}</p>
          <h3 className="mt-1 font-bold text-deep">{state.activeQuest.quest_name}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {state.activeQuest.objective}
          </p>
          <Button onClick={() => onNavigate("quests")} className="mt-3 w-full">
            {t("home.continueQuest")}
          </Button>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-lagoon/15 to-mango/10 text-center">
          <p className="font-bold text-deep">{t("home.noActiveQuest")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("home.noActiveQuestDesc")}</p>
          <Button onClick={() => onNavigate("quests")} variant="lagoon" className="mt-3 w-full">
            {t("home.getQuest")}
          </Button>
        </Card>
      )}

      <div>
        <p className="mb-2 px-1 font-bold text-deep">{t("home.keepGoing")}</p>
        <div className="grid grid-cols-1 gap-2">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm shadow-slate-200/60 transition duration-200 hover:shadow-md hover:shadow-slate-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40"
            >
              <span className="text-2xl">{l.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-deep">{t(`home.link.${l.key}.title`)}</p>
                <p className="text-xs text-slate-500">{t(`home.link.${l.key}.desc`)}</p>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
