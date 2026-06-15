import { useState, lazy, Suspense } from "react";
import { api } from "../lib/api";
import { Button, ErrorBox } from "../components/ui";
const StampMap = lazy(() => import("../components/StampMap"));
import { LANDMARKS, DISTRICTS, STAMP_XP } from "../lib/landmarks";
import { coverGradient } from "../lib/unlocks";
import { useT } from "../lib/i18n.jsx";
import { ArrowLeft, Check, Camera, X, MapPin, Store, Lock } from "lucide-react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function CollectModal({ landmark, onClose, onCollected }) {
  const { t, lang } = useT();
  const [photo, setPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!photo || verifying) return;
    setVerifying(true);
    setError("");
    try {
      const photo_base64 = await fileToBase64(photo);
      const res = await api.verify({
        quest_name: landmark[lang === "en" ? "en" : "th"],
        quest_objective: `ถ่ายรูปที่ ${landmark.th} (${landmark.en})`,
        location_hint: landmark.hint,
        user_description: `เก็บดวงตราพาสปอร์ต: ${landmark.th}`,
        photo_base64,
        photo_media_type: photo.type || "image/jpeg",
      });
      if (res.verified) {
        onCollected(landmark, res);
      } else {
        setError(res.message || t("passport.retake"));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl animate-slide-up dark:border-white/15 dark:bg-[#0e1a2e] dark:shadow-[0_0_40px_rgba(15,185,177,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lagoon/50 to-transparent" />

        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lagoon/20 text-lagoon">
            <landmark.Icon className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white">{landmark.th}</h3>
            <p className="text-xs text-slate-400">{landmark.hint}</p>
          </div>
          <button onClick={onClose} aria-label="close" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ErrorBox message={error} />

        <div className="mt-4">
          {photo ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
              <img src={URL.createObjectURL(photo)} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <span className="flex-1 truncate text-sm text-slate-400">{photo.name}</span>
              <button onClick={() => setPhoto(null)} aria-label={t("quest.removePhoto")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 py-5 text-sm font-semibold text-slate-500 transition hover:border-lagoon/40 hover:text-lagoon">
              <Camera className="h-5 w-5" /> {t("passport.collect")}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        <Button variant="game" onClick={submit} disabled={!photo || verifying} className="mt-3 w-full">
          {verifying ? t("passport.verifying") : t("passport.collect")}
        </Button>
      </div>
    </div>
  );
}

function Stamp({ landmark, collected, onClick, t }) {
  return (
    <button
      onClick={onClick}
      disabled={collected}
      className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center transition duration-200 ${
        collected
          ? "border-mango/40 bg-gradient-to-br from-mango/20 to-sunset/10 shadow-[0_0_12px_rgba(255,176,32,0.2)]"
          : "border-slate-200 bg-slate-100/70 opacity-60 hover:opacity-90 active:scale-95 dark:border-white/10 dark:bg-[#0e1a2e]/70"
      }`}
    >
      {/* Lock overlay for uncollected */}
      {!collected && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
          <Lock className="h-2.5 w-2.5 text-slate-500" />
        </span>
      )}
      <landmark.Icon
        className={`h-7 w-7 ${collected ? "text-mango" : "text-slate-600"}`}
        strokeWidth={2}
      />
      <span className={`text-[10px] font-bold leading-tight ${collected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-600"}`}>
        {landmark.th}
      </span>
      {landmark.community && (
        <span className="mt-0.5 inline-flex items-center gap-0.5 rounded-full border border-lagoon/30 bg-lagoon/15 px-1.5 text-[9px] font-bold text-lagoon">
          <Store className="h-2.5 w-2.5" /> {t("passport.community")}
        </span>
      )}
      {collected && (
        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mango text-deep shadow-[0_0_8px_rgba(255,176,32,0.5)]">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

export default function Passport({ progress, onBack }) {
  const { t } = useT();
  const { state, collectStamp, celebrate } = progress;
  const [selected, setSelected] = useState(null);

  const collectedIds = new Set((state.collectedStamps || []).map((s) => s.id));
  const done = collectedIds.size;
  const total = LANDMARKS.length;
  const pct = Math.round((done / total) * 100);

  function handleCollected(landmark) {
    collectStamp(landmark.id, STAMP_XP);
    setSelected(null);
    celebrate({ xp: STAMP_XP, badge: null });
  }

  return (
    <div className="space-y-4 p-4 pb-6">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("passport.title")}</h1>
      </div>

      {/* Hero progress card */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${coverGradient(state.cosmetics?.cover)} p-5 shadow-hero`}>
        {/* Compass rose texture */}
        <svg className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-10 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="44" />
          <circle cx="50" cy="50" r="28" />
          <polygon points="50,8 55,38 50,44 45,38" fill="white" stroke="none" opacity="0.8" />
          <polygon points="50,92 55,62 50,56 45,62" fill="white" stroke="none" opacity="0.5" />
          <polygon points="8,50 38,45 44,50 38,55" fill="white" stroke="none" opacity="0.5" />
          <polygon points="92,50 62,45 56,50 62,55" fill="white" stroke="none" opacity="0.5" />
        </svg>

        <div className="flex items-end gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-deep/60">
              <MapPin className="h-3.5 w-3.5" /> {t("passport.tagline")}
            </p>
            <p className="mt-2 text-5xl font-extrabold tracking-tight text-deep tnum">{done}</p>
            <p className="text-sm font-bold text-deep/60">/ {total} stamps</p>
          </div>
          {/* Circular progress ring */}
          <div className="ml-auto">
            <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="rgba(27,42,74,0.7)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <p className="text-center text-xs font-extrabold text-deep/60 -mt-1 tnum">{pct}%</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-deep/15">
          <div className="h-full rounded-full bg-deep/60 transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        {done === total && <p className="mt-2 text-sm font-bold text-deep/80">{t("passport.complete")}</p>}
      </div>

      {/* Map */}
      <Suspense fallback={<div className="h-[260px] animate-pulse rounded-3xl bg-slate-100 border border-slate-200 dark:bg-[#0e1a2e] dark:border-white/10" />}>
        <StampMap collectedIds={collectedIds} onSelect={setSelected} />
      </Suspense>

      {/* Stamps grouped by district */}
      {DISTRICTS.map((district) => {
        const items = LANDMARKS.filter((l) => l.district === district);
        if (!items.length) return null;
        const districtDone = items.filter((l) => collectedIds.has(l.id)).length;
        return (
          <section key={district}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-mango">{district}</h2>
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[11px] text-slate-500 tnum">{districtDone}/{items.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {items.map((l) => (
                <Stamp key={l.id} landmark={l} collected={collectedIds.has(l.id)} onClick={() => setSelected(l)} t={t} />
              ))}
            </div>
          </section>
        );
      })}

      {selected && (
        <CollectModal landmark={selected} onClose={() => setSelected(null)} onCollected={handleCollected} />
      )}
    </div>
  );
}
