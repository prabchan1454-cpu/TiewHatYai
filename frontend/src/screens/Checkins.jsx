import { useEffect, useState, lazy, Suspense } from "react";
import { Button, Card, ErrorBox, Spinner } from "../components/ui";
import { LANDMARKS } from "../lib/landmarks";
import { postCheckin, fetchCheckins } from "../lib/checkins";
import { useT } from "../lib/i18n.jsx";
import { ArrowLeft, Camera, X, MapPin, LogIn, RefreshCw } from "lucide-react";

const CheckinMap = lazy(() => import("../components/CheckinMap"));

// Downscale a photo to a small JPEG data-URL so it fits in a Firestore doc
// (no paid Storage needed). ~320px / q0.6 ≈ tens of KB.
function downscaleImage(file, max = 320, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function timeAgo(ts, lang) {
  const d = ts?.seconds ? new Date(ts.seconds * 1000) : ts instanceof Date ? ts : null;
  if (!d) return lang === "en" ? "just now" : "เมื่อสักครู่";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return lang === "en" ? "just now" : "เมื่อสักครู่";
  const m = Math.floor(s / 60);
  if (m < 60) return lang === "en" ? `${m}m ago` : `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "en" ? `${h}h ago` : `${h} ชม.ที่แล้ว`;
  const days = Math.floor(h / 24);
  return lang === "en" ? `${days}d ago` : `${days} วันที่แล้ว`;
}

function Avatar({ src, name }) {
  if (src) return <img src={src} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />;
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}

export default function Checkins({ auth, onBack }) {
  const { t, lang } = useT();
  const [posts, setPosts] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  const [landmarkId, setLandmarkId] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setPosts(await fetchCheckins(50));
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!landmarkId || posting) return;
    setPosting(true);
    setError("");
    try {
      const lm = LANDMARKS.find((l) => l.id === landmarkId);
      const image = photo ? await downscaleImage(photo) : null;
      const ok = await postCheckin({
        user: auth.user,
        landmarkId,
        place: lm?.th || "",
        lat: lm?.lat,
        lng: lm?.lng,
        message: message.trim(),
        image,
      });
      if (!ok) {
        setError(t("checkin.failed"));
      } else {
        setLandmarkId("");
        setMessage("");
        setPhoto(null);
        await load();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPosting(false);
    }
  }

  const mapPoints = posts || [];

  return (
    <div className="space-y-4 p-4 pb-6">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full text-deep hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 text-lg font-extrabold text-deep dark:text-slate-100">{t("checkin.title")}</h1>
        <button onClick={load} disabled={loading} aria-label={t("lb.refresh")} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-deep disabled:opacity-50 dark:hover:bg-slate-800">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Compose — requires Google login (real identity for the feed) */}
      {auth?.user ? (
        <Card className="space-y-3">
          <p className="font-bold text-deep dark:text-slate-100">{t("checkin.composeTitle")}</p>
          <div className="flex flex-wrap gap-1.5">
            {LANDMARKS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLandmarkId(l.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  landmarkId === l.id
                    ? "bg-lagoon text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {l.th}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            maxLength={140}
            aria-label={t("checkin.messagePlaceholder")}
            placeholder={t("checkin.messagePlaceholder")}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-deep outline-none transition placeholder:text-slate-400 focus:border-lagoon focus:ring-2 focus:ring-lagoon/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {photo ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
              <img src={URL.createObjectURL(photo)} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <span className="flex-1 truncate text-sm text-slate-600 dark:text-slate-300">{photo.name}</span>
              <button onClick={() => setPhoto(null)} aria-label={t("quest.removePhoto")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-deep dark:bg-slate-800 dark:text-slate-100">
                <Camera className="h-4 w-4" /> {t("checkin.addPhoto")}
              </span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          )}
          <ErrorBox message={error} />
          <Button variant="lagoon" onClick={submit} disabled={!landmarkId || posting} className="w-full">
            {posting ? t("checkin.posting") : t("checkin.post")}
          </Button>
        </Card>
      ) : (
        <Card className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
            <LogIn className="h-5 w-5" />
          </span>
          <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{t("checkin.loginToPost")}</p>
          {auth?.enabled && (
            <Button onClick={auth.signInGoogle} variant="soft" className="!px-4 !py-2 text-sm">
              {t("ach.login")}
            </Button>
          )}
        </Card>
      )}

      {/* Shared map of everyone's check-ins */}
      {mapPoints.some((c) => typeof c.lat === "number") && (
        <Suspense fallback={<div className="h-[240px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />}>
          <CheckinMap checkins={mapPoints} />
        </Suspense>
      )}

      {/* Feed */}
      {posts === null ? (
        <Card><Spinner label={t("checkin.loading")} /></Card>
      ) : posts.length === 0 ? (
        <Card className="text-center text-sm text-slate-500 dark:text-slate-400">{t("checkin.empty")}</Card>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <Card key={p.id} className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Avatar src={p.photoURL} name={p.displayName} />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold text-deep dark:text-slate-100">{p.displayName}</p>
                  <p className="flex items-center gap-1 text-xs text-lagoon">
                    <MapPin className="h-3 w-3" /> {p.place}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(p.createdAt, lang)}</span>
              </div>
              {p.message && <p className="text-sm text-slate-700 dark:text-slate-200">{p.message}</p>}
              {p.image && <img src={p.image} alt="" className="w-full rounded-xl object-cover" />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
