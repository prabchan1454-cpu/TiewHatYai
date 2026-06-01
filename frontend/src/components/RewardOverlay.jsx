import { useMemo } from "react";
import { Button } from "./ui";

const COLORS = ["#ff7a45", "#ffb020", "#0fb9b1", "#1b2a4a", "#f43f5e", "#8b5cf6"];

const RARITY_RING = {
  Common: "ring-slate-200",
  Rare: "ring-sky-300",
  Epic: "ring-violet-300",
  Legendary: "ring-amber-300",
};

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RewardOverlay({ reward, onClose }) {
  if (!reward) return null;
  const { xp, badge } = reward;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <Confetti />
      <div
        className="animate-reward-pop relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl">🎉</div>
        <h2 className="mt-2 text-2xl font-extrabold text-deep">เควสสำเร็จ!</h2>

        {xp ? (
          <div className="animate-xp-float mt-3 inline-block rounded-full bg-mango/20 px-5 py-2 text-2xl font-extrabold text-sunset">
            +{xp} XP ⚡
          </div>
        ) : null}

        {badge ? (
          <div
            className={`mt-4 rounded-2xl bg-slate-50 p-4 text-left ring-2 ${
              RARITY_RING[badge.rarity] || "ring-slate-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              ปลดล็อก Badge ใหม่
            </p>
            <div className="mt-1 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-deep">{badge.badge_title}</h3>
              <span className="text-2xl">🏅</span>
            </div>
            <p className="text-sm text-slate-600">{badge.badge_description}</p>
            {badge.flavor_text ? (
              <p className="mt-1 text-sm italic text-sunset">“{badge.flavor_text}”</p>
            ) : null}
          </div>
        ) : null}

        <Button onClick={onClose} className="mt-5 w-full">
          เยี่ยมเลย! 🚀
        </Button>
      </div>
    </div>
  );
}
