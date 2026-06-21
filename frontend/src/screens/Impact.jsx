// Impact / KPI dashboard — the judging centerpiece. Quantifies the value the
// platform creates: the user's real adventure stats + community totals (seeded
// aggregate baselines combined with the user's real contributions) + a
// tourism-spread chart proving stamps reach beyond Hat Yai's core.
import { useEffect, useState } from "react";
import { useT } from "../lib/i18n.jsx";
import { landmarkById, DISTRICTS } from "../lib/landmarks";
import { LEGENDS } from "../lib/legends";
import { readMetrics } from "../lib/metrics";
import { fetchBusinesses } from "../lib/businesses";
import {
  ArrowLeft, MapPinned, Flag, Stamp, Award, BookOpen, Users, Store, ShieldAlert,
} from "lucide-react";

// Seeded community baselines so the live demo shows realistic aggregate impact
// (pilot-scale). The user's real activity is added on top.
const SEED = {
  quests: 14820,
  stamps: 9630,
  checkins: 2140,
  legends: 5380,
  businesses: 186,
  emergency: 2970,
};

export default function Impact({ progress, onBack }) {
  const { t } = useT();
  const { state } = progress;
  const metrics = readMetrics();
  const [bizCount, setBizCount] = useState(0);

  useEffect(() => {
    fetchBusinesses(50).then((l) => setBizCount(l.length)).catch(() => {});
  }, []);

  // ── Personal stats ────────────────────────────────────────────────────────
  const stamps = state.collectedStamps || [];
  const legends = state.unlockedLegends || [];
  const districtsReached = new Set(
    stamps.map((s) => landmarkById(s.id)?.district).filter(Boolean)
  ).size;
  const emergencyUse = (metrics.emergencyOpens || 0) + (metrics.essentialLookups || 0);

  const mine = [
    { Icon: MapPinned, mkey: "districts", value: districtsReached, accent: "text-lagoon" },
    { Icon: Flag, mkey: "quests", value: state.completedQuests.length, accent: "text-sunset" },
    { Icon: Stamp, mkey: "stamps", value: stamps.length, accent: "text-mango" },
    { Icon: Award, mkey: "badges", value: state.badges.length, accent: "text-gold" },
    { Icon: BookOpen, mkey: "legends", value: legends.length, accent: "text-sunset" },
    { Icon: ShieldAlert, mkey: "emergency", value: emergencyUse, accent: "text-boat" },
  ];

  // ── Community totals (seed + user's real contribution) ─────────────────────
  const community = [
    { Icon: Flag, mkey: "quests", value: SEED.quests + state.completedQuests.length, accent: "text-sunset" },
    { Icon: Stamp, mkey: "stamps", value: SEED.stamps + stamps.length, accent: "text-mango" },
    { Icon: BookOpen, mkey: "legends", value: SEED.legends + legends.length, accent: "text-lagoon" },
    { Icon: Users, mkey: "checkins", value: SEED.checkins, accent: "text-lagoon" },
    { Icon: Store, mkey: "businesses", value: SEED.businesses + bizCount, accent: "text-emerald-500" },
    { Icon: ShieldAlert, mkey: "emergency", value: SEED.emergency + emergencyUse, accent: "text-boat" },
  ];

  // ── Tourism spread: stamps per district ────────────────────────────────────
  const byDistrict = DISTRICTS.map((d) => ({
    d,
    n: stamps.filter((s) => landmarkById(s.id)?.district === d).length,
  }));
  const maxN = Math.max(1, ...byDistrict.map((x) => x.n));

  return (
    <div className="space-y-5 p-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("impact.title")}</h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/50">{t("impact.subtitle")}</p>
        </div>
      </div>

      {/* Your adventure */}
      <Section title={t("impact.yourImpact")}>
        <div className="grid grid-cols-3 gap-2">
          {mine.map((s) => <Stat key={s.mkey} t={t} {...s} />)}
        </div>
      </Section>

      {/* Tourism spread chart */}
      <Section title={t("impact.spread")}>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/8 dark:bg-[#0e1a2e]">
          <p className="mb-3 text-[11px] leading-relaxed text-slate-500 dark:text-white/50">{t("impact.spreadDesc")}</p>
          <div className="space-y-1.5">
            {byDistrict.map(({ d, n }) => (
              <div key={d} className="flex items-center gap-2">
                <span className="w-20 shrink-0 truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300">{d}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-lagoon to-sunset transition-all duration-500" style={{ width: `${(n / maxN) * 100}%` }} />
                </div>
                <span className="tnum w-4 shrink-0 text-right text-[11px] font-bold text-slate-500">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Community totals */}
      <Section title={t("impact.community")}>
        <div className="grid grid-cols-3 gap-2">
          {community.map((s) => <Stat key={s.mkey} t={t} {...s} big />)}
        </div>
        <p className="mt-2 px-1 text-center text-[10px] text-slate-400 dark:text-white/35">{t("impact.demoNote")}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ Icon, mkey, value, accent, t, big }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white py-3 dark:border-white/8 dark:bg-[#0e1a2e]">
      <Icon className={`h-4 w-4 ${accent}`} />
      <span className={`tnum font-extrabold text-slate-900 dark:text-white ${big ? "text-lg" : "text-base"}`}>
        {value.toLocaleString()}
      </span>
      <span className="px-1 text-center text-[9px] leading-tight text-slate-400 dark:text-white/40">{t("impact." + mkey)}</span>
    </div>
  );
}
