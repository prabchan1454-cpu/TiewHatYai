import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LANDMARKS } from "../lib/landmarks";

// Teardrop pin — gold + check when the stamp is collected, muted grey when not.
function pinIcon(collected) {
  const bg = collected ? "#ffb020" : "#cbd5e1";
  const mark = collected
    ? `<span style="transform:rotate(45deg);color:#1b2a4a;font-size:14px;font-weight:900;">✓</span>`
    : `<span style="transform:rotate(45deg);width:8px;height:8px;border-radius:50%;background:#fff;display:block;"></span>`;
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${bg};width:26px;height:26px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff;">${mark}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [36, 36] });
  }, [points, map]);
  return null;
}

// A map of every passport landmark across Songkhla — the "spread tourism across
// the whole province" view. Tap a pin to collect that stamp.
export default function StampMap({ collectedIds, onSelect }) {
  const points = useMemo(() => LANDMARKS.map((l) => [l.lat, l.lng]), []);

  return (
    <div className="overflow-hidden rounded-3xl shadow-sm shadow-slate-200/60">
      <MapContainer center={[7.12, 100.55]} zoom={11} scrollWheelZoom={false} style={{ height: 260, width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={points} />
        {LANDMARKS.map((l) => {
          const collected = collectedIds.has(l.id);
          return (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={pinIcon(collected)}>
              <Popup>
                <strong>{l.th}</strong>
                <br />
                {collected ? (
                  <span style={{ color: "#d9831f", fontWeight: 700 }}>เก็บแล้ว ✓</span>
                ) : (
                  <button
                    onClick={() => onSelect?.(l)}
                    style={{ color: "#0fb9b1", fontWeight: 700, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    เก็บดวงตรา →
                  </button>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
