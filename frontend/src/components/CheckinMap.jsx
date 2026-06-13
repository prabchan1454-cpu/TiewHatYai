import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function pinIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:#0fb9b1;width:24px;height:24px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff;">
      <span style="transform:rotate(45deg);width:7px;height:7px;border-radius:50%;background:#fff;display:block;"></span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [36, 36] });
    else if (points.length === 1) map.setView(points[0], 13);
  }, [points, map]);
  return null;
}

// Shared map of where everyone has checked in across Songkhla.
export default function CheckinMap({ checkins }) {
  const pinned = useMemo(
    () => checkins.filter((c) => typeof c.lat === "number" && typeof c.lng === "number"),
    [checkins]
  );
  const points = useMemo(() => pinned.map((c) => [c.lat, c.lng]), [pinned]);

  return (
    <div className="overflow-hidden rounded-3xl shadow-sm shadow-slate-200/60">
      <MapContainer center={[7.12, 100.55]} zoom={11} scrollWheelZoom={false} style={{ height: 240, width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={points} />
        {pinned.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={pinIcon()}>
            <Popup>
              <strong>{c.place || "เช็คอิน"}</strong>
              <br />
              {c.displayName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
