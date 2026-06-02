import { useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
import PlacesMap from "../components/PlacesMap";
import { useT } from "../lib/i18n.jsx";
import { Sparkles, Lightbulb, Clock, MapPin, ExternalLink } from "lucide-react";

const RANK_TINT = {
  1: "bg-mango/20 text-amber-600 dark:text-amber-300",
  2: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
  3: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
};

function mapsUrl(p) {
  if (typeof p.latitude === "number" && typeof p.longitude === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
  }
  const q = encodeURIComponent(`${p.place_name} ${p.approximate_area} หาดใหญ่`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function Recommend({ preferences }) {
  const { t } = useT();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchRecs() {
    setLoading(true);
    setError("");
    try {
      const { places } = await api.recommend({
        categories: preferences?.categories || "อาหาร, ของฝาก",
        vibe: preferences?.vibe || "",
        budget: preferences?.budget || "ปานกลาง",
        companion: preferences?.companion || "คนเดียว",
        duration: preferences?.duration || "",
        interests: preferences?.interests || "",
      });
      setPlaces(places);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4 pb-6">
      <Card>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mango/15 text-amber-600">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-bold text-deep dark:text-slate-100">{t("rec.title")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("rec.basedOn")} {preferences?.categories || "—"}
              {preferences?.vibe ? ` · ${preferences.vibe}` : ""}
            </p>
          </div>
        </div>
        <Button onClick={fetchRecs} disabled={loading} className="mt-4 w-full">
          {loading ? t("rec.searching") : places.length ? t("rec.reroll") : t("rec.ask")}
        </Button>
      </Card>

      <ErrorBox message={error} />
      {loading && <Spinner label={t("rec.picking")} />}

      {places.length > 0 && <PlacesMap places={places} />}

      {places.map((p) => (
        <Card key={p.rank} className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  RANK_TINT[p.rank] || "bg-slate-100 text-slate-500"
                }`}
              >
                <span className="tnum">{p.rank}</span>
              </span>
              <h3 className="text-lg font-extrabold leading-snug text-deep dark:text-slate-100">{p.place_name}</h3>
            </div>
            <Pill tone="sunset">{p.category}</Pill>
          </div>
          <p className="text-slate-600 dark:text-slate-300">{p.why_recommended}</p>
          <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <p className="flex gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mango" />
              <span><span className="font-semibold text-deep dark:text-slate-100">{t("rec.highlight")} </span>{p.highlight}</span>
            </p>
            <p className="flex gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" />
              <span><span className="font-semibold text-deep dark:text-slate-100">{t("rec.tip")} </span>{p.local_tip}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
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
    </div>
  );
}
