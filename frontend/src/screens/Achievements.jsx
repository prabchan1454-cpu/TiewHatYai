import { levelFor, nextLevel } from "../lib/progress";
import { Card, Pill } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

const RARITY_RING = {
  Common: "ring-slate-200",
  Rare: "ring-sky-300",
  Epic: "ring-violet-300",
  Legendary: "ring-amber-300",
};

export default function Achievements({ progress, auth, onLogout }) {
  const { t, lang } = useT();
  const { state, reset } = progress;
  async function shareBadge(b) {
    const text = t("ach.shareText", { title: b.badge_title, desc: b.flavor_text || b.badge_description });
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: b.badge_title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`.trim());
        alert(t("ach.copied"));
      }
    } catch {
      /* user cancelled the share sheet — ignore */
    }
  }

  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - lvl.min) / (next.min - lvl.min)) * 100))
    : 100;

  return (
    <div className="space-y-4 px-4 py-4">
      <Card className="bg-gradient-to-br from-deep to-lagoon text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
            🧭
          </div>
          <div>
            <p className="text-sm text-white/70">{t("ach.yourLevel")}</p>
            <h2 className="text-2xl font-extrabold">{t("level." + lvl.name)}</h2>
            <p className="text-xs text-white/70">{lvl.name}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>{state.xp} XP</span>
            <span>
              {next
                ? t("ach.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
                : t("ach.max")}
            </span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-mango transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-3xl font-extrabold text-sunset">{state.completedQuests.length}</p>
          <p className="text-sm text-slate-500">{t("ach.questsDone")}</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-extrabold text-lagoon">{state.badges.length}</p>
          <p className="text-sm text-slate-500">{t("ach.badgesGot")}</p>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 px-1 font-extrabold text-deep">{t("ach.heading")}</h3>
        {state.badges.length === 0 ? (
          <Card className="text-center text-slate-500">
            {t("ach.noBadges")}
          </Card>
        ) : (
          <div className="space-y-3">
            {state.badges.map((b) => (
              <Card key={b.badge_title} className={`ring-2 ${RARITY_RING[b.rarity] || "ring-slate-200"}`}>
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-extrabold text-deep">{b.badge_title}</h4>
                  <Pill>{b.rarity}</Pill>
                </div>
                <p className="text-sm text-slate-600">{b.badge_description}</p>
                <p className="mt-1 text-sm italic text-sunset">“{b.flavor_text}”</p>
                <button
                  onClick={() => shareBadge(b)}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-deep transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/30"
                >
                  🔗 {t("ach.share")}
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 px-1 font-extrabold text-deep">{t("ach.history")}</h3>
        {state.history.length === 0 ? (
          <Card className="text-center text-slate-500">{t("ach.noHistory")}</Card>
        ) : (
          <div className="space-y-2">
            {state.history.map((h, i) => (
              <Card key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-lg">{h.isDaily ? "🌅" : "🎯"}</span>
                  <div className="overflow-hidden">
                    <p className="truncate font-bold text-deep">{h.quest_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.completedAt).toLocaleDateString(
                        lang === "en" ? "en-US" : "th-TH",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-sunset">+{h.reward_xp} XP</span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {auth?.user && (
        <Card className="flex items-center gap-3">
          {auth.user.photoURL && (
            <img src={auth.user.photoURL} alt="" className="h-10 w-10 rounded-full" />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-bold text-deep">{auth.user.displayName}</p>
            <p className="truncate text-xs text-slate-500">{auth.user.email}</p>
          </div>
        </Card>
      )}

      {auth?.enabled && (
        <button
          onClick={onLogout}
          className="w-full rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          {auth.user ? t("ach.logout") : t("ach.login")}
        </button>
      )}

      <button
        onClick={() => {
          if (confirm(t("ach.resetConfirm"))) reset();
        }}
        className="w-full rounded-xl py-2 text-sm text-slate-500 transition hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
      >
        {t("ach.reset")}
      </button>
    </div>
  );
}
