import { Card, Button } from "../components/ui";
import { levelFor, nextLevel } from "../lib/progress";

const LINKS = [
  { id: "chat", icon: "💬", title: "คุยกับน้องเที่ยว", desc: "ถามอะไรก็ได้เรื่องหาดใหญ่" },
  { id: "quests", icon: "🎯", title: "เควสผจญภัย", desc: "ทำภารกิจสะสม XP" },
  { id: "recommend", icon: "⭐", title: "ที่เที่ยวแนะนำ", desc: "ตามสไตล์ที่คุณชอบ" },
  { id: "profile", icon: "🏅", title: "รางวัลของฉัน", desc: "ตราสัญลักษณ์ที่สะสม" },
];

export default function Home({ progress, onNavigate }) {
  const { state } = progress;
  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - lvl.min) / (next.min - lvl.min)) * 100))
    : 100;

  return (
    <div className="space-y-4 p-4">
      <Card className="bg-gradient-to-br from-sunset to-mango text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">เลเวลของคุณ</p>
            <h2 className="text-2xl font-extrabold">{lvl.thai}</h2>
          </div>
          <div className="rounded-full bg-white/20 px-4 py-2 text-lg font-bold">
            ⚡ {state.xp} XP
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-white/80">
            {next ? `อีก ${next.min - state.xp} XP สู่ ${next.thai}` : "เลเวลสูงสุดแล้ว! 🎉"}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <div className="text-3xl font-extrabold text-lagoon">{state.completedQuests.length}</div>
          <p className="text-xs font-semibold text-slate-500">เควสสำเร็จ</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-extrabold text-sunset">{state.badges.length}</div>
          <p className="text-xs font-semibold text-slate-500">รางวัลที่ได้</p>
        </Card>
      </div>

      {state.activeQuest ? (
        <Card className="border-2 border-sunset/30">
          <p className="text-xs font-bold uppercase text-sunset">เควสที่กำลังทำ</p>
          <h3 className="mt-1 font-bold text-deep">{state.activeQuest.quest_name}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {state.activeQuest.objective}
          </p>
          <Button onClick={() => onNavigate("quests")} className="mt-3 w-full">
            ทำเควสต่อ 🎯
          </Button>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-lagoon/15 to-mango/10 text-center">
          <p className="font-bold text-deep">ยังไม่มีเควสที่กำลังทำ</p>
          <p className="mt-1 text-sm text-slate-500">รับภารกิจใหม่แล้วออกผจญภัยกันเลย!</p>
          <Button onClick={() => onNavigate("quests")} variant="lagoon" className="mt-3 w-full">
            รับเควสใหม่ 🎯
          </Button>
        </Card>
      )}

      <div>
        <p className="mb-2 px-1 font-bold text-deep">ไปต่อกันเลย</p>
        <div className="grid grid-cols-1 gap-2">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm shadow-slate-200/60 transition active:scale-[0.98]"
            >
              <span className="text-2xl">{l.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-deep">{l.title}</p>
                <p className="text-xs text-slate-500">{l.desc}</p>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
