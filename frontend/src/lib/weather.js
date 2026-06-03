// Live weather for Hat Yai via Open-Meteo — free, no API key, CORS-enabled,
// so it's called straight from the browser (fits the zero-budget constraint).
const HATYAI = { lat: 7.0086, lng: 100.4747 };

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${HATYAI.lat}&longitude=${HATYAI.lng}` +
  "&current=temperature_2m,weather_code,relative_humidity_2m" +
  "&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok&forecast_days=1";

// WMO weather code -> category key + bilingual label.
export function describeWeather(code) {
  const d = (key, th, en) => ({ key, th, en });
  if (code === 0) return d("clear", "ท้องฟ้าแจ่มใส", "Clear sky");
  if (code === 1 || code === 2) return d("partly", "มีเมฆบางส่วน", "Partly cloudy");
  if (code === 3) return d("cloudy", "เมฆมาก", "Overcast");
  if (code === 45 || code === 48) return d("fog", "หมอก", "Fog");
  if (code >= 51 && code <= 57) return d("drizzle", "ฝนปรอย", "Drizzle");
  if (code >= 61 && code <= 67) return d("rain", "ฝนตก", "Rain");
  if (code >= 80 && code <= 82) return d("rain", "ฝนตกหนัก", "Rain showers");
  if (code >= 95) return d("storm", "ฝนฟ้าคะนอง", "Thunderstorm");
  return d("cloudy", "มีเมฆ", "Cloudy");
}

export async function fetchWeather() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("weather unavailable");
  const j = await res.json();
  return {
    temp: Math.round(j.current.temperature_2m),
    code: j.current.weather_code,
    humidity: Math.round(j.current.relative_humidity_2m),
    high: Math.round(j.daily.temperature_2m_max[0]),
    low: Math.round(j.daily.temperature_2m_min[0]),
  };
}

// Open-Meteo's free forecast only reaches ~16 days out. Past that horizon (or
// for dates already gone) there is no data, so callers should hide the forecast
// rather than show blanks.
const FORECAST_HORIZON_DAYS = 16;

function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Per-day forecast for the trip window, clamped to today..horizon. Returns []
// when the whole trip is outside the forecastable range (caller hides the card).
export async function fetchTripWeather(dateStart, dateEnd) {
  if (!dateStart || !dateEnd) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + FORECAST_HORIZON_DAYS);

  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  if (isNaN(start) || isNaN(end)) return [];

  const from = start < today ? today : start;
  const to = end > horizon ? horizon : end;
  if (to < from) return []; // trip entirely in the past or beyond the horizon

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${HATYAI.lat}&longitude=${HATYAI.lng}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    `&timezone=Asia%2FBangkok&start_date=${ymd(from)}&end_date=${ymd(to)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("weather unavailable");
  const j = await res.json();
  const days = j.daily?.time || [];
  return days.map((date, i) => ({
    date,
    code: j.daily.weather_code[i],
    high: Math.round(j.daily.temperature_2m_max[i]),
    low: Math.round(j.daily.temperature_2m_min[i]),
  }));
}
