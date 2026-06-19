import { useMemo, useEffect } from "react";
import { sfxQuestComplete, sfxLevelUp } from "../lib/sfx";
import { Button, RarityBadge } from "./ui";
import { useT } from "../lib/i18n.jsx";
import { Zap, Gift } from "lucide-react";

const COLORS = ["#ff7a45", "#ffb020", "#0fb9b1", "#1b2a4a", "#f43f5e", "#8b5cf6"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.floor(Math.random() * 8),
        shape: Math.random() > 0.5 ? "rounded-sm" : "rounded-full",
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`confetti-piece ${p.shape}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size + 4}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RewardOverlay({ reward, onClose }) {
  const { t } = useT();
  const { xp, badge, levelUp, unlocked } = reward || {};

  useEffect(() => {
    if (!reward) return;
    if (levelUp) sfxLevelUp();
    else sfxQuestComplete();
  }, [reward]);

  if (!reward) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <Confetti />

      {/* Ambient glow ring */}
      <div
        className="pointer-events-none absolute inset-0 m-auto h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: levelUp ? "radial-gradient(circle, #ffb020, transparent 70%)" : "radial-gradient(circle, #ff7a45, transparent 70%)" }}
      />

      <div
        className="animate-reward-pop relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-[#0a1220] p-6 text-center shadow-[0_0_60px_rgba(255,176,32,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mango/60 to-transparent" />

        <div className="text-5xl">{levelUp ? "👑" : "🎉"}</div>
        <h2 className="mt-3 text-2xl font-extrabold text-white">
          {levelUp ? t("reward.levelUp") : t("reward.questDone")}
        </h2>

        {levelUp && (
          <>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              {t("reward.nowLevel", { level: levelUp })}
            </p>
            {unlocked?.length ? (
              <div className="mt-4 rounded-2xl border border-mango/25 bg-mango/10 p-4 text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mango">{t("reward.unlockedNew")}</p>
                <ul className="mt-2 space-y-1.5">
                  {unlocked.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Gift className="h-3.5 w-3.5 text-mango shrink-0" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

        {xp ? (
          <div className="animate-xp-float mt-4 inline-flex items-center gap-2 rounded-full border border-mango/30 bg-mango/15 px-5 py-2.5 text-2xl font-extrabold text-mango">
            <Zap className="h-5 w-5" fill="currentColor" />
            +{xp} XP
          </div>
        ) : null}

        {badge ? (
          <div className={`mt-4 rounded-2xl p-4 text-left ${
            badge.rarity === "Legendary" ? "rarity-legendary bg-[#1a0e00]" :
            badge.rarity === "Epic"      ? "rarity-epic bg-[#140e2a]" :
            badge.rarity === "Rare"      ? "rarity-rare bg-[#0d1e35]" :
                                           "rarity-common bg-[#0e1a2e]"
          }`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {t("reward.badgeUnlocked")}
              </p>
              <RarityBadge rarity={badge.rarity} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">{badge.badge_title}</h3>
              <span className="text-2xl">🏅</span>
            </div>
            <p className="text-sm text-slate-400">{badge.badge_description}</p>
            {badge.flavor_text ? (
              <p className="mt-1.5 text-sm italic text-sunset">"{badge.flavor_text}"</p>
            ) : null}
          </div>
        ) : null}

        <Button onClick={onClose} variant="game" className="mt-5 w-full">
          {t("reward.awesome")}
        </Button>

        {/* Bottom glow line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sunset/40 to-transparent" />
      </div>
    </div>
  );
}
