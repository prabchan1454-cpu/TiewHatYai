import { useEffect, useState } from "react";
import { Card } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { fetchWeather, describeWeather } from "../lib/weather";
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, Droplets } from "lucide-react";

const ICONS = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  storm: CloudLightning,
};

const TINT = {
  clear: "bg-amber-100 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300",
  partly: "bg-sky-100 text-sky-500 dark:bg-sky-500/15 dark:text-sky-300",
  cloudy: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  fog: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  drizzle: "bg-sky-100 text-sky-500 dark:bg-sky-500/15 dark:text-sky-300",
  rain: "bg-lagoon/10 text-lagoon",
  storm: "bg-violet-100 text-violet-500 dark:bg-violet-500/15 dark:text-violet-300",
};

export default function WeatherCard() {
  const { t, lang } = useT();
  const [w, setW] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((d) => alive && setW(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  // Weather is a bonus — if it can't load, the card simply doesn't show.
  if (failed) return null;

  if (!w) {
    return (
      <Card className="flex h-[76px] animate-pulse items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </Card>
    );
  }

  const desc = describeWeather(w.code);
  const Icon = ICONS[desc.key] || Cloud;
  const condition = lang === "en" ? desc.en : desc.th;

  return (
    <Card className="flex items-center gap-3">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TINT[desc.key] || TINT.cloudy}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="tnum text-2xl font-extrabold leading-none text-deep dark:text-slate-100">{w.temp}°</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{condition}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t("weather.location")}</p>
      </div>
      <div className="shrink-0 space-y-0.5 text-right text-xs text-slate-500 dark:text-slate-400">
        <p className="tnum">{t("weather.high")} {w.high}° · {t("weather.low")} {w.low}°</p>
        <p className="tnum inline-flex items-center justify-end gap-1">
          <Droplets className="h-3 w-3" /> {w.humidity}%
        </p>
      </div>
    </Card>
  );
}
