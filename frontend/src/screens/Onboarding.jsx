import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Spinner, LangToggle } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

const CATEGORIES = ["cat.food", "cat.souvenir", "cat.temple", "cat.nature", "cat.market", "cat.cafe"];
const VIBES = ["vibe.calm", "vibe.lively", "vibe.adventure"];
const BUDGETS = ["budget.cheap", "budget.medium", "budget.luxury"];
const COMPANIONS = ["companion.solo", "companion.couple", "companion.family", "companion.friends"];

function Choice({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-sunset text-white shadow" : "bg-white text-deep border border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function Onboarding({ onDone }) {
  const { t } = useT();
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("budget.medium");
  const [companion, setCompanion] = useState("");

  useEffect(() => {
    api
      .onboard()
      .then((d) => setGreeting(d.message))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleCat = (c) =>
    setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const ready = categories.length > 0 && companion;

  function finish() {
    onDone({
      categories: categories.map((c) => t(c)).join(", "),
      vibe: vibe ? t(vibe) : "",
      budget: t(budget),
      companion: companion ? t(companion) : "",
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-5 py-8">
      <div className="flex justify-end">
        <LangToggle />
      </div>
      <div className="text-center">
        <div className="text-5xl">🗺️</div>
        <h1 className="mt-2 text-3xl font-extrabold text-deep">{t("app.title")}</h1>
        <p className="text-sm text-slate-500">{t("onboard.subtitle")}</p>
      </div>

      <Card className="bg-gradient-to-br from-mango/20 to-lagoon/10">
        {loading ? (
          <Spinner label={t("onboard.greeting")} />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-deep">{greeting}</p>
        )}
      </Card>

      <ErrorBox message={error} />

      <div className="space-y-4">
        <div>
          <p className="mb-2 font-bold text-deep">
            {t("onboard.q.categories")}{" "}
            <span className="text-slate-400 text-sm">{t("onboard.q.categories.hint")}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Choice key={c} label={t(c)} active={categories.includes(c)} onClick={() => toggleCat(c)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">{t("onboard.q.vibe")}</p>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <Choice key={v} label={t(v)} active={vibe === v} onClick={() => setVibe(v)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">{t("onboard.q.budget")}</p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Choice key={b} label={t(b)} active={budget === b} onClick={() => setBudget(b)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">{t("onboard.q.companion")}</p>
          <div className="flex flex-wrap gap-2">
            {COMPANIONS.map((c) => (
              <Choice key={c} label={t(c)} active={companion === c} onClick={() => setCompanion(c)} />
            ))}
          </div>
        </div>
      </div>

      <Button disabled={!ready} onClick={finish} className="mt-auto w-full">
        {t("onboard.cta")}
      </Button>
    </div>
  );
}
