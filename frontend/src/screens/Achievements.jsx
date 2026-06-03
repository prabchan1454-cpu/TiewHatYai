import { useState } from "react";
import { levelFor, nextLevel } from "../lib/progress";
import { Card, Pill, Button } from "../components/ui";
import Leaderboard from "../components/Leaderboard";
import TripDates from "../components/TripDates";
import { useT } from "../lib/i18n.jsx";
import { tripMeta } from "../lib/festivals";
import { Trophy, Flag, Award, Share2, Sunrise, CalendarDays } from "lucide-react";

const RARITY_RING = {
  Common: "ring-slate-200 dark:ring-slate-700",
  Rare: "ring-sky-300 dark:ring-sky-500/40",
  Epic: "ring-violet-300 dark:ring-violet-500/40",
  Legendary: "ring-amber-300 dark:ring-amber-500/40",
};

export default function Achievements({ progress, auth, onLogout }) {
  const { t, lang } = useT();
  const { state, reset, update } = progress;

  // Editable travel dates — the only way to change them after onboarding
  // without wiping all progress via reset().
  const [tripStart, setTripStart] = useState(state.preferences?.dateStart || "");
  const [tripEnd, setTripEnd] = useState(state.preferences?.dateEnd || "");
  const [tripSaved, setTripSaved] = useState(false);
  const trip = tripMeta(tripStart, tripEnd);
  const tripDirty =
    tripStart !== (state.preferences?.dateStart || "") ||
    tripEnd !== (state.preferences?.dateEnd || "");

  function saveTrip() {
    update({
      preferences: {
        ...state.preferences,
        dateStart: tripStart,
        dateEnd: tripEnd,
        duration: t("onboard.date.days", { n: trip.days }),
        festivals: trip.festivalKeys,
      },
    });
    setTripSaved(true);
    setTimeout(() => setTripSaved(false), 2000);
  }
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
      <section className="rounded-3xl bg-deep p-5 text-white shadow-hero dark:ring-1 dark:ring-white/10">
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

      <Card className="flex items-stretch divide-x divide-slate-100 p-0 dark:divide-slate-800">
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset/10 text-sunset">
            <Flag className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep dark:text-slate-100">{state.completedQuests.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t("ach.questsDone")}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="tnum text-xl font-extrabold leading-none text-deep dark:text-slate-100">{state.badges.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t("ach.badgesGot")}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunset/10 text-sunset">
            <CalendarDays className="h-5 w-5" />
          </span>
          <h3 className="font-bold text-deep dark:text-slate-100">{t("trip.heading")}</h3>
        </div>
        <TripDates start={tripStart} end={tripEnd} onStart={setTripStart} onEnd={setTripEnd} />
        <Button
          onClick={saveTrip}
          disabled={!trip.valid || !tripDirty}
          className="w-full"
        >
          {tripSaved ? t("trip.saved") : t("trip.save")}
        </Button>
      </Card>

      <Leaderboard
        auth={auth}
        self={{ xp: state.xp, level: lvl.name }}
        onLogin={auth?.signInGoogle}
      />

      <section>
        <h3 className="mb-2.5 px-1 text-sm font-bold text-deep dark:text-slate-100">{t("ach.heading")}</h3>
        {state.badges.length === 0 ? (
          <Card className="text-center text-sm text-slate-500 dark:text-slate-400">{t("ach.noBadges")}</Card>
        ) : (
          <div className="space-y-2.5">
            {state.badges.map((b) => (
              <Card key={b.badge_title} className={`ring-1 ${RARITY_RING[b.rarity] || "ring-slate-200 dark:ring-slate-700"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-extrabold text-deep dark:text-slate-100">{b.badge_title}</h4>
                  <Pill>{b.rarity}</Pill>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{b.badge_description}</p>
                <p className="mt-1.5 text-sm italic text-sunset">“{b.flavor_text}”</p>
                <button
                  onClick={() => shareBadge(b)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-deep transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/30 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
        <h3 className="mb-2.5 px-1 text-sm font-bold text-deep dark:text-slate-100">{t("ach.history")}</h3>
        {state.history.length === 0 ? (
          <Card className="text-center text-sm text-slate-500 dark:text-slate-400">{t("ach.noHistory")}</Card>
        ) : (
          <div className="space-y-2">
            {state.history.map((h, i) => (
              <Card key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {h.isDaily ? <Sunrise className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate font-semibold text-deep dark:text-slate-100">{h.quest_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
            <img src={auth.user.photoURL} alt="" className="h-10 w-10 rounded-full ring-2 ring-slate-100 dark:ring-slate-700" />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-semibold text-deep dark:text-slate-100">{auth.user.displayName}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{auth.user.email}</p>
          </div>
        </Card>
      )}

      <div className="space-y-1 pt-1">
        {auth?.enabled && (
          <button
            onClick={onLogout}
            className="w-full rounded-xl py-2 text-sm font-semibold text-slate-600 transition hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {auth.user ? t("ach.logout") : t("ach.login")}
          </button>
        )}

        <button
          onClick={() => {
            if (confirm(t("ach.resetConfirm"))) reset();
          }}
          className="w-full rounded-xl py-2 text-sm text-slate-500 transition hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:text-slate-400"
        >
          {t("ach.reset")}
        </button>
      </div>
    </div>
  );
}
