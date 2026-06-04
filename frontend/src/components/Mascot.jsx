import { useState, useEffect, lazy, Suspense } from "react";
import { useT } from "../lib/i18n.jsx";

// น้องเที่ยว, the app mascot (Songkhla's golden mermaid).
//  - If a rigged Rive file exists at /mascot.riv → play it (Duolingo-style).
//  - Otherwise fall back to the Canva PNG with CSS idle/wiggle motion.
const SRC = "/mascot.png";
const RIVE_SRC = "/mascot.riv";
const RiveMascot = lazy(() => import("./RiveMascot"));

// One-time memoized check for the optional Rive asset so dropping mascot.riv
// into public/ "just works" with no code change (and no cost when it's absent).
let riveCheck;
function isRiveAvailable() {
  if (!riveCheck) {
    riveCheck = fetch(RIVE_SRC, { method: "HEAD" })
      .then((r) => r.ok && (r.headers.get("content-type") || "").indexOf("html") === -1)
      .catch(() => false);
  }
  return riveCheck;
}

// Props:
//  - float:       gentle "swimming" idle animation (PNG fallback only)
//  - interactive: tap/click makes the mascot react (wiggle for PNG, fire "tap" for Rive)
export default function Mascot({ size = 72, className = "", float = false, interactive = false }) {
  const { t } = useT();
  const [poke, setPoke] = useState(false);
  const [useRiveFile, setUseRiveFile] = useState(false);

  useEffect(() => {
    let alive = true;
    isRiveAvailable().then((ok) => alive && ok && setUseRiveFile(true));
    return () => {
      alive = false;
    };
  }, []);

  const anim = poke ? "animate-mascot-wiggle" : float ? "animate-mascot-idle" : "";
  const png = (
    <img
      src={SRC}
      alt={t("mascot.alt")}
      width={size}
      height={size}
      draggable={false}
      onAnimationEnd={() => poke && setPoke(false)}
      className={`select-none object-contain ${anim} ${className}`}
      style={{ width: size, height: size }}
    />
  );

  if (useRiveFile) {
    return (
      <Suspense fallback={png}>
        <RiveMascot
          size={size}
          className={className}
          interactive={interactive}
          onUnavailable={() => setUseRiveFile(false)}
        />
      </Suspense>
    );
  }

  if (!interactive) return png;

  return (
    <button
      type="button"
      aria-label={t("mascot.alt")}
      onClick={() => setPoke(true)}
      className="cursor-pointer rounded-full border-0 bg-transparent p-0 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50"
    >
      {png}
    </button>
  );
}
