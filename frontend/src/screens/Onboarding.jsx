import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card, ErrorBox, Spinner } from "../components/ui";

const CATEGORIES = ["อาหาร", "ของฝาก", "วัด", "ธรรมชาติ", "ตลาด", "คาเฟ่"];
const VIBES = ["เงียบสงบ", "คึกคัก", "ผจญภัย"];
const BUDGETS = ["ประหยัด", "ปานกลาง", "หรูหรา"];
const COMPANIONS = ["คนเดียว", "คู่", "ครอบครัว", "เพื่อน"];

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
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("ปานกลาง");
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

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-5 py-8">
      <div className="text-center">
        <div className="text-5xl">🗺️</div>
        <h1 className="mt-2 text-3xl font-extrabold text-deep">เที่ยวหาดใหญ่</h1>
        <p className="text-sm text-slate-500">ผจญภัยกับน้องเที่ยว ไกด์ AI ประจำเมือง</p>
      </div>

      <Card className="bg-gradient-to-br from-mango/20 to-lagoon/10">
        {loading ? (
          <Spinner label="น้องเที่ยวกำลังทักทาย..." />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-deep">{greeting}</p>
        )}
      </Card>

      <ErrorBox message={error} />

      <div className="space-y-4">
        <div>
          <p className="mb-2 font-bold text-deep">ชอบเที่ยวแบบไหน? <span className="text-slate-400 text-sm">(เลือกได้หลายอย่าง)</span></p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Choice key={c} label={c} active={categories.includes(c)} onClick={() => toggleCat(c)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">บรรยากาศที่ชอบ</p>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <Choice key={v} label={v} active={vibe === v} onClick={() => setVibe(v)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">งบประมาณ</p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Choice key={b} label={b} active={budget === b} onClick={() => setBudget(b)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold text-deep">มากับใคร</p>
          <div className="flex flex-wrap gap-2">
            {COMPANIONS.map((c) => (
              <Choice key={c} label={c} active={companion === c} onClick={() => setCompanion(c)} />
            ))}
          </div>
        </div>
      </div>

      <Button
        disabled={!ready}
        onClick={() => onDone({ categories: categories.join(", "), vibe, budget, companion })}
        className="mt-auto w-full"
      >
        เริ่มผจญภัย 🎯
      </Button>
    </div>
  );
}
