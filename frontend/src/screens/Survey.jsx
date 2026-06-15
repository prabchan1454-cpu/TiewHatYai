import { useState } from "react";
import { Button } from "../components/ui";
import { useT } from "../lib/i18n.jsx";
import { SURVEY } from "../lib/survey";
import Mascot from "../components/Mascot";
import { Check, ClipboardList } from "lucide-react";

// Shown once after onboarding on first login. Collects a short, non-scored
// self-assessment of how well the traveler knows Songkhla.
export default function Survey({ onDone }) {
  const { t, lang } = useT();
  const [phase, setPhase] = useState("intro"); // intro | q
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState({});

  const tx = (o) => (lang === "en" ? o.en : o.th);
  const q = SURVEY[idx];
  const picked = responses[q?.id];
  const isLast = idx === SURVEY.length - 1;

  function pick(i) {
    setResponses((r) => ({ ...r, [q.id]: i }));
  }
  function next() {
    if (!isLast) setIdx((n) => n + 1);
    else onDone(responses);
  }
  function back() {
    if (idx > 0) setIdx((n) => n - 1);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#f0f4fc] dark:bg-[#0a1120]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-7">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ClipboardList className="h-4 w-4 text-sunset" /> {t("survey.title")}
        </span>
        <button onClick={() => onDone(responses)} className="text-xs font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          {t("survey.skip")}
        </button>
      </div>

      {/* ── Intro ───────────────────────────────────────────────── */}
      {phase === "intro" ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Mascot size={120} float className="drop-shadow-[0_10px_18px_rgba(27,42,74,0.2)]" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">{t("survey.heroTitle")}</h1>
          <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t("survey.subtitle")}</p>
          <Button onClick={() => setPhase("q")} variant="game" className="mt-7 w-full py-3.5">{t("survey.start")}</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col px-6 pt-6">
            {/* progress */}
            <div className="mb-5">
              <p className="mb-1.5 text-[11px] font-bold text-slate-500">{t("survey.progress", { n: idx + 1, total: SURVEY.length })}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-sunset to-mango transition-all duration-300" style={{ width: `${((idx + 1) / SURVEY.length) * 100}%` }} />
              </div>
            </div>

            <h2 className="text-xl font-extrabold leading-snug text-slate-900 dark:text-white">{tx(q.q)}</h2>

            <div className="mt-5 space-y-2.5">
              {q.options.map((opt, i) => {
                const active = picked === i;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 ${
                      active
                        ? "border-sunset bg-sunset/10 text-slate-900 dark:bg-sunset/15 dark:text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:border-sunset/40 hover:bg-sunset/5 dark:border-white/10 dark:bg-[#0e1a2e] dark:text-slate-200"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${active ? "border-sunset bg-sunset text-white" : "border-slate-300 dark:border-white/20"}`}>
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{tx(opt)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex gap-2.5 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
            {idx > 0 && (
              <Button onClick={back} variant="soft" className="flex-1">{t("survey.back")}</Button>
            )}
            <Button onClick={next} variant="game" disabled={picked === undefined} className="flex-[2]">
              {isLast ? t("survey.finish") : t("survey.next")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
