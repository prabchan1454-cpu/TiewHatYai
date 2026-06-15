import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LANDMARKS, DISTRICTS, gmapsUrl } from "../lib/landmarks";
import { useT } from "../lib/i18n.jsx";
import { ArrowLeft, LocateFixed } from "lucide-react";

// Teardrop pin coloured by state: collected (gold ✓), quest target (sunset),
// community spot (lagoon), or not-yet-collected (muted).
function pinIcon(stateKey) {
  const map = {
    collected: { bg: "#ffb020", inner: '<span style="transform:rotate(45deg);color:#1b2a4a;font-size:13px;font-weight:900;line-height:1;">✓</span>' },
    quest:     { bg: "#ff7a45", inner: '<span style="transform:rotate(45deg);width:7px;height:7px;border-radius:50%;background:#fff;display:block;"></span>', cls: "map-quest-dot" },
    community: { bg: "#0fb9b1", inner: '<span style="transform:rotate(45deg);width:7px;height:7px;border-radius:50%;background:#fff;display:block;"></span>' },
    locked:    { bg: "#94a3b8", inner: '<span style="transform:rotate(45deg);width:6px;height:6px;border-radius:50%;background:#fff;display:block;"></span>' },
  };
  const s = map[stateKey] || map.locked;
  return L.divIcon({
    className: "",
    html: `<div class="${s.cls || ""}" style="background:${s.bg};width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.35);border:2px solid #fff;">${s.inner}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

const youIcon = L.divIcon({
  className: "",
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Drives imperative map moves (resize fix, district focus, locate).
function MapController({ focus, userPos }) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 120);
    return () => clearTimeout(id);
  }, [map]);
  useEffect(() => {
    if (focus && focus.length) map.fitBounds(focus, { padding: [48, 48], maxZoom: 14 });
  }, [focus, map]);
  useEffect(() => {
    if (userPos) map.setView(userPos, 13, { animate: true });
  }, [userPos, map]);
  return null;
}

export default function AdventureMap({ progress, onNavigate, onBack }) {
  const { t, lang } = useT();
  const { state } = progress;

  const collectedIds = useMemo(
    () => new Set((state.collectedStamps || []).map((s) => s.id)),
    [state.collectedStamps]
  );
  const quest = state.activeQuest;
  const questTarget = quest?.target_lat && quest?.target_lng ? [quest.target_lat, quest.target_lng] : null;

  const done = collectedIds.size;
  const total = LANDMARKS.length;

  const allPoints = useMemo(() => LANDMARKS.map((l) => [l.lat, l.lng]), []);
  const [district, setDistrict] = useState(null);
  const [focus, setFocus] = useState(allPoints);
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);

  const districtStats = useMemo(
    () =>
      DISTRICTS.map((d) => {
        const items = LANDMARKS.filter((l) => l.district === d);
        return { d, total: items.length, done: items.filter((l) => collectedIds.has(l.id)).length };
      }).filter((x) => x.total > 0),
    [collectedIds]
  );

  function selectDistrict(d) {
    setDistrict(d);
    const pts = (d ? LANDMARKS.filter((l) => l.district === d) : LANDMARKS).map((l) => [l.lat, l.lng]);
    setFocus(pts.length ? pts : allPoints);
  }

  function locate() {
    if (!navigator.geolocation || locating) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserPos([p.coords.latitude, p.coords.longitude]); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const nameOf = (l) => (lang === "en" ? l.en : l.th);

  function stateOf(l) {
    if (collectedIds.has(l.id)) return "collected";
    if (questTarget && quest?.target_lat === l.lat && quest?.target_lng === l.lng) return "quest";
    if (l.community) return "community";
    return "locked";
  }

  return (
    <div className="flex h-full flex-col bg-[#f0f4fc] dark:bg-[#0a1120]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">{t("map.title")}</h1>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{t("map.explored", { done, total })}</p>
        </div>
        <button
          onClick={locate}
          disabled={locating}
          aria-label={t("map.locate")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-lagoon/30 bg-lagoon/10 text-lagoon transition hover:bg-lagoon/20 disabled:opacity-50"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? "animate-pulse" : ""}`} />
        </button>
      </div>

      {/* District conquest chips */}
      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto px-4 pb-3">
        <button
          onClick={() => selectDistrict(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
            district === null
              ? "border-sunset bg-sunset/15 text-sunset"
              : "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-[#0e1a2e] dark:text-slate-400"
          }`}
        >
          {t("map.allDistricts")}
        </button>
        {districtStats.map(({ d, done: dd, total: dt }) => {
          const complete = dd === dt;
          const active = district === d;
          return (
            <button
              key={d}
              onClick={() => selectDistrict(d)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-sunset bg-sunset/15 text-sunset"
                  : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#0e1a2e] dark:text-slate-300"
              }`}
            >
              {d}
              <span className={`tnum rounded-full px-1.5 text-[10px] ${complete ? "bg-mango/25 text-amber-600 dark:text-mango" : "bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-slate-500"}`}>
                {dd}/{dt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="adventure-map relative flex-1">
        <MapContainer center={[7.15, 100.5]} zoom={10} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController focus={focus} userPos={userPos} />

          {questTarget && (
            <Circle center={questTarget} radius={250} pathOptions={{ color: "#ff7a45", fillColor: "#ff7a45", fillOpacity: 0.12, weight: 1 }} />
          )}

          {LANDMARKS.map((l) => {
            const st = stateOf(l);
            const collected = st === "collected";
            return (
              <Marker key={l.id} position={[l.lat, l.lng]} icon={pinIcon(st)}>
                <Popup>
                  <strong>{nameOf(l)}</strong>
                  <br />
                  <span style={{ color: "#64748b", fontSize: 12 }}>{l.district}{l.community ? ` · ${t("passport.community")}` : ""}</span>
                  <br />
                  {collected ? (
                    <span style={{ color: "#d9831f", fontWeight: 700 }}>{t("map.collected")} ✓</span>
                  ) : (
                    <button
                      onClick={() => onNavigate?.("passport")}
                      style={{ color: "#0fb9b1", fontWeight: 700, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      {t("map.go")} →
                    </button>
                  )}
                  <br />
                  <a href={gmapsUrl({ name: l.th })} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: 600, fontSize: 12 }}>
                    {t("map.openMaps")} ↗
                  </a>
                </Popup>
              </Marker>
            );
          })}

          {userPos && <Marker position={userPos} icon={youIcon} />}
        </MapContainer>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-[10px] font-semibold text-slate-600 shadow-lift backdrop-blur dark:border-white/10 dark:bg-[#0e1a2e]/90 dark:text-slate-300">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-mango" /> {t("map.collected")}</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-lagoon" /> {t("map.community")}</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-slate-400" /> {t("map.uncollected")}</span>
        </div>
      </div>
    </div>
  );
}
