// "Local Living" essentials — hospitals, pharmacies, transport, public
// services + one-tap emergency SOS. The module that takes TiewHatyai beyond
// tourism into a daily-use app for residents (judge feedback: expand beyond
// tourism / add healthcare, emergency, transport, living info).
import { useState } from "react";
import { useT } from "../lib/i18n.jsx";
import { gmapsUrl } from "../lib/landmarks";
import { EMERGENCY, CATEGORIES, ESSENTIALS, TONES, essentialsByCategory } from "../lib/essentials";
import { bumpMetric } from "../lib/metrics";
import { ArrowLeft, Phone, Navigation, Clock, BadgeCheck, ShieldAlert } from "lucide-react";

function dial(phone, isEmergency) {
  bumpMetric(isEmergency ? "emergencyOpens" : "essentialLookups");
  window.location.href = `tel:${phone}`;
}

export default function Essentials({ onBack }) {
  const { t, lang } = useT();
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const items = essentialsByCategory(cat);
  const L = (o, key) => (lang === "en" ? o[`en${key ? "_" + key : ""}`] : o[`th${key ? "_" + key : ""}`]);

  return (
    <div className="space-y-4 p-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("ess.title")}</h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/50">{t("ess.subtitle")}</p>
        </div>
      </div>

      {/* SOS hero — big one-tap medical emergency */}
      <button
        onClick={() => dial("1669", true)}
        className="group flex w-full items-center gap-3 rounded-3xl bg-gradient-to-br from-boat to-boat p-4 text-left text-white shadow-[0_8px_24px_rgba(225,29,72,0.35)] transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boat"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-extrabold leading-tight">{t("ess.sos")}</p>
          <p className="mt-0.5 text-xs font-semibold opacity-90">{t("ess.sosDesc")}</p>
        </div>
        <Phone className="h-5 w-5 shrink-0 opacity-90" />
      </button>

      {/* Emergency quick-dial grid */}
      <div className="grid grid-cols-2 gap-2">
        {EMERGENCY.map((e) => {
          const tone = TONES[e.tone] || TONES.teal;
          return (
            <button
              key={e.id}
              onClick={() => dial(e.phone, true)}
              className={`flex items-center gap-2.5 rounded-2xl border bg-white p-3 text-left transition active:scale-[0.97] dark:bg-[#0e1a2e] ${tone.ring}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
                <e.Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{lang === "en" ? e.en : e.th}</span>
                <span className={`tnum block text-base font-extrabold ${tone.text}`}>{e.phone}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Category tabs */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {CATEGORIES.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                active
                  ? "bg-lagoon text-white shadow-[0_4px_12px_rgba(15,185,177,0.35)]"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e1a2e] dark:text-slate-300"
              }`}
            >
              <c.Icon className="h-4 w-4" />
              {lang === "en" ? c.en : c.th}
            </button>
          );
        })}
      </div>

      {/* Service list */}
      <div className="space-y-2.5">
        {items.map((it) => (
          <div key={it.id} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/8 dark:bg-[#0e1a2e]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lagoon/15 text-lagoon">
                <it.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold leading-snug text-slate-900 dark:text-white">{lang === "en" ? it.en : it.th}</h3>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-slate-500 dark:text-white/50">
                  <span>{it.district}</span>
                  {it.hours24 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-300">
                      <Clock className="h-2.5 w-2.5" /> {t("ess.open24")}
                    </span>
                  )}
                </p>
                {L(it, "note") && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{L(it, "note")}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
              {it.phone && (
                <button
                  onClick={() => dial(it.phone, false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-lagoon/12 py-2.5 text-sm font-bold text-lagoon transition hover:bg-lagoon/20 active:scale-95"
                >
                  <Phone className="h-4 w-4" /> {t("ess.call")}
                </button>
              )}
              <a
                href={gmapsUrl({ name: it.th, lat: it.lat, lng: it.lng })}
                target="_blank"
                rel="noreferrer"
                onClick={() => bumpMetric("directionsOpened")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sunset/12 py-2.5 text-sm font-bold text-sunset transition hover:bg-sunset/20 active:scale-95"
              >
                <Navigation className="h-4 w-4" /> {t("ess.directions")}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Trust footer */}
      <p className="flex items-center justify-center gap-1.5 px-4 pt-1 text-center text-[11px] text-slate-400 dark:text-white/35">
        <BadgeCheck className="h-3.5 w-3.5 text-lagoon" />
        {t("ess.trust", { n: ESSENTIALS.length })}
      </p>
    </div>
  );
}
