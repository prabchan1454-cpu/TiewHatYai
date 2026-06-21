// "Legends & Mysteries" — TiewHatyai's signature hyperlocal entertainment layer.
// Read a local tale, then visit the real spot to unlock it for XP. Anchored to
// real landmark coordinates so culture-as-content drives real-world visits.
import { useState } from "react";
import { useT } from "../lib/i18n.jsx";
import { gmapsUrl } from "../lib/landmarks";
import { LEGENDS, LEGEND_TYPES, LEGEND_XP } from "../lib/legends";
import { bumpMetric } from "../lib/metrics";
import {
  ArrowLeft, BookOpen, Ghost, Sparkles, HelpCircle, MapPin, Navigation,
  Lock, CheckCircle2, MessageCircle, HeartHandshake,
} from "lucide-react";

const TYPE_META = {
  legend:  { Icon: BookOpen,   accent: "text-sunset",  bg: "bg-sunset/15" },
  ghost:   { Icon: Ghost,      accent: "text-ink dark:text-plaster", bg: "bg-ink/10 dark:bg-white/10" },
  fortune: { Icon: Sparkles,   accent: "text-mango",   bg: "bg-mango/15" },
  mystery: { Icon: HelpCircle, accent: "text-lagoon",  bg: "bg-lagoon/15" },
};

export default function Legends({ progress, onNavigate, onBack }) {
  const { t, lang } = useT();
  const { state } = progress;
  const unlocked = state.unlockedLegends || [];
  const isUnlocked = (id) => unlocked.some((u) => u.id === id);

  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [wished, setWished] = useState({});

  const open = LEGENDS.find((l) => l.id === openId) || null;
  const T = (o) => (lang === "en" ? o.en : o.th);

  // ── Detail view ──────────────────────────────────────────────────────────
  if (open) {
    const meta = TYPE_META[open.type];
    const done = isUnlocked(open.id);
    const place = lang === "en" ? open.placeEn : open.placeTh;
    return (
      <div className="space-y-4 p-4 pb-6">
        <button onClick={() => setOpenId(null)} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <ArrowLeft className="h-4 w-4" /> {t("leg.back")}
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-[#0e1a2e]">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.bg} ${meta.accent}`}>
              <meta.Icon className="h-3.5 w-3.5" /> {t("leg.type." + open.type)}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> {t("leg.unlocked")}
              </span>
            )}
          </div>

          <h1 className="font-display mt-3 text-[22px] leading-snug text-slate-900 dark:text-white">{T(open.title)}</h1>
          {place && (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-lagoon">
              <MapPin className="h-3.5 w-3.5" /> {place}
            </p>
          )}

          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{T(open.story)}</p>

          {/* Fortune / sacred wish interaction */}
          {open.wish && (
            <button
              onClick={() => setWished((w) => ({ ...w, [open.id]: true }))}
              disabled={wished[open.id]}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-mango/15 py-3 text-sm font-bold text-mango transition hover:bg-mango/25 active:scale-95 disabled:opacity-70"
            >
              <HeartHandshake className="h-4 w-4" />
              {wished[open.id] ? t("leg.wishDone") : t("leg.makeWish")}
            </button>
          )}
        </div>

        {/* Unlock / actions */}
        {done ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" /> {t("leg.unlocked")}
          </div>
        ) : (
          <button
            onClick={() => progress.unlockLegend(open.id, LEGEND_XP)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sunset to-mango py-3.5 font-bold text-white shadow-[0_4px_16px_rgba(255,122,69,0.4)] transition active:scale-95"
          >
            <Lock className="h-4 w-4" /> {t("leg.unlock", { xp: LEGEND_XP })}
          </button>
        )}

        <div className="flex gap-2">
          {open.lat != null && (
            <a
              href={gmapsUrl({ name: open.placeTh || T(open.title), lat: open.lat, lng: open.lng })}
              target="_blank"
              rel="noreferrer"
              onClick={() => bumpMetric("directionsOpened")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-lagoon/12 py-2.5 text-sm font-bold text-lagoon transition hover:bg-lagoon/20 active:scale-95"
            >
              <Navigation className="h-4 w-4" /> {t("ess.directions")}
            </a>
          )}
          <button
            onClick={() => onNavigate?.("chat")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/12"
          >
            <MessageCircle className="h-4 w-4" /> {t("leg.askGuide")}
          </button>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  const shown = filter === "all" ? LEGENDS : LEGENDS.filter((l) => l.type === filter);
  return (
    <div className="space-y-4 p-4 pb-6">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("leg.title")}</h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/50">
            {t("leg.progress", { done: unlocked.length, total: LEGENDS.length })}
          </p>
        </div>
      </div>

      {/* Type filters */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {["all", ...LEGEND_TYPES].map((ty) => {
          const active = filter === ty;
          const meta = TYPE_META[ty];
          return (
            <button
              key={ty}
              onClick={() => setFilter(ty)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                active
                  ? "bg-deep text-white dark:bg-white/15"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e1a2e] dark:text-slate-300"
              }`}
            >
              {meta && <meta.Icon className="h-4 w-4" />}
              {ty === "all" ? t("map.allDistricts") : t("leg.type." + ty)}
            </button>
          );
        })}
      </div>

      {/* Story cards */}
      <div className="space-y-3">
        {shown.map((l) => {
          const meta = TYPE_META[l.type];
          const done = isUnlocked(l.id);
          return (
            <button
              key={l.id}
              onClick={() => { setOpenId(l.id); bumpMetric("legendsRead"); }}
              className="flex w-full items-start gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:shadow-card active:scale-[0.98] dark:border-white/8 dark:bg-[#0e1a2e]"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.bg} ${meta.accent}`}>
                <meta.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="flex-1 font-bold leading-snug text-slate-900 dark:text-white">{T(l.title)}</h3>
                  {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{T(l.teaser)}</p>
                <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${meta.accent}`}>
                  <meta.Icon className="h-3 w-3" /> {t("leg.type." + l.type)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
