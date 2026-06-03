import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Spinner, LangToggle, ThemeToggle } from "../components/ui";
import { useT } from "../lib/i18n.jsx";
import { festivalsInRange } from "../lib/festivals";
import { LayoutGrid, Palette, Users, Heart } from "lucide-react";

function StepHead({ Icon, title, hint }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset/10 text-sunset">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-2.5 text-lg font-bold text-deep dark:text-slate-100">{title}</p>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

const CATEGORIES = ["cat.food", "cat.souvenir", "cat.temple", "cat.nature", "cat.market", "cat.cafe"];
const VIBES = ["vibe.calm", "vibe.lively", "vibe.adventure"];
const BUDGETS = ["budget.cheap", "budget.medium", "budget.luxury"];
const COMPANIONS = ["companion.solo", "companion.couple", "companion.family", "companion.friends"];
const INTERESTS = ["interest.photo", "interest.history", "interest.shopping", "interest.spa", "interest.sport", "interest.nightlife"];

const todayISO = () => new Date().toISOString().slice(0, 10);

const TOTAL_STEPS = 4;

function Choice({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e1525] ${
        active
          ? "bg-sunset text-white shadow-md scale-105"
          : "bg-white text-deep border border-slate-200 hover:border-sunset hover:bg-orange-50 active:scale-95 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
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
  const { t, lang } = useT();
  const [greeting, setGreeting] = useState("");
  const [loadingGreet, setLoadingGreet] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("budget.medium");
  const [companion, setCompanion] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [interests, setInterests] = useState([]);

  // Derive trip length + any festivals that overlap the chosen window.
  const tripDays =
    dateStart && dateEnd
      ? Math.round((new Date(dateEnd) - new Date(dateStart)) / 86400000) + 1
      : 0;
  const datesValid = !!dateStart && !!dateEnd && tripDays > 0;
  const tripFestivals = datesValid ? festivalsInRange(dateStart, dateEnd) : [];
  const festivalNames = tripFestivals.map((f) => (lang === "en" ? f.en : f.th)).join(", ");

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
      dateStart,
      dateEnd,
      duration: datesValid ? t("onboard.date.days", { n: tripDays }) : "",
      festivals: festivalNames,
      interests: interests.map((i) => t(i)).join(", "),
    });
  }

  const canNext = [
    categories.length > 0,
    true,
    !!companion && datesValid,
    true,
  ][step];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8 animate-slide-up">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <img src="/logo.svg" alt="Travel Songkhla" className="h-10 w-10 rounded-xl shadow" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>

      {/* Greeting card */}
      <Card className="bg-gradient-to-br from-mango/20 to-lagoon/10 mb-2 dark:from-mango/10 dark:to-lagoon/5">
        {loadingGreet ? (
          <Spinner label={t("onboard.greeting")} />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-deep text-sm dark:text-slate-100">{greeting}</p>
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
            <StepHead Icon={LayoutGrid} title={t("onboard.q.categories")} hint={t("onboard.q.categories.hint")} />
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
            <StepHead Icon={Palette} title={t("onboard.q.vibe_budget")} />
            <div>
              <p className="mb-2 font-semibold text-deep text-sm dark:text-slate-100">{t("onboard.q.vibe")}</p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <Choice key={v} label={t(v)} active={vibe === v} onClick={() => setVibe(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm dark:text-slate-100">{t("onboard.q.budget")}</p>
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
            <StepHead Icon={Users} title={t("onboard.q.companion_duration")} />
            <div>
              <p className="mb-2 font-semibold text-deep text-sm dark:text-slate-100">{t("onboard.q.companion")}</p>
              <div className="flex flex-wrap gap-2">
                {COMPANIONS.map((c) => (
                  <Choice key={c} label={t(c)} active={companion === c} onClick={() => setCompanion(c)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold text-deep text-sm dark:text-slate-100">{t("onboard.q.duration")}</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t("onboard.date.start")}
                  <input
                    type="date"
                    value={dateStart}
                    min={todayISO()}
                    onChange={(e) => {
                      setDateStart(e.target.value);
                      if (dateEnd && dateEnd < e.target.value) setDateEnd(e.target.value);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark]"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t("onboard.date.end")}
                  <input
                    type="date"
                    value={dateEnd}
                    min={dateStart || todayISO()}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark]"
                  />
                </label>
              </div>
              {dateStart && dateEnd && !datesValid && (
                <p className="mt-2 text-xs font-semibold text-red-500">{t("onboard.date.invalid")}</p>
              )}
              {datesValid && (
                <p className="mt-2 text-xs font-semibold text-lagoon">{t("onboard.date.days", { n: tripDays })}</p>
              )}
              {datesValid && festivalNames && (
                <p className="mt-1 rounded-lg bg-mango/15 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {t("onboard.date.festival", { names: festivalNames })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — ความสนใจพิเศษ */}
        {step === 3 && (
          <div className="space-y-4">
            <StepHead Icon={Heart} title={t("onboard.q.interests")} hint={t("onboard.q.interests.hint")} />
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
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-600 transition duration-200 hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/40 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-[#0e1525]"
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
