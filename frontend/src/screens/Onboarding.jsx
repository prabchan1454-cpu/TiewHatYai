import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Spinner, LangToggle } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

const CATEGORIES = ["cat.food", "cat.souvenir", "cat.temple", "cat.nature", "cat.market", "cat.cafe"];
const VIBES = ["vibe.calm", "vibe.lively", "vibe.adventure"];
const BUDGETS = ["budget.cheap", "budget.medium", "budget.luxury"];
const COMPANIONS = ["companion.solo", "companion.couple", "companion.family", "companion.friends"];
const DURATIONS = ["duration.half", "duration.one", "duration.multi"];
const INTERESTS = ["interest.photo", "interest.history", "interest.shopping", "interest.spa", "interest.sport", "interest.nightlife"];

const TOTAL_STEPS = 4;

function Choice({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-sunset text-white shadow-md scale-105"
          : "bg-white text-deep border border-slate-200 active:scale-95"
      }`}
    >
      {label}
    </button>
  );
}

function StepDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2 my-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "w-7 bg-sunset"
              : i < current
              ? "w-2 bg-mango"
              : "w-2 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function Onboarding({ onDone }) {
  const { t } = useT();
  const [greeting, setGreeting] = useState("");
  const [loadingGreet, setLoadingGreet] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("budget.medium");
  const [companion, setCompanion] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState([]);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    api
      .onboard()
      .then((d) => setGreeting(d.message))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingGreet(false));
  }, []);

  const toggleCat = (c) =>
    setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const toggleInterest = (i) =>
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  function goNext() {
    setDir("right");
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDir("left");
    setAnimKey((k) => k + 1);
    setStep((s) => s - 1);
  }

  function finish() {
    onDone({
      categories: categories.map((c) => t(c)).join(", "),
      vibe: vibe ? t(vibe) : "",
      budget: t(budget),
      companion: companion ? t(companion) : "",
      duration: duration ? t(duration) : "",
      interests: interests.map((i) => t(i)).join(", "),
    });
  }

  const canNext = [
    categories.length > 0,
    true,
    !!companion,
    true,
  ][step];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8 animate-slide-up">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <img src="/logo.svg" alt="TiewHatyai" className="h-10 w-10 rounded-xl shadow" />
        <LangToggle />
      </div>

      {/* Greeting card */}
      <Card className="bg-gradient-to-br from-mango/20 to-lagoon/10 mb-2">
        {loadingGreet ? (
          <Spinner label={t("onboard.greeting")} />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-deep text-sm">{greeting}</p>
        )}
      </Card>

      <ErrorBox message={error} />

      {/* Progress dots */}
      <StepDots current={step} total={TOTAL_STEPS} />

      {/* Animated step content */}
      <div
        key={animKey}
        className={`flex-1 ${dir === "right" ? "animate-slide-in-right" : "animate-slide-in-left"}`}
      >
        {/* Step 0 — ชอบเที่ยวแบบไหน */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-1">🗂️</div>
              <p className="font-bold text-deep text-lg">{t("onboard.q.categories")}</p>
              <p className="text-sm text-slate-400">{t("onboard.q.categories.hint")}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {CATEGORIES.map((c) => (
                <Choice key={c} label={t(c)} active={categories.includes(c)} onClick={() => toggleCat(c)} />
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — สไตล์ + งบ */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-1">✨</div>
              <p className="font-bold text-deep text-lg">{t("onboard.q.vibe_budget")}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm">{t("onboard.q.vibe")}</p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <Choice key={v} label={t(v)} active={vibe === v} onClick={() => setVibe(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm">{t("onboard.q.budget")}</p>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <Choice key={b} label={t(b)} active={budget === b} onClick={() => setBudget(b)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — มากับใคร + ระยะเวลา */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-1">🧭</div>
              <p className="font-bold text-deep text-lg">{t("onboard.q.companion_duration")}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm">{t("onboard.q.companion")}</p>
              <div className="flex flex-wrap gap-2">
                {COMPANIONS.map((c) => (
                  <Choice key={c} label={t(c)} active={companion === c} onClick={() => setCompanion(c)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm">{t("onboard.q.duration")}</p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <Choice key={d} label={t(d)} active={duration === d} onClick={() => setDuration(d)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — ความสนใจพิเศษ */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-1">🌟</div>
              <p className="font-bold text-deep text-lg">{t("onboard.q.interests")}</p>
              <p className="text-sm text-slate-400">{t("onboard.q.interests.hint")}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {INTERESTS.map((i) => (
                <Choice key={i} label={t(i)} active={interests.includes(i)} onClick={() => toggleInterest(i)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={goBack}
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-500 transition hover:bg-slate-50 active:scale-95"
          >
            {t("onboard.back")}
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button
            disabled={!canNext}
            onClick={goNext}
            className={step === 0 ? "w-full" : "flex-1"}
          >
            {t("onboard.next")}
          </Button>
        ) : (
          <Button onClick={finish} className="flex-1">
            {t("onboard.cta")}
          </Button>
        )}
      </div>
    </div>
  );
}
