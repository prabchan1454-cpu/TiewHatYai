import { Button, LangToggle, ThemeToggle } from "../components/ui";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";
import { MessageCircle, Compass, Sparkles, Trophy } from "lucide-react";

const FEATURES = [
  { Icon: MessageCircle, key: "chat" },
  { Icon: Compass, key: "quest" },
  { Icon: Sparkles, key: "places" },
  { Icon: Trophy, key: "rewards" },
];

export default function Landing({ onStart }) {
  const { t } = useT();
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-gradient-to-b from-sunset via-[#ff9442] to-mango text-deep">
      {/* Atmosphere: a soft sunrise glow + a stage disc behind น้องเที่ยว, and a
          couple of drifting "sea bubbles" — the one warm, local delight moment. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full opacity-90 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(255,231,168,0.95) 0%, rgba(255,231,168,0) 70%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute left-8 top-32 h-3 w-3 rounded-full bg-white/40 animate-bob" style={{ animationDelay: "0.4s" }} />
      <div aria-hidden className="pointer-events-none absolute right-10 top-24 h-2 w-2 rounded-full bg-white/50 animate-bob" style={{ animationDelay: "1.1s" }} />
      <div aria-hidden className="pointer-events-none absolute right-16 top-48 h-4 w-4 rounded-full bg-white/25 animate-bob" style={{ animationDelay: "0.7s" }} />

      {/* Top bar */}
      <div className="relative z-10 flex justify-end gap-2 px-6 pt-7">
        <ThemeToggle />
        <LangToggle />
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pb-4 text-center">
        <div className="relative mt-1 animate-fade-in">
          {/* Soft blurred halo (no hard edge) so the mascot pops without looking
              like a transparent disc on the gradient. */}
          <span aria-hidden className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-2xl" />
          <Mascot size={148} float className="relative drop-shadow-[0_10px_18px_rgba(27,42,74,0.22)]" />
        </div>

        <p className="mt-2 animate-slide-up text-[11px] font-extrabold uppercase tracking-[0.32em] text-deep/55" style={{ animationDelay: "40ms" }}>
          Travel&nbsp;Songkhla
        </p>
        <h1 className="mt-0.5 animate-slide-up text-[2.7rem] font-extrabold leading-none tracking-tight" style={{ animationDelay: "90ms" }}>
          {t("app.title")}
        </h1>
        <span aria-hidden className="mt-2.5 h-1.5 w-12 animate-slide-up rounded-full bg-deep/30" style={{ animationDelay: "120ms" }} />
        <p className="mt-3 max-w-[17rem] animate-slide-up text-[15px] font-medium leading-relaxed text-deep/75" style={{ animationDelay: "150ms" }}>
          {t("landing.subtitle")}
        </p>

        {/* Feature cards */}
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.key}
              className="animate-slide-up rounded-2xl bg-white/95 p-4 text-left shadow-lift ring-1 ring-white/70"
              style={{ animationDelay: `${190 + i * 70}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mango/20">
                <f.Icon className="h-5 w-5 text-sunset" strokeWidth={2.4} />
              </span>
              <p className="mt-2.5 font-bold text-deep">{t(`landing.feat.${f.key}.title`)}</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-600">{t(`landing.feat.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beach-foam footer — the CTA rests on a white "shore" wave */}
      <div className="relative z-10 mt-6">
        <svg viewBox="0 0 390 48" preserveAspectRatio="none" className="block h-9 w-full" aria-hidden>
          <path d="M0,30 C70,6 130,6 200,26 C265,44 330,44 390,22 L390,48 L0,48 Z" fill="#ffffff" />
        </svg>
        <div className="bg-white px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-1">
          <Button
            onClick={onStart}
            variant="primary"
            className="w-full animate-slide-up py-4 text-lg"
            style={{ animationDelay: "470ms" }}
          >
            {t("landing.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
