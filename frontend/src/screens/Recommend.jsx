import { useState, lazy, Suspense } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
// Leaflet is ~150 kB — load the map only when results actually appear.
const PlacesMap = lazy(() => import("../components/PlacesMap"));
import TripForecast from "../components/TripForecast";
import { useT } from "../lib/i18n.jsx";
import { festivalNames, isTripExpired } from "../lib/festivals";
import { getUnlocks } from "../lib/unlocks";
import { Sparkles, Lightbulb, Clock, MapPin, ExternalLink, Gift, Tag, CalendarDays, CalendarX, Compass, Lock } from "lucide-react";

const RANK_TINT = {
  1: "bg-mango/20 text-amber-600 dark:text-amber-300",
  2: "bg-slate-200 text-slate-600 dark:bg-slate-700/60 dark:text-slate-200",
  3: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
};

function mapsUrl(p) {
  if (typeof p.latitude === "number" && typeof p.longitude === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
  }
  const q = encodeURIComponent(`${p.place_name} ${p.approximate_area} สงขลา`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function formatRange(start, end, lang) {
  const opts = { day: "numeric", month: "short", year: "numeric" };
  const loc = lang === "en" ? "en-US" : "th-TH";
  const s = new Date(start).toLocaleDateString(loc, opts);
  const e = new Date(end).toLocaleDateString(loc, opts);
  return `${s} – ${e}`;
}

export default function Recommend({ preferences, xp = 0, onNavigate }) {
  const { t, lang } = useT();
  const [mode, setMode] = useState("places");
  const unlocks = getUnlocks(xp);
  const [hiddenGems, setHiddenGems] = useState(false);

  // Travel dates drive both the prompt and the on-screen summary. Once the
  // trip is over we stop sending stale dates and nudge the user to update.
  const dateStart = preferences?.dateStart || "";
  const dateEnd = preferences?.dateEnd || "";
  const tripExpired = isTripExpired(dateEnd);
  const tripActive = !!dateStart && !!dateEnd && !tripExpired;
  const festNames = tripActive ? festivalNames(preferences?.festivals, lang) : "";

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [souvenirs, setSouvenirs] = useState([]);
  const [sLoading, setSLoading] = useState(false);
  const [sError, setSError] = useState("");

  async function fetchRecs() {
    setLoading(true);
    setError("");
    try {
      const { places } = await api.recommend({
        categories: preferences?.categories || "อาหาร, ของฝาก",
        vibe: preferences?.vibe || "",
        budget: preferences?.budget || "ปานกลาง",
        companion: preferences?.companion || "คนเดียว",
        duration: tripActive ? preferences?.duration || "" : "",
        date_start: tripActive ? dateStart : "",
        date_end: tripActive ? dateEnd : "",
        festivals: festNames,
        interests: preferences?.interests || "",
        hidden_gems: unlocks.hiddenGems && hiddenGems,
      });
      setPlaces(places);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSouvenirs() {
    setSLoading(true);
    setSError("");
    try {
      const { items } = await api.souvenirs({ categories: preferences?.categories || "" });
      setSouvenirs(items);
    } catch (e) {
      setSError(e.message);
    } finally {
      setSLoading(false);
    }
  }

  const seg = (active) =>
    `flex-1 rounded-xl py-2 text-sm font-bold transition ${
      active
        ? "bg-white text-deep shadow-sm dark:bg-white/15 dark:text-white"
        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    }`;

  return (
    <div className="space-y-4 p-4 pb-6">
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
        <button onClick={() => setMode("places")} className={seg(mode === "places")}>
          {t("rec.modePlaces")}
        </button>
        <button onClick={() => setMode("souvenirs")} className={seg(mode === "souvenirs")}>
          {t("rec.modeSouvenirs")}
        </button>
      </div>

      {mode === "places" ? (
        <>
          <Card variant="game">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mango/20 text-amber-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 dark:text-white">{t("rec.title")}</h2>
                <p className="text-sm text-slate-400">
                  {t("rec.basedOn")} {preferences?.categories || "—"}
                  {preferences?.vibe ? ` · ${preferences.vibe}` : ""}
                </p>
                {tripActive && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-lagoon" />
                    {t("rec.dates", { range: formatRange(dateStart, dateEnd, lang) })}
                    {festNames ? ` · 🎉 ${festNames}` : ""}
                  </p>
                )}
              </div>
            </div>
            {tripExpired && (
              <button
                onClick={() => onNavigate?.("profile")}
                className="mt-3 flex w-full items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-left text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
              >
                <CalendarX className="h-4 w-4 shrink-0" />
                {t("rec.tripExpired")}
              </button>
            )}
            {unlocks.hiddenGems ? (
              <button
                onClick={() => setHiddenGems((v) => !v)}
                aria-pressed={hiddenGems}
                className={`mt-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  hiddenGems
                    ? "border-lagoon bg-lagoon/10 text-lagoon"
                    : "border-white/10 text-slate-300 hover:border-lagoon"
                }`}
              >
                <Compass className="h-4 w-4 shrink-0" />
                <span className="flex-1">
                  {t("rec.hiddenGems")}
                  <span className="block text-xs font-normal opacity-70">{t("rec.hiddenGemsOn")}</span>
                </span>
                <span className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition ${hiddenGems ? "bg-lagoon" : "bg-slate-300 dark:bg-white/15"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${hiddenGems ? "translate-x-4" : ""}`} />
                </span>
              </button>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" /> {t("rec.hiddenGems")} · {t("rec.hiddenGemsLock")}
              </p>
            )}
            <Button variant="game" onClick={fetchRecs} disabled={loading} className="mt-4 w-full">
              {loading ? t("rec.searching") : places.length ? t("rec.reroll") : t("rec.ask")}
            </Button>
          </Card>

          {tripActive && <TripForecast start={dateStart} end={dateEnd} />}

          <ErrorBox message={error} />
          {loading && <Spinner label={t("rec.picking")} />}

          {places.length > 0 && (
            <Suspense
              fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#0e1a2e] border border-white/8" />}
            >
              <PlacesMap places={places} />
            </Suspense>
          )}

          {places.map((p) => (
            <Card key={p.rank} variant="game" className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                      RANK_TINT[p.rank] || "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    <span className="tnum">{p.rank}</span>
                  </span>
                  <h3 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{p.place_name}</h3>
                </div>
                <Pill tone="sunset">{p.category}</Pill>
              </div>
              <p className="text-slate-300">{p.why_recommended}</p>
              <div className="space-y-1.5 rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                <p className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mango" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">{t("rec.highlight")} </span>{p.highlight}</span>
                </p>
                <p className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">{t("rec.tip")} </span>{p.local_tip}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {p.best_time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {p.approximate_area}
                </span>
              </div>
              <a
                href={mapsUrl(p)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-lagoon hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40"
              >
                <ExternalLink className="h-4 w-4" /> {t("rec.openMaps")}
              </a>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Card variant="game">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/15 text-lagoon">
                <Gift className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 dark:text-white">{t("rec.souvenirTitle")}</h2>
                <p className="text-sm text-slate-400">{t("rec.souvenirDesc")}</p>
              </div>
            </div>
            <Button onClick={fetchSouvenirs} disabled={sLoading} variant="lagoon" className="mt-4 w-full">
              {sLoading ? t("rec.searching") : souvenirs.length ? t("rec.reroll") : t("rec.askSouvenir")}
            </Button>
          </Card>

          <ErrorBox message={sError} />
          {sLoading && <Spinner label={t("rec.picking")} />}

          {souvenirs.map((s, i) => (
            <Card key={i} variant="game" className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mango/20 text-amber-300">
                    <Gift className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{s.name}</h3>
                </div>
                <Pill tone="lagoon">{s.category}</Pill>
              </div>
              <p className="text-slate-300">{s.description}</p>
              <div className="space-y-1.5 rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                <p className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mango" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">{t("rec.identity")} </span>{s.why_special}</span>
                </p>
                <p className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">{t("rec.tip")} </span>{s.tip}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {s.where_to_buy}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-4 w-4" /> {s.price_range}
                </span>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
