import { useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
import PlacesMap from "../components/PlacesMap";
import { useT } from "../lib/i18n.jsx";

const MEDALS = ["🥇", "🥈", "🥉"];

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
      });
      setPlaces(places);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 px-4 py-4">
      <Card className="bg-gradient-to-br from-lagoon/15 to-mango/10">
        <h2 className="text-lg font-extrabold text-deep">{t("rec.title")}</h2>
        <p className="text-sm text-slate-500">
          {t("rec.basedOn")} {preferences?.categories || "—"}
          {preferences?.vibe ? ` · ${preferences.vibe}` : ""}
        </p>
        <Button onClick={fetchRecs} disabled={loading} className="mt-3 w-full">
          {loading ? t("rec.searching") : places.length ? t("rec.reroll") : t("rec.ask")}
        </Button>
      </Card>

      <ErrorBox message={error} />
      {loading && <Spinner label={t("rec.picking")} />}

      {places.length > 0 && <PlacesMap places={places} />}

      {places.map((p) => (
        <Card key={p.rank} className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-2xl">{MEDALS[p.rank - 1] || "📍"}</span>
              <h3 className="text-lg font-extrabold text-deep">{p.place_name}</h3>
            </div>
            <Pill tone="sunset">{p.category}</Pill>
          </div>
          <p className="text-slate-600">{p.why_recommended}</p>
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
            <p>✨ <span className="font-semibold text-deep">{t("rec.highlight")}</span> {p.highlight}</p>
            <p>💡 <span className="font-semibold text-deep">{t("rec.tip")}</span> {p.local_tip}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>🕒 {p.best_time}</span>
            <span>📌 {p.approximate_area}</span>
          </div>
          <a
            href={mapsUrl(p)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lagoon hover:underline"
          >
            {t("rec.openMaps")}
          </a>
        </Card>
      ))}
    </div>
  );
}
