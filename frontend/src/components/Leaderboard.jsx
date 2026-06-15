import { useEffect, useState } from "react";
import { fetchTop } from "../lib/leaderboard";
import { Button, Spinner } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { RefreshCw, LogIn, Crown, Zap } from "lucide-react";

function initial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function Avatar({ src, name, className = "" }) {
  if (src) return <img src={src} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-bold ${className}`}>
      {initial(name)}
    </span>
  );
}

const PODIUM_STYLE = {
  1: {
    bar: "from-mango to-sunset",
    ring: "ring-mango shadow-[0_0_14px_rgba(255,176,32,0.5)]",
    chip: "bg-mango text-deep",
    av: "bg-mango/20 text-amber-300",
    xpColor: "text-mango",
  },
  2: {
    bar: "from-slate-400 to-slate-500",
    ring: "ring-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.3)]",
    chip: "bg-slate-400 text-slate-900",
    av: "bg-slate-600/50 text-slate-300",
    xpColor: "text-slate-400",
  },
  3: {
    bar: "from-orange-400 to-amber-600",
    ring: "ring-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)]",
    chip: "bg-orange-400 text-orange-900",
    av: "bg-orange-900/30 text-orange-400",
    xpColor: "text-orange-400",
  },
};

function PodiumBar({ r, rank, me, grow, t }) {
  const s = PODIUM_STYLE[rank];
  const lead = rank === 1;
  const avSize = lead ? "h-14 w-14 text-lg" : "h-12 w-12 text-sm";
  return (
    <div className="flex w-1/3 flex-col items-center">
      {lead && <Crown className="mb-1 h-5 w-5 text-mango drop-shadow-[0_0_6px_rgba(255,176,32,0.8)]" fill="currentColor" strokeWidth={1.5} />}
      {!lead && <span className="mb-1 h-5" />}
      <div className="relative mb-2">
        <Avatar
          src={r.photoURL}
          name={r.displayName}
          className={`${avSize} ring-4 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0e1525] ${s.ring} ${!r.photoURL ? s.av : ""} ${me ? "outline outline-2 outline-offset-2 outline-sunset" : ""}`}
        />
        <span className={`absolute -bottom-1 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-[11px] font-extrabold ring-2 ring-slate-50 dark:ring-[#0e1525] ${s.chip}`}>
          <span className="tnum">{rank}</span>
        </span>
      </div>
      <p className={`max-w-full truncate text-center font-bold text-slate-900 dark:text-white ${lead ? "text-sm" : "text-xs"}`}>
        {r.displayName}
        {me ? ` · ${t("lb.you")}` : ""}
      </p>
      <p className={`tnum flex items-center gap-0.5 font-extrabold ${lead ? "text-xs" : "text-[11px]"} ${s.xpColor}`}>
        <Zap className="h-2.5 w-2.5" /> {(r.xp ?? 0).toLocaleString()}
      </p>
      <div
        className={`mt-2 w-full rounded-t-xl bg-gradient-to-b ${s.bar} opacity-70 transition-[height] duration-700 ease-out`}
        style={{ height: grow ? r._h : 0 }}
      />
    </div>
  );
}

function Podium({ rows, myUid, t }) {
  const [grow, setGrow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const top = rows.slice(0, 3);
  const maxXp = Math.max(1, ...top.map((r) => r.xp ?? 0));
  const withH = top.map((r) => ({ ...r, _h: `${Math.round(58 + ((r.xp ?? 0) / maxXp) * 76)}px` }));
  const byRank = (n) => withH[n - 1];
  const order = [2, 1, 3].filter((n) => byRank(n));

  return (
    <div className="rounded-3xl bg-hero-mesh-light border border-slate-200 p-5 pb-0 overflow-hidden dark:bg-hero-mesh dark:border-white/8">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">🏆 {t("lb.title")}</p>
      <div className="flex items-end justify-center gap-3">
        {order.map((n) => (
          <PodiumBar key={byRank(n).uid} r={byRank(n)} rank={n} me={byRank(n).uid === myUid} grow={grow} t={t} />
        ))}
      </div>
    </div>
  );
}

function Row({ r, rank, me, t }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition ${me ? "bg-sunset/8 border-l-2 border-sunset" : ""}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold border ${
        rank === 4 ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-300" :
        "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
      }`}>
        <span className="tnum">{rank}</span>
      </span>
      <Avatar
        src={r.photoURL}
        name={r.displayName}
        className="h-9 w-9 ring-1 ring-white/10 bg-slate-700 text-slate-300"
      />
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {r.displayName}
          {me && <span className="ml-1 font-normal text-slate-500"> · {t("lb.you")}</span>}
        </p>
        {r.level && <p className="text-[11px] text-slate-500">{t("level." + r.level)}</p>}
      </div>
      <span className="tnum shrink-0 flex items-center gap-0.5 text-sm font-bold text-mango">
        <Zap className="h-3 w-3" /> {r.xp ?? 0}
      </span>
    </div>
  );
}

export default function Leaderboard({ auth, self, onLogin }) {
  const { t } = useT();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchTop(50);
    setRows(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const myUid = auth?.user?.uid;
  const inTop = rows ? rows.some((r) => r.uid === myUid) : false;
  const rest = rows ? rows.slice(3) : [];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("lb.title")}</h3>
        <button
          onClick={load}
          disabled={loading}
          aria-label={t("lb.refresh")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-500 transition hover:bg-white/8 hover:text-slate-300 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {!auth?.user && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-lagoon/20 bg-lagoon/8 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/20 text-lagoon">
            <LogIn className="h-5 w-5" />
          </span>
          <p className="flex-1 text-sm text-slate-400">{t("lb.loginToJoin")}</p>
          {auth?.enabled && (
            <Button onClick={onLogin} variant="lagoon" className="!px-4 !py-2 text-sm">
              {t("ach.login")}
            </Button>
          )}
        </div>
      )}

      {rows === null ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 dark:bg-[#0e1a2e] dark:border-white/8">
          <Spinner label={t("lb.loading")} />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center text-sm text-slate-500 dark:bg-[#0e1a2e] dark:border-white/8">
          {t("lb.empty")}
        </div>
      ) : (
        <div className="space-y-2">
          <Podium rows={rows} myUid={myUid} t={t} />

          {rest.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 divide-y divide-slate-100 dark:border-white/8 dark:bg-[#0e1525] dark:divide-white/5">
              {rest.map((r, i) => (
                <Row key={r.uid} r={r} rank={i + 4} me={r.uid === myUid} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {rows && rows.length > 0 && myUid && !inTop && self && (
        <div className="mt-2 flex items-center justify-between rounded-2xl border border-sunset/20 bg-sunset/8 px-4 py-3">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{t("lb.notRanked")}</span>
          <span className="tnum flex items-center gap-0.5 text-sm font-bold text-mango">
            <Zap className="h-3.5 w-3.5" /> {self.xp ?? 0}
          </span>
        </div>
      )}
    </section>
  );
}
