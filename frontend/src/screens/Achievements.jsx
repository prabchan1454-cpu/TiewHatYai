import { levelFor, nextLevel } from "../lib/progress";
import { Card, Pill } from "../components/ui";

const RARITY_RING = {
  Common: "ring-slate-200",
  Rare: "ring-sky-300",
  Epic: "ring-violet-300",
  Legendary: "ring-amber-300",
};

export default function Achievements({ progress, auth, onLogout }) {
  const { state, reset } = progress;
  const lvl = levelFor(state.xp);
  const next = nextLevel(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - lvl.min) / (next.min - lvl.min)) * 100))
    : 100;

  return (
    <div className="space-y-4 px-4 py-4">
      <Card className="bg-gradient-to-br from-deep to-lagoon text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
            🧭
          </div>
          <div>
            <p className="text-sm text-white/70">เลเวลของคุณ</p>
            <h2 className="text-2xl font-extrabold">{lvl.thai}</h2>
            <p className="text-xs text-white/60">{lvl.name}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>{state.xp} XP</span>
            <span>{next ? `อีก ${next.min - state.xp} XP → ${next.thai}` : "เลเวลสูงสุด! 🏆"}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-mango transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-3xl font-extrabold text-sunset">{state.completedQuests.length}</p>
          <p className="text-sm text-slate-500">เควสสำเร็จ</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-extrabold text-lagoon">{state.badges.length}</p>
          <p className="text-sm text-slate-500">badge ที่ได้</p>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 px-1 font-extrabold text-deep">🏅 Achievements</h3>
        {state.badges.length === 0 ? (
          <Card className="text-center text-slate-400">
            ยังไม่มี badge — ไปทำเควสให้สำเร็จเพื่อปลดล็อก!
          </Card>
        ) : (
          <div className="space-y-3">
            {state.badges.map((b) => (
              <Card key={b.badge_title} className={`ring-2 ${RARITY_RING[b.rarity] || "ring-slate-200"}`}>
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-extrabold text-deep">{b.badge_title}</h4>
                  <Pill>{b.rarity}</Pill>
                </div>
                <p className="text-sm text-slate-600">{b.badge_description}</p>
                <p className="mt-1 text-sm italic text-sunset">“{b.flavor_text}”</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {auth?.user && (
        <Card className="flex items-center gap-3">
          {auth.user.photoURL && (
            <img src={auth.user.photoURL} alt="" className="h-10 w-10 rounded-full" />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-bold text-deep">{auth.user.displayName}</p>
            <p className="truncate text-xs text-slate-400">{auth.user.email}</p>
          </div>
        </Card>
      )}

      {auth?.enabled && (
        <button
          onClick={onLogout}
          className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-deep"
        >
          {auth.user ? "ออกจากระบบ" : "เข้าสู่ระบบด้วย Google"}
        </button>
      )}

      <button
        onClick={() => {
          if (confirm("ล้างความคืบหน้าทั้งหมด?")) reset();
        }}
        className="w-full py-2 text-sm text-slate-400 hover:text-rose-500"
      >
        รีเซ็ตความคืบหน้า
      </button>
    </div>
  );
}
