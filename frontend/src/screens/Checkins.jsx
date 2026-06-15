import { useEffect, useState, lazy, Suspense } from "react";
import { Button, ErrorBox, Spinner } from "../components/ui";
import { LANDMARKS } from "../lib/landmarks";
import { postCheckin, fetchCheckins } from "../lib/checkins";
import { getCurrentPosition, reverseGeocode } from "../lib/geo";
import { useT } from "../lib/i18n.jsx";
import { ArrowLeft, Camera, X, MapPin, LogIn, RefreshCw, LocateFixed, ChevronDown, Heart } from "lucide-react";

const CheckinMap = lazy(() => import("../components/CheckinMap"));

function downscaleImage(file, max = 320, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
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

function Avatar({ src, name, size = "h-10 w-10" }) {
  if (src) return <img src={src} alt="" className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white/10`} />;
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-lagoon/20 text-sm font-bold text-lagoon ring-2 ring-lagoon/20`}>
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}

export default function Checkins({ auth, onBack }) {
  const { t, lang } = useT();
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const [place, setPlace] = useState("");
  const [coords, setCoords] = useState(null);
  const [landmarkId, setLandmarkId] = useState("");
  const [gpsTagged, setGpsTagged] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setPosts(await fetchCheckins(50));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function useMyLocation() {
    if (locating) return;
    setLocating(true);
    setError("");
    try {
      const { lat, lng } = await getCurrentPosition();
      setCoords({ lat, lng });
      setGpsTagged(true);
      setLandmarkId("");
      const name = await reverseGeocode(lat, lng);
      if (name) setPlace(name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLocating(false);
    }
  }

  function pickLandmark(l) {
    setLandmarkId(l.id);
    setPlace(l.th);
    setCoords({ lat: l.lat, lng: l.lng });
    setGpsTagged(false);
  }

  function resetCompose() {
    setPlace(""); setCoords(null); setLandmarkId("");
    setGpsTagged(false); setMessage(""); setPhoto(null);
  }

  async function submit() {
    if (!place.trim() || posting) return;
    setPosting(true);
    setError("");
    try {
      const image = photo ? await downscaleImage(photo) : null;
      const ok = await postCheckin({
        user: auth.user,
        landmarkId: landmarkId || null,
        place: place.trim(),
        lat: coords?.lat,
        lng: coords?.lng,
        message: message.trim(),
        image,
      });
      if (!ok) {
        setError(t("checkin.failed"));
      } else {
        resetCompose();
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
      {/* Header */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 text-lg font-extrabold text-slate-900 dark:text-white">{t("checkin.title")}</h1>
        <button
          onClick={load}
          disabled={loading}
          aria-label={t("lb.refresh")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:hover:bg-white/8 dark:hover:text-slate-300 disabled:opacity-40"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Compose card — requires Google login */}
      {auth?.user ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-3 dark:border-white/10 dark:bg-[#0e1a2e]">
          <p className="font-bold text-slate-900 dark:text-white">{t("checkin.composeTitle")}</p>

          {/* GPS button */}
          <button
            onClick={useMyLocation}
            disabled={locating}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition ${
              locating
                ? "border border-lagoon/30 bg-lagoon/8 text-lagoon/60"
                : gpsTagged
                  ? "border border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
                  : "border border-lagoon/25 bg-lagoon/10 text-lagoon hover:bg-lagoon/18"
            } disabled:opacity-60`}
          >
            <LocateFixed className={`h-4 w-4 ${locating ? "animate-pulse" : ""}`} />
            {locating ? t("checkin.locating") : t("checkin.useLocation")}
          </button>

          {/* Place name input */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lagoon/60" />
            <input
              value={place}
              onChange={(e) => { setPlace(e.target.value); setLandmarkId(""); }}
              maxLength={80}
              aria-label={t("checkin.placePlaceholder")}
              placeholder={t("checkin.placePlaceholder")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lagoon/60 focus:ring-2 focus:ring-lagoon/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
          {gpsTagged && coords && (
            <p className="-mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <LocateFixed className="h-3 w-3 text-emerald-500" /> {t("checkin.gpsTagged")} · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          )}

          {/* Landmark picker */}
          <div>
            <button
              onClick={() => setShowLandmarks((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showLandmarks ? "rotate-180" : ""}`} />
              {t("checkin.orPickLandmark")}
            </button>
            {showLandmarks && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LANDMARKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => pickLandmark(l)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      landmarkId === l.id
                        ? "bg-lagoon text-white"
                        : "border border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                    }`}
                  >
                    {l.th}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            maxLength={140}
            aria-label={t("checkin.messagePlaceholder")}
            placeholder={t("checkin.messagePlaceholder")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lagoon/60 focus:ring-2 focus:ring-lagoon/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
          />

          {/* Photo */}
          {photo ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img src={URL.createObjectURL(photo)} alt="" className="h-36 w-full object-cover" />
              <button
                onClick={() => setPhoto(null)}
                aria-label={t("quest.removePhoto")}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <Camera className="h-4 w-4" /> {t("checkin.addPhoto")}
              </span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          )}

          <ErrorBox message={error} />
          <Button variant="game" onClick={submit} disabled={!place.trim() || posting} className="w-full">
            {posting ? t("checkin.posting") : t("checkin.post")}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-3xl border border-lagoon/20 bg-lagoon/8 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lagoon/20 text-lagoon">
            <LogIn className="h-5 w-5" />
          </span>
          <p className="flex-1 text-sm text-slate-500 dark:text-slate-400">{t("checkin.loginToPost")}</p>
          {auth?.enabled && (
            <Button onClick={auth.signInGoogle} variant="lagoon" className="!px-4 !py-2 text-sm">
              {t("ach.login")}
            </Button>
          )}
        </div>
      )}

      {/* Map */}
      {mapPoints.some((c) => typeof c.lat === "number") && (
        <Suspense fallback={<div className="h-[240px] animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-white/8 dark:bg-[#0e1a2e]" />}>
          <CheckinMap checkins={mapPoints} />
        </Suspense>
      )}

      {/* Feed */}
      {posts === null ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-4 dark:bg-[#0e1a2e] dark:border-white/8">
          <Spinner label={t("checkin.loading")} />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center text-sm text-slate-500 dark:bg-[#0e1a2e] dark:border-white/8">
          {t("checkin.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden dark:border-white/8 dark:bg-[#0e1525]">
              {/* Post header */}
              <div className="flex items-center gap-2.5 p-4 pb-3">
                <Avatar src={p.photoURL} name={p.displayName} />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{p.displayName}</p>
                  <p className="flex items-center gap-1 text-[11px] text-lagoon">
                    <MapPin className="h-3 w-3" /> {p.place}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-slate-500">{timeAgo(p.createdAt, lang)}</span>
              </div>

              {/* Message */}
              {p.message && (
                <p className="px-4 pb-3 text-sm text-slate-600 dark:text-slate-300">{p.message}</p>
              )}

              {/* Photo */}
              {p.image && (
                <img src={p.image} alt="" className="w-full object-cover max-h-56" />
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 px-4 py-2.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-lagoon/25 bg-lagoon/10 px-2.5 py-1 text-[11px] font-semibold text-lagoon">
                  <MapPin className="h-3 w-3" /> {p.place}
                </span>
                <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-600">
                  <Heart className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
