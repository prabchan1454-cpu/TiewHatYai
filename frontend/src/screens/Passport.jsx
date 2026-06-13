import { useState, lazy, Suspense } from "react";
import { api } from "../lib/api";
import { Button, ErrorBox } from "../components/ui";
// Leaflet is heavy — load the stamp map only when the passport is open.
const StampMap = lazy(() => import("../components/StampMap"));
import { LANDMARKS, DISTRICTS, STAMP_XP } from "../lib/landmarks";
import { useT } from "../lib/i18n.jsx";
import { ArrowLeft, Check, Camera, X, MapPin, Store } from "lucide-react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Modal: take/upload a photo, AI verifies it matches the landmark, stamp earned.
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-hero animate-slide-up dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mango/15 text-amber-600">
            <landmark.Icon className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <h3 className="font-bold text-deep dark:text-slate-100">{landmark.th}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{landmark.hint}</p>
          </div>
          <button onClick={onClose} aria-label="close" className="text-slate-400 hover:text-deep dark:hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <ErrorBox message={error} />

        <div className="mt-4">
          {photo ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
              <img src={URL.createObjectURL(photo)} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <span className="flex-1 truncate text-sm text-slate-600 dark:text-slate-300">{photo.name}</span>
              <button onClick={() => setPhoto(null)} aria-label={t("quest.removePhoto")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-semibold text-slate-500 transition hover:border-sunset hover:text-sunset dark:border-slate-700 dark:text-slate-400">
              <Camera className="h-5 w-5" /> {t("passport.collect")}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        <Button variant="lagoon" onClick={submit} disabled={!photo || verifying} className="mt-3 w-full">
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
          ? "border-mango/40 bg-mango/10 dark:border-mango/30 dark:bg-mango/10"
          : "border-slate-100 bg-white shadow-card hover:shadow-lift active:scale-95 dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <landmark.Icon
        className={`h-8 w-8 ${collected ? "text-sunset" : "text-slate-300 dark:text-slate-600"}`}
        strokeWidth={2}
      />
      <span className={`text-[11px] font-bold leading-tight ${collected ? "text-deep dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
        {landmark.th}
      </span>
      {landmark.community && (
        <span className="mt-0.5 inline-flex items-center gap-0.5 rounded-full bg-lagoon/15 px-1.5 text-[9px] font-bold text-lagoon">
          <Store className="h-2.5 w-2.5" /> {t("passport.community")}
        </span>
      )}
      {collected && (
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-mango text-deep shadow">
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
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full text-deep hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-extrabold text-deep dark:text-slate-100">{t("passport.title")}</h1>
      </div>

      {/* Progress hero */}
      <div className="rounded-3xl bg-gradient-to-br from-sunset to-mango p-5 text-deep shadow-hero">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          <MapPin className="h-4 w-4" /> {t("passport.tagline")}
        </p>
        <p className="mt-3 text-3xl font-extrabold tnum">{done}/{total}</p>
        <p className="text-xs font-semibold opacity-80">{t("passport.progress", { done, total })}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-deep/15">
          <div className="h-full rounded-full bg-deep transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {done === total && <p className="mt-3 text-sm font-bold">{t("passport.complete")}</p>}
      </div>

      {/* Map of all stamps across the province — tap a pin to collect */}
      <Suspense fallback={<div className="h-[260px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />}>
        <StampMap collectedIds={collectedIds} onSelect={setSelected} />
      </Suspense>

      {/* Stamps grouped by district */}
      {DISTRICTS.map((district) => {
        const items = LANDMARKS.filter((l) => l.district === district);
        if (!items.length) return null;
        return (
          <section key={district}>
            <h2 className="mb-2 px-1 text-sm font-bold text-deep dark:text-slate-100">{district}</h2>
            <div className="grid grid-cols-3 gap-2.5">
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
