import { useEffect, useState } from "react";
import { fetchTop } from "../lib/leaderboard";
import { Card, Button, Spinner } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { RefreshCw, LogIn, Crown } from "lucide-react";

const RANK_TINT = {
  1: "bg-mango/20 text-amber-600 dark:bg-mango/20 dark:text-amber-300",
  2: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
  3: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
};

// Per-rank styling for the top-3 podium chart.
const PODIUM = {
  1: { bar: "from-mango to-sunset", ring: "ring-mango", chip: "bg-mango text-deep", av: "bg-mango/15 text-amber-600 dark:text-amber-300" },
  2: { bar: "from-slate-200 to-slate-100 dark:from-slate-600 dark:to-slate-700", ring: "ring-slate-200 dark:ring-slate-600", chip: "bg-slate-300 text-slate-700 dark:bg-slate-500 dark:text-white", av: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-200" },
  3: { bar: "from-orange-200 to-orange-100 dark:from-orange-500/40 dark:to-orange-500/20", ring: "ring-orange-200 dark:ring-orange-500/40", chip: "bg-orange-300 text-orange-900 dark:bg-orange-500/60 dark:text-orange-50", av: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300" },
};

function initial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function Avatar({ src, name, className = "" }) {
  if (src) return <img src={src} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300 ${className}`}>
      {initial(name)}
    </span>
  );
}

// One podium column. Rank 1 gets the bigger treatment + crown.
function PodiumBar({ r, rank, me, grow, t }) {
  const s = PODIUM[rank];
  const lead = rank === 1;
  const avSize = lead ? "h-14 w-14 text-lg" : "h-12 w-12 text-base";
  return (
    <div className="flex w-1/3 flex-col items-center">
      {lead && <Crown className="mb-0.5 h-5 w-5 text-mango" fill="currentColor" strokeWidth={1.5} />}
      <div className="relative mb-2">
        <Avatar
          src={r.photoURL}
          name={r.displayName}
          className={`${avSize} ring-4 ${s.ring} ${r.photoURL ? "" : s.av} ${me ? "outline outline-2 outline-offset-2 outline-sunset" : ""}`}
        />
        <span className={`absolute -bottom-1 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-[11px] font-extrabold ring-2 ring-white dark:ring-slate-900 ${s.chip}`}>
          <span className="tnum">{rank}</span>
        </span>
      </div>
      <p className={`max-w-full truncate text-center font-bold text-deep dark:text-slate-100 ${lead ? "text-sm" : "text-xs"}`}>
        {r.displayName}
        {me ? ` · ${t("lb.you")}` : ""}
      </p>
      <p className={`tnum font-extrabold ${lead ? "text-xs text-sunset" : "text-[11px] text-slate-400 dark:text-slate-500"}`}>
        {(r.xp ?? 0).toLocaleString()}
      </p>
      <div
        className={`mt-1.5 w-full rounded-t-xl bg-gradient-to-b ${s.bar} transition-[height] duration-700 ease-out`}
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
  // Bar height scales with XP but keeps a floor so low scores still read.
  const withH = top.map((r) => ({ ...r, _h: `${Math.round(58 + ((r.xp ?? 0) / maxXp) * 76)}px` }));
  const byRank = (n) => withH[n - 1];

  // Podium order: 2nd (left) · 1st (center) · 3rd (right). Skip missing slots.
  const order = [2, 1, 3].filter((n) => byRank(n));

  return (
    <Card className="pt-5">
      <div className="flex items-end justify-center gap-2.5">
        {order.map((n) => (
          <PodiumBar key={byRank(n).uid} r={byRank(n)} rank={n} me={byRank(n).uid === myUid} grow={grow} t={t} />
        ))}
      </div>
    </Card>
  );
}

function Row({ r, rank, me, t }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${me ? "bg-sunset/5 dark:bg-sunset/10" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
          RANK_TINT[rank] || "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        <span className="tnum">{rank}</span>
      </span>
      <Avatar src={r.photoURL} name={r.displayName} className="h-9 w-9" />
      <div className="flex-1 overflow-hidden">
        <p className="truncate font-semibold text-deep dark:text-slate-100">
          {r.displayName}
          {me && <span className="font-normal text-slate-400"> · {t("lb.you")}</span>}
        </p>
        {r.level && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("level." + r.level)}</p>
        )}
      </div>
      <span className="tnum shrink-0 text-sm font-bold text-sunset">{r.xp ?? 0} XP</span>
    </div>
  );
}

export default function Leaderboard({ auth, self, onLogin }) {
  const { t } = useT();
  const [rows, setRows] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchTop(50);
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const myUid = auth?.user?.uid;
  const inTop = rows ? rows.some((r) => r.uid === myUid) : false;
  const rest = rows ? rows.slice(3) : [];

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-deep dark:text-slate-100">{t("lb.title")}</h3>
        <button
          onClick={load}
          disabled={loading}
          aria-label={t("lb.refresh")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {!auth?.user && (
        <Card className="mb-2 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
            <LogIn className="h-5 w-5" />
          </span>
          <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{t("lb.loginToJoin")}</p>
          {auth?.enabled && (
            <Button onClick={onLogin} variant="soft" className="!px-4 !py-2 text-sm">
              {t("ach.login")}
            </Button>
          )}
        </Card>
      )}

      {rows === null ? (
        <Card>
          <Spinner label={t("lb.loading")} />
        </Card>
      ) : rows.length === 0 ? (
        <Card className="text-center text-sm text-slate-500 dark:text-slate-400">{t("lb.empty")}</Card>
      ) : (
        <div className="space-y-2">
          {/* Top-3 podium bar chart */}
          <Podium rows={rows} myUid={myUid} t={t} />

          {/* Ranks 4+ as a list */}
          {rest.length > 0 && (
            <Card className="divide-y divide-slate-100 p-0 dark:divide-slate-800">
              {rest.map((r, i) => (
                <Row key={r.uid} r={r} rank={i + 4} me={r.uid === myUid} t={t} />
              ))}
            </Card>
          )}
        </div>
      )}

      {/* Logged in but not yet on the board (sync still propagating, or below top 50). */}
      {rows && rows.length > 0 && myUid && !inTop && self && (
        <Card className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-deep dark:text-slate-100">{t("lb.notRanked")}</span>
          <span className="tnum text-sm font-bold text-sunset">{self.xp ?? 0} XP</span>
        </Card>
      )}
    </section>
  );
}
