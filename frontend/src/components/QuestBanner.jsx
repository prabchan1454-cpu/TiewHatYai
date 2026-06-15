import { useT } from "../lib/i18n.jsx";
import {
  Landmark,
  Waves,
  Store,
  Coffee,
  Trees,
  Utensils,
  Gift,
  Building2,
  MapPin,
} from "lucide-react";

const CATEGORY = {
  temple:   { Icon: Landmark,  gradient: "from-amber-500 via-orange-500 to-red-500",    glow: "rgba(251,146,60,0.4)" },
  beach:    { Icon: Waves,     gradient: "from-sky-400 via-cyan-400 to-teal-400",        glow: "rgba(56,189,248,0.4)" },
  market:   { Icon: Store,     gradient: "from-amber-400 via-orange-400 to-orange-500",  glow: "rgba(251,191,36,0.4)" },
  cafe:     { Icon: Coffee,    gradient: "from-amber-600 via-amber-500 to-orange-400",   glow: "rgba(217,119,6,0.4)"  },
  nature:   { Icon: Trees,     gradient: "from-emerald-400 via-teal-400 to-cyan-500",    glow: "rgba(52,211,153,0.4)" },
  food:     { Icon: Utensils,  gradient: "from-orange-400 via-rose-400 to-pink-500",     glow: "rgba(251,146,60,0.4)" },
  souvenir: { Icon: Gift,      gradient: "from-violet-400 via-purple-500 to-fuchsia-500",glow: "rgba(167,139,250,0.4)" },
  culture:  { Icon: Building2, gradient: "from-rose-400 via-orange-400 to-amber-400",   glow: "rgba(251,113,133,0.4)" },
  landmark: { Icon: MapPin,    gradient: "from-lagoon via-teal-500 to-deep",             glow: "rgba(15,185,177,0.4)" },
};

const FALLBACK = CATEGORY.landmark;

export default function QuestBanner({ category, difficulty }) {
  const { t } = useT();
  const key = CATEGORY[category] ? category : "landmark";
  const { Icon, gradient, glow } = CATEGORY[key] || FALLBACK;

  return (
    <div
      className={`relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}
      style={{ boxShadow: `0 8px 32px ${glow}` }}
    >
      {/* Large faint texture icon */}
      <Icon className="absolute -right-4 -top-4 h-36 w-36 text-white/12" strokeWidth={1} />
      {/* Small faint texture icon bottom-left */}
      <Icon className="absolute -bottom-3 -left-3 h-20 w-20 text-white/8" strokeWidth={1} />
      {/* Bottom gradient fade for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 to-transparent" />
      {/* Central icon with glow */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm" style={{ boxShadow: `0 0 24px ${glow}` }}>
        <Icon className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={2} />
      </div>
      {/* Category label — bottom left */}
      <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        {t("questcat." + key)}
      </span>
      {/* Difficulty badge — top right */}
      {difficulty && (
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold backdrop-blur-sm ${
          difficulty === "Easy"   ? "bg-emerald-500/70 text-white" :
          difficulty === "Medium" ? "bg-amber-500/70 text-white" :
                                    "bg-rose-500/70 text-white"
        }`}>
          {difficulty}
        </span>
      )}
    </div>
  );
}
