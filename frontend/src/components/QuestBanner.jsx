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

// Maps a quest category (from the backend) to a themed banner: an icon over a
// gradient. It only signals the TYPE of place, never the exact location, so it
// won't spoil the location-hint puzzle. Keep keys in sync with QuestCategory
// in backend schemas.py.
const CATEGORY = {
  temple: { Icon: Landmark, gradient: "from-amber-500 to-red-500" },
  beach: { Icon: Waves, gradient: "from-sky-400 to-lagoon" },
  market: { Icon: Store, gradient: "from-amber-400 to-orange-500" },
  cafe: { Icon: Coffee, gradient: "from-amber-600 to-orange-400" },
  nature: { Icon: Trees, gradient: "from-emerald-400 to-lagoon" },
  food: { Icon: Utensils, gradient: "from-orange-400 to-rose-400" },
  souvenir: { Icon: Gift, gradient: "from-violet-400 to-fuchsia-400" },
  culture: { Icon: Building2, gradient: "from-rose-400 to-orange-400" },
  landmark: { Icon: MapPin, gradient: "from-lagoon to-deep" },
};

const FALLBACK = CATEGORY.landmark;

export default function QuestBanner({ category }) {
  const { t } = useT();
  const key = CATEGORY[category] ? category : "landmark";
  const { Icon, gradient } = CATEGORY[key] || FALLBACK;

  return (
    <div
      className={`relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}
    >
      {/* faint oversized icon as a texture */}
      <Icon className="absolute -right-3 -top-3 h-24 w-24 text-white/15" strokeWidth={1.5} />
      <Icon className="h-9 w-9 text-white drop-shadow" strokeWidth={2} />
      <span className="absolute bottom-2 left-3 rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
        {t("questcat." + key)}
      </span>
    </div>
  );
}
