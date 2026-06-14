import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gmapsUrl } from "../lib/landmarks";

const HAT_YAI = [7.0086, 100.4747];

function pinIcon(rank) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:#ff7a45;color:#fff;width:30px;height:30px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff;font-weight:800;">
      <span style="transform:rotate(45deg);font-size:13px;">${rank}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

export default function PlacesMap({ places }) {
  const pinned = useMemo(
    () => places.filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number"),
    [places]
  );
  const points = useMemo(() => pinned.map((p) => [p.latitude, p.longitude]), [pinned]);

  if (pinned.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-3xl shadow-sm shadow-slate-200/60">
      <MapContainer
        center={HAT_YAI}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: 240, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {pinned.map((p) => (
          <Marker key={p.rank} position={[p.latitude, p.longitude]} icon={pinIcon(p.rank)}>
            <Popup>
              <strong>{p.place_name}</strong>
              <br />
              {p.approximate_area}
              <br />
              <a
                href={gmapsUrl({ name: `${p.place_name} ${p.approximate_area || ""}`.trim() })}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2563eb", fontWeight: 600, fontSize: 12 }}
              >
                เปิดใน Google Maps ↗
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
