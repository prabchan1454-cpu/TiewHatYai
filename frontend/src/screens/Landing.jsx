import { Button, LangToggle, ThemeToggle } from "../components/ui";
import Mascot from "../components/Mascot";
import WovenBand from "../components/WovenBand";
import { useT } from "../lib/i18n.jsx";
import { MessageCircle, Compass, Sparkles, Trophy, MapPin } from "lucide-react";

// Feature ribbon — a row of capability chips (not a boxed card grid).
const FEATURES = [
  { Icon: MessageCircle, key: "chat", tone: "lagoon" },
  { Icon: Compass, key: "quest", tone: "sunset" },
  { Icon: Sparkles, key: "places", tone: "mango" },
  { Icon: Trophy, key: "rewards", tone: "sunset" },
];

const CHIP_TONE = {
  lagoon: "text-lae-deep dark:text-lae",
  sunset: "text-boat",
  mango: "text-gold",
};

export default function Landing({ onStart }) {
  const { t } = useT();

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-[linear-gradient(to_bottom,#F6F1E6_0%,#F1E7CE_30%,#BFD8CC_66%,#5FA597_100%)] text-ink dark:bg-[linear-gradient(to_bottom,#14241F_0%,#173029_45%,#1F5D58_100%)] dark:text-white">
      {/* ---- Golden-hour sun over the Samila shore ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full opacity-80 blur-2xl motion-reduce:animate-none animate-glow-pulse"
        style={{ background: "radial-gradient(circle, rgba(230,190,99,0.85) 0%, rgba(230,190,99,0) 70%)" }}
      />
      {/* drifting sea-spray motes */}
      <div aria-hidden className="pointer-events-none absolute left-8 top-32 h-3 w-3 rounded-full bg-white/40 motion-reduce:animate-none animate-bob" style={{ animationDelay: "0.4s" }} />
      <div aria-hidden className="pointer-events-none absolute right-10 top-24 h-2 w-2 rounded-full bg-white/50 motion-reduce:animate-none animate-bob" style={{ animationDelay: "1.1s" }} />
      <div aria-hidden className="pointer-events-none absolute right-16 top-48 h-4 w-4 rounded-full bg-white/25 motion-reduce:animate-none animate-bob" style={{ animationDelay: "0.7s" }} />

      {/* ---- Top bar ---- */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-7">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-deep/70 dark:text-white/60">
          Travel&nbsp;Songkhla
        </span>
        <div className="flex gap-2">
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>

      {/* Ko Yo woven trim — signature, lands on the very first screen */}
      <div className="relative z-10 mt-3 px-6">
        <WovenBand className="h-1.5" rounded />
      </div>

      {/* ---- Hero ---- */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pb-2 text-center">
        {/* Mascot — Samila's golden mermaid — on a glowing tide disc */}
        <div className="relative mt-1 animate-fade-in">
          <span aria-hidden className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-2xl dark:bg-mango/20" />
          <span aria-hidden className="absolute left-1/2 top-[58%] h-12 w-40 -translate-x-1/2 rounded-[100%] bg-deep/10 blur-md dark:bg-black/40" />
          <Mascot size={140} float interactive className="relative drop-shadow-[0_12px_20px_rgba(27,42,74,0.28)]" />
        </div>

        <h1 className="font-display mt-3 animate-slide-up text-[2.9rem] leading-none" style={{ animationDelay: "90ms" }}>
          {t("app.title")}
        </h1>
        <span aria-hidden className="mt-3 h-1.5 w-12 animate-slide-up rounded-full bg-gold dark:bg-gold/80" style={{ animationDelay: "120ms" }} />
        <p className="mt-3 max-w-[18rem] animate-slide-up text-[15px] font-medium leading-relaxed text-deep/80 dark:text-white/75" style={{ animationDelay: "150ms" }}>
          {t("landing.subtitle")}
        </p>

        {/* Feature ribbon — capability chips */}
        <div className="mt-5 flex max-w-[20rem] flex-wrap justify-center gap-2">
          {FEATURES.map((f, i) => (
            <span
              key={f.key}
              className="flex animate-slide-up items-center gap-1.5 rounded-full bg-white py-1.5 pl-2 pr-3.5 text-[13px] font-bold text-deep shadow-lift ring-1 ring-deep/10 dark:bg-white/10 dark:text-white dark:ring-white/10"
              style={{ animationDelay: `${190 + i * 60}ms` }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mango/15 dark:bg-white/10">
                <f.Icon className={`h-3.5 w-3.5 ${CHIP_TONE[f.tone]}`} strokeWidth={2.6} />
              </span>
              {t(`landing.feat.${f.key}.title`)}
            </span>
          ))}
        </div>

        {/* Passport-stamp motif — the signature collectible loop */}
        <div className="mt-5 flex animate-slide-up flex-col items-center gap-2" style={{ animationDelay: "470ms" }}>
          <div className="flex items-center -space-x-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-deep/35 bg-white/70 shadow-card dark:border-mango/45 dark:bg-white/10"
                style={{ transform: `rotate(${(i - 1.5) * 7}deg)` }}
              >
                <MapPin className="h-4 w-4 text-sunset" strokeWidth={2.6} fill={i < 2 ? "currentColor" : "none"} />
              </span>
            ))}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mango/90 text-sm font-extrabold text-deep shadow-lift ring-2 ring-white/70 dark:ring-white/15" style={{ transform: "rotate(10deg)" }}>
              +20
            </span>
          </div>
          <p className="text-[12px] font-semibold text-deep/65 dark:text-white/65">{t("landing.stamps")}</p>
        </div>
      </div>

      {/* ---- Beach-foam shore + CTA ---- */}
      <div className="relative z-10 mt-4">
        {/* lagoon tide line just above the foam */}
        <svg viewBox="0 0 390 56" preserveAspectRatio="none" className="block h-10 w-full -mb-px" aria-hidden>
          <path d="M0,34 C70,10 130,10 200,30 C265,48 330,48 390,26 L390,56 L0,56 Z" fill="#2C7A74" opacity="0.4" />
          <path d="M0,40 C70,18 130,18 200,36 C265,52 330,52 390,32 L390,56 L0,56 Z" className="fill-white dark:fill-[#0e1525]" />
        </svg>
        <div className="bg-white px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 dark:bg-[#0e1525]">
          <Button
            onClick={onStart}
            variant="game"
            className="w-full animate-slide-up py-4 text-lg"
            style={{ animationDelay: "560ms" }}
          >
            {t("landing.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
