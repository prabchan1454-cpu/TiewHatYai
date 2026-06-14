// Free geolocation helpers for the community check-in — no paid Maps API.
// `getCurrentPosition` wraps the browser GPS; `reverseGeocode` turns a coordinate
// into a human place name via OpenStreetMap's Nominatim (free, no key — usage
// policy: light/occasional use only, which a manual check-in tap satisfies).

// Resolve the device's current GPS position. Rejects with a friendly message if
// permission is denied or the device has no fix.
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง — เปิดสิทธิ์ใน Settings แล้วลองใหม่"
            : "หาตำแหน่งไม่สำเร็จ ลองอีกครั้ง";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// Build a short, readable place label from a Nominatim address object —
// prefer a named POI, fall back to road/neighbourhood, then district.
function shortName(data) {
  const a = data.address || {};
  const poi =
    data.name ||
    a.amenity ||
    a.tourism ||
    a.shop ||
    a.building ||
    a.leisure ||
    a.natural;
  const area = a.road || a.neighbourhood || a.suburb || a.village || a.town;
  const district = a.city_district || a.county || a.city || a.state_district;
  return [poi, area, district].filter(Boolean).slice(0, 2).join(" · ");
}

// Reverse-geocode a coordinate to a place name. Returns "" on any failure so
// the caller just falls back to letting the user type the name themselves.
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&accept-language=th&zoom=18`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return "";
    const data = await res.json();
    return shortName(data) || data.display_name?.split(",").slice(0, 2).join(",") || "";
  } catch {
    return "";
  }
}
