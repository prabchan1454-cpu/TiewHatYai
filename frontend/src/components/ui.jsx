import { useEffect, useRef } from "react";
import { useT } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme";
import { Sun, Moon, Star, Gem, Zap } from "lucide-react";

const ICON_TOGGLE =
  "flex h-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 font-bold text-slate-600 backdrop-blur transition duration-200 hover:bg-slate-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 dark:border-white/10 dark:bg-deep/70 dark:text-slate-200 dark:hover:bg-deep/90 dark:focus-visible:ring-white/30";

export function LangToggle({ className = "" }) {
  const { lang, toggle } = useT();
  return (
    <button
      onClick={toggle}
      className={`${ICON_TOGGLE} px-2.5 text-xs ${className}`}
      aria-label="Switch language"
    >
      {lang === "th" ? "🇹🇭 ไทย" : "🇬🇧 EN"}
    </button>
  );
}

export function ThemeToggle({ className = "" }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={`${ICON_TOGGLE} w-10 ${className}`}
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
    primary:
      "bg-sunset text-deep shadow-lg shadow-sunset/30 hover:brightness-105 focus-visible:ring-sunset dark:shadow-none",
    soft:
      "bg-white text-deep border border-slate-200 hover:bg-slate-50 focus-visible:ring-deep/40 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
    lagoon:
      "bg-lagoon text-deep shadow-lg shadow-lagoon/30 hover:brightness-105 focus-visible:ring-lagoon dark:shadow-none",
    ghost:
      "text-deep hover:bg-slate-100 focus-visible:ring-deep/40 dark:text-slate-100 dark:hover:bg-slate-800",
    game:
      "bg-gradient-to-r from-sunset to-mango text-white font-bold shadow-[0_4px_16px_rgba(255,122,69,0.4)] hover:shadow-[0_6px_24px_rgba(255,122,69,0.55)] focus-visible:ring-sunset active:scale-95",
  };
  return (
    <button className={`${base} ${variants[variant] ?? variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", as: Tag = "div", variant = "default", rarity, ...props }) {
  const variants = {
    default:
      "rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
    game:
      "rounded-3xl bg-white border border-slate-200 p-5 shadow-card dark:bg-[#0e1a2e] dark:border-white/10 dark:shadow-hero",
    glass:
      "rounded-3xl glass p-5 shadow-hero",
    rarity: `rounded-3xl bg-white dark:bg-[#0e1a2e] p-5 ${rarity ? `rarity-${rarity.toLowerCase()}` : "rarity-common"}`,
  };
  return (
    <Tag className={`${variants[variant] ?? variants.default} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

const RARITY_STYLE = {
  Common:    { cls: "bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-500/30", Icon: Star },
  Rare:      { cls: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-500/40", Icon: Gem },
  Epic:      { cls: "bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-500/50", Icon: Gem },
  Legendary: { cls: "shimmer-bg bg-amber-50 text-amber-600 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-400/60", Icon: Star },
};

export function RarityBadge({ rarity }) {
  const s = RARITY_STYLE[rarity] || RARITY_STYLE.Common;
  const { Icon } = s;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {rarity}
    </span>
  );
}

// Animated XP progress bar — width animates from 0 to pct on mount.
export function XpBar({ xp, min, max, className = "" }) {
  const pct = max > min ? Math.min(100, Math.round(((xp - min) / (max - min)) * 100)) : 100;
  const fillRef = useRef(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    // Start at 0, then transition to actual %
    el.style.width = "0%";
    const id = requestAnimationFrame(() => {
      el.style.transition = "width 0.8s cubic-bezier(0.34,1.10,0.64,1)";
      el.style.width = `${pct}%`;
    });
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/15 ${className}`}>
      <div
        ref={fillRef}
        className="h-full rounded-full bg-gradient-to-r from-sunset to-mango"
        style={{ width: `${pct}%` }}
      />
    </div>
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
    sunset: "bg-orange-100 text-orange-800 dark:bg-sunset/20 dark:text-orange-200",
    lagoon: "bg-teal-100 text-teal-800 dark:bg-lagoon/20 dark:text-teal-200",
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
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sunset dark:border-white/20 dark:border-t-sunset" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/20">
      {message}
    </div>
  );
}
