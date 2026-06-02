import { useState } from "react";
import { api } from "../lib/api";
import { levelFor, todayStr } from "../lib/progress";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

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

export default function Quests({ progress }) {
  const { t } = useT();
  const { state, update, completeQuest, issueDaily, addBadge, celebrate, updateReward } = progress;
  const quest = state.activeQuest;
  const [loading, setLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [error, setError] = useState("");

  const today = todayStr();
  const dailyDoneToday = state.daily.completedDate === today;

  // verification UI state
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

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
        user_location_area: "หาดใหญ่",
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

  async function getDaily() {
    setDailyLoading(true);
    setError("");
    setResult(null);
    try {
      const q = await api.quest({
        user_location_area: "หาดใหญ่",
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

  async function submit() {
    if (!desc.trim() || verifying) return;
    setVerifying(true);
    setError("");
    try {
      let photo_base64 = null;
      let photo_media_type = "image/jpeg";
      if (photo) {
        photo_base64 = await fileToBase64(photo);
        photo_media_type = photo.type || "image/jpeg";
      }
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
            badge_name: quest.reward_badge,
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
    <div className="space-y-4 px-4 py-4">
      <ErrorBox message={error} />

      {!quest?.isDaily && (
        <Card className="bg-gradient-to-br from-mango/20 to-sunset/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-deep">🌅 {t("daily.title")}</h3>
              <p className="text-sm text-slate-500">{t("daily.subtitle")}</p>
            </div>
            <span className="text-sm font-bold text-sunset">
              {state.daily.streak > 0
                ? t("daily.streak", { n: state.daily.streak })
                : ""}
            </span>
          </div>
          {dailyDoneToday ? (
            <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm">
              <p className="font-bold text-deep">{t("daily.doneToday")}</p>
              <p className="text-slate-500">{t("daily.comeBack")}</p>
            </div>
          ) : (
            <Button onClick={getDaily} disabled={dailyLoading} className="mt-3 w-full">
              {dailyLoading ? t("daily.rolling") : t("daily.get")}
            </Button>
          )}
        </Card>
      )}

      {!quest && (
        <Card className="bg-gradient-to-br from-sunset/15 to-mango/10 text-center">
          <div className="text-5xl">🎯</div>
          <h2 className="mt-2 text-xl font-extrabold text-deep">{t("quest.readyTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("quest.readyDesc")}</p>
          <Button onClick={getQuest} disabled={loading} className="mt-4 w-full">
            {loading ? t("quest.rolling") : t("quest.getNew")}
          </Button>
        </Card>
      )}

      {loading && quest === null && <Spinner label={t("quest.thinking")} />}

      {quest && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {quest.isDaily && <Pill tone="sunset">🌅 {t("daily.badge")}</Pill>}
              <Pill>{quest.difficulty}</Pill>
            </div>
            <span className="text-sm font-bold text-sunset">+{quest.reward_xp} XP</span>
          </div>
          <h2 className="text-xl font-extrabold text-deep">{quest.quest_name}</h2>
          <p className="italic text-slate-600">{quest.quest_story}</p>

          <div className="rounded-2xl bg-slate-50 p-3 text-sm">
            <p className="font-bold text-deep">{t("quest.objective")}</p>
            <p className="text-slate-600">{quest.objective}</p>
          </div>
          <div className="rounded-2xl bg-teal-50 p-3 text-sm">
            <p className="font-bold text-lagoon">{t("quest.hint")}</p>
            <p className="text-slate-600">{quest.location_hint}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{t("quest.reward")}</span>
            <span className="font-semibold text-deep">{quest.reward_badge}</span>
          </div>

          {!result?.verified && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="font-bold text-deep">{t("quest.doneQ")}</p>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={t("quest.descPlaceholder")}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 p-3 text-deep outline-none transition placeholder:text-slate-400 focus:border-sunset focus:ring-2 focus:ring-sunset/30"
              />
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 focus-within:[&>span:first-child]:ring-2 focus-within:[&>span:first-child]:ring-sunset/40">
                <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-deep transition hover:bg-slate-200">{t("quest.attachPhoto")}</span>
                <span>{photo ? photo.name : t("quest.optional")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
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
                      className={`w-full rounded-2xl border px-3 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40 disabled:opacity-50 ${
                        nearby
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : coords
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 text-slate-600 hover:border-lagoon hover:text-lagoon"
                      }`}
                    >
                      {geoLoading ? t("quest.checkingIn") : t("quest.checkin")}
                    </button>
                    {coords && km !== null && (
                      <p className={`text-center text-sm font-semibold ${nearby ? "text-emerald-600" : "text-amber-600"}`}>
                        {nearby
                          ? t("quest.nearby", { m: Math.round(km * 1000) })
                          : t("quest.tooFar", { km: km.toFixed(1) })}
                      </p>
                    )}
                    {coords && !hasTarget && (
                      <p className="text-center text-sm text-emerald-600">{t("quest.checkedIn")}</p>
                    )}
                  </>
                );
              })()}
              <ErrorBox message={result && !result.verified ? null : ""} />
              <Button variant="lagoon" onClick={submit} disabled={verifying || !desc.trim()} className="w-full">
                {verifying ? t("quest.verifying") : t("quest.submit")}
              </Button>
            </div>
          )}

          {result && (
            <div
              className={`rounded-2xl p-4 ${
                result.verified ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <p className="font-bold text-deep">
                {result.verified ? t("quest.success") : t("quest.almost")}{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({t("quest.confidence")}: {result.confidence})
                </span>
              </p>
              <p className="mt-1 text-slate-700">{result.message}</p>
              {!result.verified && result.feedback && (
                <p className="mt-2 text-sm text-slate-500">💡 {result.feedback}</p>
              )}
              {result.verified && (
                <Button onClick={finishQuest} className="mt-3 w-full">
                  {t("quest.next")}
                </Button>
              )}
            </div>
          )}

          {!result?.verified && (
            <button onClick={finishQuest} className="w-full rounded-xl py-1.5 text-sm text-slate-500 transition hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
              {t("quest.skip")}
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
