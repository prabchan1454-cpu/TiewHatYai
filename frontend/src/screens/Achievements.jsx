import { levelFor, nextLevel } from "../lib/progress";
import { Card, Pill } from "../components/ui";
import { useT } from "../lib/i18n.jsx";
import { Trophy, Flag, Award, Share2, Sunrise } from "lucide-react";

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
    <div className="space-y-4 p-4 pb-6">
      <section className="rounded-3xl bg-deep p-5 text-white shadow-hero">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-mango">
            <Trophy className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-medium text-white/55">{t("ach.yourLevel")}</p>
            <h2 className="text-2xl font-extrabold tracking-tight">{t("level." + lvl.name)}</h2>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/60">
            <span className="tnum">{state.xp} XP</span>
            <span>
              {next
                ? t("ach.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
                : t("ach.max")}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-mango transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <Card className="flex items-stretch divide-x divide-slate-100 p-0">
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset/10 text-sunset">
            <Flag className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep">{state.completedQuests.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{t("ach.questsDone")}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep">{state.badges.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{t("ach.badgesGot")}</p>
          </div>
        </div>
      </Card>

      <section>
        <h3 className="mb-2.5 px-1 text-sm font-bold text-deep">{t("ach.heading")}</h3>
        {state.badges.length === 0 ? (
          <Card className="text-center text-sm text-slate-500">{t("ach.noBadges")}</Card>
        ) : (
          <div className="space-y-2.5">
            {state.badges.map((b) => (
              <Card key={b.badge_title} className={`ring-1 ${RARITY_RING[b.rarity] || "ring-slate-200"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-extrabold text-deep">{b.badge_title}</h4>
                  <Pill>{b.rarity}</Pill>
                </div>
                <p className="mt-1 text-sm text-slate-600">{b.badge_description}</p>
                <p className="mt-1.5 text-sm italic text-sunset">“{b.flavor_text}”</p>
                <button
                  onClick={() => shareBadge(b)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-deep transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/30"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {t("ach.share")}
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2.5 px-1 text-sm font-bold text-deep">{t("ach.history")}</h3>
        {state.history.length === 0 ? (
          <Card className="text-center text-sm text-slate-500">{t("ach.noHistory")}</Card>
        ) : (
          <div className="space-y-2">
            {state.history.map((h, i) => (
              <Card key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    {h.isDaily ? <Sunrise className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate font-semibold text-deep">{h.quest_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.completedAt).toLocaleDateString(
                        lang === "en" ? "en-US" : "th-TH",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <span className="tnum shrink-0 text-sm font-bold text-sunset">+{h.reward_xp} XP</span>
              </Card>
            ))}
          </div>
        )}
      </section>

      {auth?.user && (
        <Card className="flex items-center gap-3">
          {auth.user.photoURL && (
            <img src={auth.user.photoURL} alt="" className="h-10 w-10 rounded-full ring-2 ring-slate-100" />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-semibold text-deep">{auth.user.displayName}</p>
            <p className="truncate text-xs text-slate-500">{auth.user.email}</p>
          </div>
        </Card>
      )}

      <div className="space-y-1 pt-1">
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
    </div>
  );
}
