import { useEffect, useState } from "react";
import { fetchTop } from "../lib/leaderboard";
import { Card, Button, Spinner } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { RefreshCw, LogIn } from "lucide-react";

const RANK_TINT = {
  1: "bg-mango/20 text-amber-600 dark:bg-mango/20 dark:text-amber-300",
  2: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
  3: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
};

function Avatar({ src, name }) {
  if (src) return <img src={src} alt="" className="h-9 w-9 shrink-0 rounded-full" />;
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
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
      <Avatar src={r.photoURL} name={r.displayName} />
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
        <Card className="divide-y divide-slate-100 p-0 dark:divide-slate-800">
          {rows.map((r, i) => (
            <Row key={r.uid} r={r} rank={i + 1} me={r.uid === myUid} t={t} />
          ))}
        </Card>
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
