import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import { levelFor, todayStr } from "../lib/progress";
import { festivalForTrip } from "../lib/festivals";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
import QuestBanner from "../components/QuestBanner";
import { useT } from "../lib/i18n.jsx";
import {
  Sunrise,
  Flame,
  Compass,
  Target,
  Lightbulb,
  Award,
  Camera,
  LocateFixed,
  CheckCircle2,
  AlertCircle,
  X,
  Gift,
} from "lucide-react";

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// The model sometimes returns machine-y badge ids like "badge_ผู้ช่วยเทศกาล" —
// show (and forward) a clean human name instead.
function badgeLabel(name) {
  return String(name || "").replace(/^badge[_\s-]*/i, "").replace(/_/g, " ").trim();
}

export default function Quests({ progress }) {
  const { t, lang } = useT();
  const { state, update, completeQuest, issueDaily, addBadge, celebrate, updateReward } = progress;
  const quest = state.activeQuest;
  const [loading, setLoading] = useState(false);
  const [souvenirLoading, setSouvenirLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [festLoading, setFestLoading] = useState(false);
  const [error, setError] = useState("");

  const fest = festivalForTrip(state.preferences?.dateStart, state.preferences?.dateEnd);
  const festName = fest.festival ? (lang === "en" ? fest.festival.en : fest.festival.th) : "";

  const today = todayStr();
  const dailyDoneToday = state.daily.completedDate === today;

  // verification UI state
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [storyExpanded, setStoryExpanded] = useState(false);

  useEffect(() => {
    setStoryExpanded(false);
  }, [quest?.quest_name]);

  // Object URL for the attached-photo thumbnail; revoked when it changes or the
  // component unmounts so we don't leak blobs.
  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => photoUrl && URL.revokeObjectURL(photoUrl), [photoUrl]);

  function checkIn() {
    if (!navigator.geolocation || geoLoading) return;
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setError(t("quest.geoError"));
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const level = levelFor(state.xp).name;

  async function getQuest() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const q = await api.quest({
        user_location_area: "สงขลา",
        user_level: level,
        completed_quests: state.completedQuests,
      });
      update({ activeQuest: q });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Souvenir-hunt quest — steer the generator toward local crafts/gifts so
  // travellers spend at community shops (the creative-economy angle).
  async function getSouvenirQuest() {
    setSouvenirLoading(true);
    setError("");
    setResult(null);
    try {
      const q = await api.quest({
        user_location_area: "สงขลา",
        user_level: level,
        completed_quests: state.completedQuests,
        focus: "souvenir",
      });
      update({ activeQuest: q });
    } catch (e) {
      setError(e.message);
    } finally {
      setSouvenirLoading(false);
    }
  }

  async function getDaily() {
    setDailyLoading(true);
    setError("");
    setResult(null);
    try {
      const q = await api.quest({
        user_location_area: "สงขลา",
        user_level: level,
        completed_quests: state.completedQuests,
      });
      issueDaily(q);
    } catch (e) {
      setError(e.message);
    } finally {
      setDailyLoading(false);
    }
  }

  async function getFestivalQuest() {
    setFestLoading(true);
    setError("");
    setResult(null);
    try {
      const q = await api.quest({
        user_location_area: "สงขลา",
        user_level: level,
        completed_quests: state.completedQuests,
        festival: fest.festival.theme,
      });
      update({ activeQuest: q });
    } catch (e) {
      setError(e.message);
    } finally {
      setFestLoading(false);
    }
  }

  async function submit() {
    // A real photo from the location is required — text alone is too easy to
    // fake and punishes players who actually go.
    if (!desc.trim() || !photo || verifying) return;
    setVerifying(true);
    setError("");
    try {
      const photo_base64 = await fileToBase64(photo);
      const photo_media_type = photo.type || "image/jpeg";
      const userDescription = coords
        ? `${desc}\n\n📍 GPS check-in: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
        : desc;
      const res = await api.verify({
        quest_name: quest.quest_name,
        quest_objective: quest.objective,
        location_hint: quest.location_hint,
        user_description: userDescription,
        photo_base64,
        photo_media_type,
      });
      setResult(res);
      if (res.verified) {
        completeQuest(quest.quest_name, quest.reward_xp, { isDaily: !!quest.isDaily });
        celebrate({ xp: quest.reward_xp, badge: null });
        try {
          const badge = await api.badge({
            badge_name: badgeLabel(quest.reward_badge),
            quest_completed: quest.quest_name,
          });
          addBadge(badge);
          updateReward({ badge });
        } catch {
          /* badge is a bonus; ignore failures */
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  }

  function finishQuest() {
    update({ activeQuest: null });
    setDesc("");
    setPhoto(null);
    setResult(null);
    setCoords(null);
  }

  return (
    <div className="space-y-4 p-4 pb-6">
      <ErrorBox message={error} />

      {!quest && fest.festival && (
        <Card className="ring-1 ring-mango/40 dark:ring-mango/30">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mango/15 text-2xl">
              {fest.festival.emoji}
            </span>
            <div className="flex-1">
              <h3 className="font-bold text-deep dark:text-slate-100">
                {fest.active
                  ? t("fest.activeTitle", { name: festName })
                  : t("fest.soonTitle", { name: festName })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {fest.active
                  ? t("fest.activeDesc")
                  : t("fest.soonDesc", {
                      date: fest.date
                        ? fest.date.toLocaleDateString(lang === "en" ? "en-US" : "th-TH", {
                            day: "numeric",
                            month: "short",
                          })
                        : "",
                    })}
              </p>
            </div>
          </div>
          {/* Festival quests only while the festival is actually on — an
              upcoming banner stays informational (no off-season กินเจ quests). */}
          {fest.active && (
            <Button onClick={getFestivalQuest} disabled={festLoading} className="mt-3 w-full">
              {festLoading ? t("quest.rolling") : t("fest.getQuest")}
            </Button>
          )}
        </Card>
      )}

      {!quest && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mango/15 text-amber-600">
                <Sunrise className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-deep dark:text-slate-100">{t("daily.title")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("daily.subtitle")}</p>
              </div>
            </div>
            {state.daily.streak > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-sunset/10 px-2.5 py-1 text-xs font-bold text-sunset">
                <Flame className="h-3.5 w-3.5" />
                <span className="tnum">{state.daily.streak}</span>
              </span>
            )}
          </div>
          {dailyDoneToday ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm dark:bg-emerald-500/10">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-deep dark:text-slate-100">{t("daily.doneToday")}</p>
                <p className="text-slate-600 dark:text-slate-300">{t("daily.comeBack")}</p>
              </div>
            </div>
          ) : (
            <Button onClick={getDaily} disabled={dailyLoading} className="mt-3 w-full">
              {dailyLoading ? t("daily.rolling") : t("daily.get")}
            </Button>
          )}
        </Card>
      )}

      {!quest && (
        <Card className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sunset/10 text-sunset">
            <Compass className="h-7 w-7" />
          </span>
          <h2 className="mt-3 text-xl font-extrabold text-deep dark:text-slate-100">{t("quest.readyTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("quest.readyDesc")}</p>
          <Button variant="soft" onClick={getQuest} disabled={loading || souvenirLoading} className="mt-4 w-full">
            {loading ? t("quest.rolling") : t("quest.getNew")}
          </Button>
          <button
            onClick={getSouvenirQuest}
            disabled={loading || souvenirLoading}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-lagoon/30 bg-lagoon/5 px-5 py-3 font-bold text-lagoon transition duration-200 hover:bg-lagoon/10 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40 dark:border-lagoon/40 dark:bg-lagoon/10"
          >
            <Gift className="h-4 w-4" />
            {souvenirLoading ? t("quest.rolling") : t("quest.getSouvenir")}
          </button>
        </Card>
      )}

      {loading && quest === null && <Spinner label={t("quest.thinking")} />}

      {quest && (
        <Card className="space-y-3">
          <QuestBanner category={quest.category} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {quest.isDaily && (
                <Pill tone="sunset">
                  <span className="inline-flex items-center gap-1">
                    <Sunrise className="h-3 w-3" /> {t("daily.badge")}
                  </span>
                </Pill>
              )}
              <Pill>{quest.difficulty}</Pill>
            </div>
            <span className="tnum text-sm font-bold text-sunset">+{quest.reward_xp} XP</span>
          </div>
          <h2 className="text-xl font-extrabold leading-snug text-deep dark:text-slate-100">{quest.quest_name}</h2>
          <div>
            <p className={`italic text-slate-600 dark:text-slate-300 ${!storyExpanded ? "line-clamp-2" : ""}`}>
              {quest.quest_story}
            </p>
            {!storyExpanded && (
              <button
                onClick={() => setStoryExpanded(true)}
                className="mt-1 text-xs font-semibold text-lagoon hover:underline focus-visible:outline-none"
              >
                อ่านต่อ ▾
              </button>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
            <p className="flex items-center gap-1.5 font-bold text-deep dark:text-slate-100">
              <Target className="h-4 w-4 text-sunset" /> {t("quest.objective")}
            </p>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300">{quest.objective}</p>
          </div>
          <div className="rounded-xl bg-lagoon/5 p-3 text-sm dark:bg-lagoon/10">
            <p className="flex items-center gap-1.5 font-bold text-lagoon">
              <Lightbulb className="h-4 w-4" /> {t("quest.hint")}
            </p>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300">{quest.location_hint}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Award className="h-4 w-4 text-mango" />
            <span>{t("quest.reward")}</span>
            <span className="font-semibold text-deep dark:text-slate-200">{badgeLabel(quest.reward_badge)}</span>
          </div>

          {!result?.verified && (
            <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="font-bold text-deep dark:text-slate-100">{t("quest.doneQ")}</p>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                aria-label={t("quest.doneQ")}
                placeholder={t("quest.descPlaceholder")}
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-deep outline-none transition placeholder:text-slate-400 focus:border-sunset focus:ring-2 focus:ring-sunset/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {photo ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                  <img
                    src={photoUrl}
                    alt={photo.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <span className="flex-1 truncate text-sm text-slate-600 dark:text-slate-300">{photo.name}</span>
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    aria-label={t("quest.removePhoto")}
                    title={t("quest.removePhoto")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 font-semibold text-deep transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                    <Camera className="h-4 w-4" /> {t("quest.attachPhoto")}
                  </span>
                  <span className="truncate">{t("quest.photoRequired")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                </label>
              )}
              {(() => {
                const hasTarget = quest.target_lat && quest.target_lng;
                const km = coords && hasTarget
                  ? distanceKm(coords.lat, coords.lng, quest.target_lat, quest.target_lng)
                  : null;
                const nearby = km !== null && km < 0.3;
                return (
                  <>
                    <button
                      type="button"
                      onClick={checkIn}
                      disabled={geoLoading}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40 disabled:opacity-50 ${
                        nearby
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : coords
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
                            : "border-slate-200 text-slate-600 hover:border-lagoon hover:text-lagoon dark:border-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <LocateFixed className="h-4 w-4" />
                      {geoLoading ? t("quest.checkingIn") : t("quest.checkin")}
                    </button>
                    {coords && km !== null && (
                      <p className={`text-center text-sm font-semibold ${nearby ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {nearby
                          ? t("quest.nearby", { m: Math.round(km * 1000) })
                          : t("quest.tooFar", { km: km.toFixed(1) })}
                      </p>
                    )}
                    {coords && !hasTarget && (
                      <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">{t("quest.checkedIn")}</p>
                    )}
                  </>
                );
              })()}
              <Button variant="lagoon" onClick={submit} disabled={verifying || !desc.trim() || !photo} className="w-full">
                {verifying ? t("quest.verifying") : t("quest.submit")}
              </Button>
              {!photo && (
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">{t("quest.photoNudge")}</p>
              )}
            </div>
          )}

          {result && (
            <div
              className={`flex items-start gap-2.5 rounded-xl p-4 ${
                result.verified
                  ? "bg-emerald-50 dark:bg-emerald-500/10"
                  : "bg-amber-50 dark:bg-amber-500/10"
              }`}
            >
              {result.verified ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              )}
              <div className="flex-1">
                <p className="font-bold text-deep dark:text-slate-100">
                  {result.verified ? t("quest.success") : t("quest.almost")}{" "}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({t("quest.confidence")}: {result.confidence})
                  </span>
                </p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{result.message}</p>
                {!result.verified && result.feedback && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{result.feedback}</p>
                )}
                {result.verified && (
                  <Button onClick={finishQuest} className="mt-3 w-full">
                    {t("quest.next")}
                  </Button>
                )}
              </div>
            </div>
          )}

          {!result?.verified && (
            <button
              onClick={finishQuest}
              className="w-full rounded-xl py-1.5 text-sm text-slate-500 transition hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {t("quest.skip")}
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
