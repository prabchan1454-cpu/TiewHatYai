import { useState } from "react";
import { levelFor, nextLevel } from "../lib/progress";
import { TITLES, frameRing } from "../lib/unlocks";
import { Button, XpBar, RarityBadge } from "../components/ui";
import Leaderboard from "../components/Leaderboard";
import TripDates from "../components/TripDates";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";
import { tripMeta } from "../lib/festivals";
import {
  Trophy, Flag, Award, Share2, Sunrise, CalendarDays,
  HelpCircle, Zap,
} from "lucide-react";

export default function Achievements({ progress, auth, onLogout }) {
  const { t, lang } = useT();
  const { state, reset, update } = progress;

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
    } catch { /* user cancelled */ }
  }

  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const equippedTitle = TITLES.find((x) => x.id === state.cosmetics?.title);

  return (
    <div className="space-y-4 p-4 pb-6">
      {/* Hero level card */}
      <section className="relative overflow-hidden rounded-3xl bg-hero-mesh-light p-5 shadow-hero dark:bg-hero-mesh">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mango/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mango/20 text-mango shadow-[0_0_16px_rgba(255,176,32,0.3)]">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-deep/40 dark:text-white/40">{t("ach.yourLevel")}</p>
            <h2 className="font-display text-2xl text-deep dark:text-white">{t("level." + lvl.name)}</h2>
            {equippedTitle && (
              <span className="mt-1 inline-block rounded-full border border-mango/30 bg-mango/15 px-2.5 py-0.5 text-[11px] font-bold text-mango">
                {t(equippedTitle.labelKey)}
              </span>
            )}
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="flex items-center gap-1 rounded-full bg-mango/20 px-3 py-1 text-sm font-extrabold text-mango">
              <Zap className="h-3.5 w-3.5" fill="currentColor" /> {state.xp}
            </span>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-[11px] text-deep/40 dark:text-white/40 mb-1.5">
            <span className="tnum">{state.xp} XP</span>
            <span>
              {next
                ? t("ach.toNext", { xp: next.min - state.xp, level: t("level." + next.name) })
                : t("ach.max")}
            </span>
          </div>
          <XpBar xp={state.xp} min={lvl.min} max={next?.min ?? lvl.min + 1} />
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { Icon: Flag,  value: state.completedQuests.length, label: t("ach.questsDone"), color: "text-sunset", bg: "bg-sunset/15" },
          { Icon: Award, value: state.badges.length,          label: t("ach.badgesGot"),  color: "text-lagoon",  bg: "bg-lagoon/15" },
        ].map(({ Icon, value, label, color, bg }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 p-4 dark:bg-[#0e1a2e] dark:border-white/10">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="tnum text-xl font-extrabold leading-none text-slate-900 dark:text-white">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trip dates */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 space-y-3 dark:bg-[#0e1a2e] dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunset/15 text-sunset">
            <CalendarDays className="h-5 w-5" />
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white">{t("trip.heading")}</h3>
        </div>
        <TripDates start={tripStart} end={tripEnd} onStart={setTripStart} onEnd={setTripEnd} />
        <Button onClick={saveTrip} disabled={!trip.valid || !tripDirty} variant="game" className="w-full">
          {tripSaved ? t("trip.saved") : t("trip.save")}
        </Button>
      </div>

      {/* Leaderboard */}
      <Leaderboard auth={auth} self={{ xp: state.xp, level: lvl.name }} onLogin={auth?.signInGoogle} />

      {/* Badges */}
      <section>
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          {t("ach.heading")}
        </h3>
        {state.badges.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center text-sm text-slate-500 dark:bg-[#0e1a2e] dark:border-white/8">
            {t("ach.noBadges")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {state.badges.map((b) => (
              <div
                key={b.badge_title}
                className={`rounded-2xl p-4 ${
                  b.rarity === "Legendary" ? "rarity-legendary bg-amber-50 dark:bg-[#1a0e00]" :
                  b.rarity === "Epic"      ? "rarity-epic bg-purple-50 dark:bg-[#140e2a]" :
                  b.rarity === "Rare"      ? "rarity-rare bg-blue-50 dark:bg-[#0d1e35]" :
                                             "rarity-common bg-slate-50 dark:bg-[#0e1a2e]"
                } ${b.rarity === "Legendary" ? "shimmer-bg" : ""}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-2xl">🏅</span>
                  <RarityBadge rarity={b.rarity} />
                </div>
                <h4 className="mt-2 text-sm font-extrabold text-slate-900 leading-tight dark:text-white">{b.badge_title}</h4>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 dark:text-slate-400">{b.badge_description}</p>
                {b.flavor_text && (
                  <p className="mt-1 text-[11px] italic text-sunset line-clamp-1">"{b.flavor_text}"</p>
                )}
                <button
                  onClick={() => shareBadge(b)}
                  className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-200 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                >
                  <Share2 className="h-3 w-3" />
                  {t("ach.share")}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          {t("ach.history")}
        </h3>
        {state.history.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center text-sm text-slate-500 dark:bg-[#0e1a2e] dark:border-white/8">
            {t("ach.noHistory")}
          </div>
        ) : (
          <div className="space-y-2">
            {state.history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3 dark:bg-[#0e1a2e] dark:border-white/8">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400">
                  {h.isDaily ? <Sunrise className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{h.quest_name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(h.completedAt).toLocaleDateString(
                      lang === "en" ? "en-US" : "th-TH",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
                <span className="tnum shrink-0 flex items-center gap-0.5 text-sm font-bold text-mango">
                  <Zap className="h-3 w-3" /> +{h.reward_xp}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User card */}
      <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 p-4 dark:bg-[#0e1a2e] dark:border-white/10">
        {auth?.user?.photoURL ? (
          <img src={auth.user.photoURL} alt="" className={`h-12 w-12 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0e1a2e] ${frameRing(state.cosmetics?.frame)}`} />
        ) : (
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mango/15 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0e1a2e] ${frameRing(state.cosmetics?.frame)}`}>
            <Mascot size={44} />
          </span>
        )}
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-semibold text-slate-900 dark:text-white">{auth?.user?.displayName || t("app.defaultName")}</p>
          <p className="truncate text-xs text-slate-500">{auth?.user?.email || t("level." + lvl.name)}</p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="space-y-1 pt-1">
        <button
          onClick={() => update({ tutorialSeen: false })}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/30"
        >
          <HelpCircle className="h-4 w-4" />
          {t("ach.replayTutorial")}
        </button>

        {auth?.enabled && (
          <button
            onClick={onLogout}
            className="w-full rounded-xl py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30"
          >
            {auth.user ? t("ach.logout") : t("ach.login")}
          </button>
        )}

        <button
          onClick={() => { if (confirm(t("ach.resetConfirm"))) reset(); }}
          className="w-full rounded-xl py-2 text-sm text-slate-600 transition hover:text-boat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boat/30"
        >
          {t("ach.reset")}
        </button>
      </div>
    </div>
  );
}
