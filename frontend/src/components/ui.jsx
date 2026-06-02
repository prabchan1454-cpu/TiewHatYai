import { useT } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme";
import { Sun, Moon } from "lucide-react";

const ICON_TOGGLE =
  "flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 font-bold text-deep backdrop-blur transition duration-200 hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/40 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800";

export function LangToggle({ className = "" }) {
  const { lang, toggle } = useT();
  return (
    <button
      onClick={toggle}
      className={`${ICON_TOGGLE} px-2.5 text-xs ${className}`}
      aria-label="Switch language"
    >
      {lang === "th" ? "🇬🇧 EN" : "🇹🇭 ไทย"}
    </button>
  );
}

export function ThemeToggle({ className = "" }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={`${ICON_TOGGLE} w-8 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";
  const variants = {
    primary: "bg-sunset text-white shadow-lg shadow-sunset/30 hover:brightness-105 focus-visible:ring-sunset dark:shadow-none",
    soft: "bg-white text-deep border border-slate-200 hover:bg-slate-50 focus-visible:ring-deep/40 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
    lagoon: "bg-lagoon text-white shadow-lg shadow-lagoon/30 hover:brightness-105 focus-visible:ring-lagoon dark:shadow-none",
    ghost: "text-deep hover:bg-slate-100 focus-visible:ring-deep/40 dark:text-slate-100 dark:hover:bg-slate-800",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

const RARITY = {
  Common: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Rare: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  Epic: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  Legendary: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const DIFFICULTY = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

export function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    sunset: "bg-orange-100 text-sunset dark:bg-sunset/20 dark:text-orange-300",
    lagoon: "bg-teal-100 text-lagoon dark:bg-lagoon/20 dark:text-teal-300",
    ...RARITY,
    ...DIFFICULTY,
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${tones[children] || tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ label = "น้องเที่ยวกำลังคิด..." }) {
  return (
    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sunset dark:border-slate-600 dark:border-t-sunset" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
      {message}
    </div>
  );
}
