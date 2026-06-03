import { useEffect, useState } from "react";
import { Card } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { fetchTripWeather, describeWeather } from "../lib/weather";
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning } from "lucide-react";

const ICONS = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  storm: CloudLightning,
};

// Per-day forecast strip for the user's trip window. A bonus like WeatherCard:
// if the dates are beyond Open-Meteo's ~16-day horizon or the fetch fails, it
// renders nothing rather than showing empty data.
export default function TripForecast({ start, end }) {
  const { t, lang } = useT();
  const [days, setDays] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchTripWeather(start, end)
      .then((d) => alive && setDays(d))
      .catch(() => alive && setDays([]));
    return () => {
      alive = false;
    };
  }, [start, end]);

  if (!days || days.length === 0) return null;

  const loc = lang === "en" ? "en-US" : "th-TH";

  return (
    <Card className="space-y-2.5">
      <p className="text-sm font-bold text-deep dark:text-slate-100">{t("weather.tripTitle")}</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {days.map((d) => {
          const desc = describeWeather(d.code);
          const Icon = ICONS[desc.key] || Cloud;
          return (
            <div
              key={d.date}
              className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl bg-slate-50 px-2.5 py-2 dark:bg-slate-800/60"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {new Date(d.date).toLocaleDateString(loc, { day: "numeric", month: "short" })}
              </span>
              <Icon className="h-5 w-5 text-lagoon" />
              <span className="tnum text-xs font-bold text-deep dark:text-slate-100">
                {d.high}° / {d.low}°
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
