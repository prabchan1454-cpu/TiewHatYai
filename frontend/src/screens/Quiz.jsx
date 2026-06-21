// "Know Hat Yai" trivia quiz — answer local-knowledge questions for XP. Awards
// XP through the shared progress state (so it counts toward levels and the
// leaderboard), and bumps the quizzesTaken metric for the Impact dashboard.
import { useState } from "react";
import { useT } from "../lib/i18n.jsx";
import { QUIZ, QUIZ_XP_PER_CORRECT } from "../lib/quiz";
import { bumpMetric } from "../lib/metrics";
import { Button } from "../components/ui";
import { ArrowLeft, Brain, CheckCircle2, XCircle, Lightbulb, Trophy } from "lucide-react";

export default function Quiz({ progress, onBack }) {
  const { t, lang } = useT();
  const [phase, setPhase] = useState("intro"); // intro | play | done
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const T = (o) => (lang === "en" ? o.en : o.th);

  const total = QUIZ.length;
  const q = QUIZ[i];

  function start() {
    setPhase("play"); setI(0); setPicked(null); setScore(0);
  }

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 < total) {
      setI(i + 1);
      setPicked(null);
    } else {
      const earned = score * QUIZ_XP_PER_CORRECT;
      if (earned > 0) progress.update((s) => ({ ...s, xp: s.xp + earned }));
      bumpMetric("quizzesTaken");
      setPhase("done");
    }
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="space-y-4 p-4 pb-6">
        <Header t={t} onBack={onBack} />
        <div className="rounded-3xl bg-gradient-to-br from-lagoon to-deep p-6 text-center text-white shadow-hero">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20">
            <Brain className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold">{t("quiz.title")}</h2>
          <p className="mt-1.5 text-sm opacity-90">{t("quiz.subtitle")}</p>
          <p className="mt-3 text-xs font-semibold opacity-80">
            {total} {lang === "en" ? "questions" : "ข้อ"} · +{QUIZ_XP_PER_CORRECT} XP {lang === "en" ? "each" : "ต่อข้อ"}
          </p>
        </div>
        <Button variant="game" onClick={start} className="w-full py-4 text-lg">{t("quiz.start")}</Button>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────
  if (phase === "done") {
    const earned = score * QUIZ_XP_PER_CORRECT;
    const perfect = score === total;
    return (
      <div className="space-y-4 p-4 pb-6">
        <Header t={t} onBack={onBack} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center dark:border-white/8 dark:bg-[#0e1a2e]">
          <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${perfect ? "bg-mango/20 text-mango" : "bg-lagoon/15 text-lagoon"}`}>
            <Trophy className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">{t("quiz.resultTitle")}</h2>
          <p className="font-display mt-2 text-4xl leading-none text-slate-900 dark:text-white">
            <span className="tnum">{score}</span>
            <span className="text-slate-400">/{total}</span>
          </p>
          <p className="mt-1 text-sm font-bold text-mango">{t("quiz.earned", { xp: earned })}</p>
          {perfect && <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">{t("quiz.perfect")}</p>}
        </div>
        <Button variant="soft" onClick={start} className="w-full">{t("quiz.again")}</Button>
      </div>
    );
  }

  // ── Play ─────────────────────────────────────────────────────────────────
  const answered = picked !== null;
  return (
    <div className="space-y-4 p-4 pb-6">
      <Header t={t} onBack={onBack} />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-lagoon to-sunset transition-all duration-300" style={{ width: `${((i + (answered ? 1 : 0)) / total) * 100}%` }} />
        </div>
        <span className="tnum text-xs font-bold text-slate-500">{t("quiz.question", { n: i + 1, total })}</span>
      </div>

      {/* Question */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-[#0e1a2e]">
        <h2 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{T(q.q)}</h2>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, idx) => {
            const correct = idx === q.answer;
            const chosen = picked === idx;
            let cls = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100";
            if (answered && correct) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
            else if (answered && chosen) cls = "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300";
            else if (answered) cls = "border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500";
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={answered}
                className={`flex w-full items-center gap-2.5 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition active:scale-[0.98] ${cls}`}
              >
                <span className="flex-1">{T(opt)}</span>
                {answered && correct && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
                {answered && chosen && !correct && <XCircle className="h-5 w-5 shrink-0 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-4 flex gap-2 rounded-2xl bg-mango/10 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            <Lightbulb className="h-4 w-4 shrink-0 text-mango" />
            <span><b>{t("quiz.explain")}:</b> {T(q.explain)}</span>
          </div>
        )}
      </div>

      {answered && (
        <Button variant="game" onClick={next} className="w-full">
          {i + 1 < total ? t("quiz.next") : t("quiz.finish")}
        </Button>
      )}
    </div>
  );
}

function Header({ t, onBack }) {
  return (
    <div className="flex items-center gap-2">
      {onBack && (
        <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-extrabold text-slate-900 dark:text-white">{t("quiz.title")}</h1>
    </div>
  );
}
