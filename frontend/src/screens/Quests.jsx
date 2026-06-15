import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import { levelFor, todayStr, streakBonus, nextStreak } from "../lib/progress";
import { festivalForTrip } from "../lib/festivals";
import { Button, ErrorBox, Spinner, RarityBadge } from "../components/ui";
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
  Zap,
  Swords,
  ShoppingBag,
  Star,
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

function badgeLabel(name) {
  return String(name || "").replace(/^badge[_\s-]*/i, "").replace(/_/g, " ").trim();
}

// RPG quest type selection card
function QuestTypeCard({ Icon, title, desc, rarity, xpHint, onClick, disabled, loading }) {
  const rarityBorder = {
    Common:    "border-slate-300 bg-white dark:border-slate-500/30 dark:bg-[#0e1a2e]",
    Rare:      "border-blue-200 bg-blue-50 dark:border-blue-500/40 dark:bg-[#0d1e35]",
    Epic:      "border-purple-200 bg-purple-50 dark:border-purple-500/45 dark:bg-[#140e2a]",
    Legendary: "border-amber-300 bg-amber-50 dark:border-amber-400/55 dark:bg-[#1a0e00]",
  };
  const rarityGlow = {
    Common:    "",
    Rare:      "shadow-[0_0_16px_rgba(96,165,250,0.18)]",
    Epic:      "shadow-[0_0_20px_rgba(168,85,247,0.22)]",
    Legendary: "shadow-[0_0_24px_rgba(251,191,36,0.28)]",
  };
  const iconBg = {
    Common:    "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
    Rare:      "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
    Epic:      "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300",
    Legendary: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 ${rarityBorder[rarity]} ${rarityGlow[rarity]}`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg[rarity]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <p className="font-bold text-slate-900 dark:text-white">{loading ? "กำลังโหลด..." : title}</p>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">{desc}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <RarityBadge rarity={rarity} />
        {xpHint && (
          <span className="flex items-center gap-0.5 text-xs font-bold text-mango">
            <Zap className="h-3 w-3" /> {xpHint}
          </span>
        )}
      </div>
    </button>
  );
}

export default function Quests({ progress }) {
  const { t, lang } = useT();
  const { state, update, completeQuest, issueDaily, addBadge, celebrate, updateReward } = progress;
  const quest = state.activeQuest;
  const [loading, setLoading] = useState(false);
  const [souvenirLoading, setSouvenirLoading] = useState(false);
  const [expertLoading, setExpertLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [festLoading, setFestLoading] = useState(false);
  const [error, setError] = useState("");

  const fest = festivalForTrip(state.preferences?.dateStart, state.preferences?.dateEnd);
  const festName = fest.festival ? (lang === "en" ? fest.festival.en : fest.festival.th) : "";

  const today = todayStr();
  const dailyDoneToday = state.daily.completedDate === today;

  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [storyExpanded, setStoryExpanded] = useState(false);

  useEffect(() => { setStoryExpanded(false); }, [quest?.quest_name]);

  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => photoUrl && URL.revokeObjectURL(photoUrl), [photoUrl]);

  function checkIn() {
    if (!navigator.geolocation || geoLoading) return;
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoLoading(false); },
      () => { setError(t("quest.geoError")); setGeoLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const level = levelFor(state.xp).name;

  async function getExpertQuest() {
    setExpertLoading(true); setError(""); setResult(null);
    try {
      const q = await api.quest({ user_location_area: "สงขลา", user_level: level, completed_quests: state.completedQuests, expert: true });
      update({ activeQuest: q });
    } catch (e) { setError(e.message); } finally { setExpertLoading(false); }
  }

  async function getQuest() {
    setLoading(true); setError(""); setResult(null);
    try {
      const q = await api.quest({ user_location_area: "สงขลา", user_level: level, completed_quests: state.completedQuests });
      update({ activeQuest: q });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  async function getSouvenirQuest() {
    setSouvenirLoading(true); setError(""); setResult(null);
    try {
      const q = await api.quest({ user_location_area: "สงขลา", user_level: level, completed_quests: state.completedQuests, focus: "souvenir" });
      update({ activeQuest: q });
    } catch (e) { setError(e.message); } finally { setSouvenirLoading(false); }
  }

  async function getDaily() {
    setDailyLoading(true); setError(""); setResult(null);
    try {
      const q = await api.quest({ user_location_area: "สงขลา", user_level: level, completed_quests: state.completedQuests });
      issueDaily(q);
    } catch (e) { setError(e.message); } finally { setDailyLoading(false); }
  }

  async function getFestivalQuest() {
    setFestLoading(true); setError(""); setResult(null);
    try {
      const q = await api.quest({ user_location_area: "สงขลา", user_level: level, completed_quests: state.completedQuests, festival: fest.festival.theme });
      update({ activeQuest: q });
    } catch (e) { setError(e.message); } finally { setFestLoading(false); }
  }

  async function submit() {
    if (!desc.trim() || !photo || verifying) return;
    setVerifying(true); setError("");
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
        const bonus = quest.isDaily ? streakBonus(nextStreak(state.daily)) : 0;
        completeQuest(quest.quest_name, quest.reward_xp, { isDaily: !!quest.isDaily });
        celebrate({ xp: (quest.reward_xp || 0) + bonus, badge: null });
        try {
          const badge = await api.badge({ badge_name: badgeLabel(quest.reward_badge), quest_completed: quest.quest_name });
          addBadge(badge);
          updateReward({ badge });
        } catch { /* badge is a bonus; ignore failures */ }
      }
    } catch (e) { setError(e.message); } finally { setVerifying(false); }
  }

  function finishQuest() {
    update({ activeQuest: null });
    setDesc(""); setPhoto(null); setResult(null); setCoords(null);
  }

  return (
    <div className="space-y-4 p-4 pb-6">
      <ErrorBox message={error} />

      {/* Festival banner */}
      {!quest && fest.festival && (
        <div className="rounded-3xl border border-mango/30 bg-amber-50 p-4 shadow-[0_0_20px_rgba(255,176,32,0.15)] dark:bg-[#1a1200]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mango/20 text-2xl">
              {fest.festival.emoji}
            </span>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {fest.active ? t("fest.activeTitle", { name: festName }) : t("fest.soonTitle", { name: festName })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {fest.active ? t("fest.activeDesc") : t("fest.soonDesc", {
                  date: fest.date ? fest.date.toLocaleDateString(lang === "en" ? "en-US" : "th-TH", { day: "numeric", month: "short" }) : "",
                })}
              </p>
            </div>
          </div>
          {fest.active && (
            <Button onClick={getFestivalQuest} disabled={festLoading} variant="game" className="mt-3 w-full">
              {festLoading ? t("quest.rolling") : t("fest.getQuest")}
            </Button>
          )}
        </div>
      )}

      {/* Daily quest card */}
      {!quest && (
        <div className={`rounded-3xl border p-4 ${dailyDoneToday ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20" : "border-amber-500/30 bg-orange-50 dark:bg-[#1a1000]"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${dailyDoneToday ? "bg-emerald-500/20 text-emerald-600 dark:text-amber-300" : "bg-amber-500/20 text-amber-600 dark:text-amber-300"}`}>
                <Sunrise className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{t("daily.title")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("daily.subtitle")}</p>
              </div>
            </div>
            {state.daily.streak > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-sunset/15 px-2.5 py-1 text-xs font-bold text-sunset border border-sunset/25">
                <Flame className="h-3.5 w-3.5" />
                <span className="tnum">{state.daily.streak}</span>
              </span>
            )}
          </div>
          {dailyDoneToday ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{t("daily.doneToday")}</p>
                <p className="text-slate-500 dark:text-slate-400">{t("daily.comeBack")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-mango/30 bg-mango/10 px-3 py-2 text-xs font-bold text-amber-600 dark:text-mango">
                <Zap className="h-3.5 w-3.5" fill="currentColor" />
                {t("daily.bonus", { xp: streakBonus(nextStreak(state.daily)) })}
              </div>
              <Button onClick={getDaily} disabled={dailyLoading} variant="game" className="mt-2 w-full">
                {dailyLoading ? t("daily.rolling") : t("daily.get")}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Quest type selection */}
      {!quest && (
        <div className="space-y-2.5">
          <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-slate-500">{t("quest.readyTitle")}</h2>

          <QuestTypeCard
            Icon={Compass}
            title={t("quest.getNew")}
            desc={t("quest.readyDesc")}
            rarity="Rare"
            xpHint="50–120 XP"
            onClick={getQuest}
            disabled={loading || souvenirLoading || expertLoading}
            loading={loading}
          />
          <QuestTypeCard
            Icon={ShoppingBag}
            title={t("quest.getSouvenir")}
            desc="สำรวจของฝากสงขลาแท้ๆ"
            rarity="Common"
            xpHint="40–80 XP"
            onClick={getSouvenirQuest}
            disabled={loading || souvenirLoading || expertLoading}
            loading={souvenirLoading}
          />
          <QuestTypeCard
            Icon={Swords}
            title={t("quest.getExpert")}
            desc="ภารกิจสำรวจแบบเจาะลึก"
            rarity="Common"
            xpHint="120–200 XP"
            onClick={getExpertQuest}
            disabled={loading || souvenirLoading || expertLoading}
            loading={expertLoading}
          />
        </div>
      )}

      {(loading || souvenirLoading || expertLoading || dailyLoading) && quest === null && (
        <div className="flex justify-center py-4">
          <Spinner label={t("quest.thinking")} />
        </div>
      )}

      {/* Active quest card */}
      {quest && (
        <div className="space-y-3">
          <QuestBanner category={quest.category} difficulty={quest.difficulty} />

          {/* Quest header */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4 space-y-3 dark:bg-[#0e1a2e] dark:border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              {quest.isDaily && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                  <Sunrise className="h-3 w-3" /> {t("daily.badge")}
                </span>
              )}
              <RarityBadge rarity={quest.difficulty === "Easy" ? "Common" : quest.difficulty === "Medium" ? "Rare" : "Epic"} />
              <span className="flex items-center gap-1 rounded-full bg-mango/15 border border-mango/25 px-2.5 py-0.5 text-[11px] font-extrabold text-mango ml-auto">
                <Zap className="h-3 w-3" /> +{quest.reward_xp} XP
              </span>
            </div>

            <h2 className="text-xl font-extrabold leading-snug text-slate-900 dark:text-white">{quest.quest_name}</h2>

            <p className={`text-sm italic text-slate-500 dark:text-slate-400 ${!storyExpanded ? "line-clamp-2" : ""}`}>
              {quest.quest_story}
            </p>
            {!storyExpanded && (
              <button onClick={() => setStoryExpanded(true)} className="text-xs font-semibold text-lagoon hover:underline focus-visible:outline-none">
                อ่านต่อ ▾
              </button>
            )}

            {/* Objective */}
            <div className="rounded-2xl bg-sunset/8 border border-sunset/20 p-3.5 text-sm">
              <p className="flex items-center gap-1.5 font-bold text-sunset">
                <Target className="h-4 w-4" /> {t("quest.objective")}
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{quest.objective}</p>
            </div>

            {/* Hint */}
            <div className="rounded-2xl bg-lagoon/8 border border-lagoon/20 p-3.5 text-sm">
              <p className="flex items-center gap-1.5 font-bold text-lagoon">
                <Lightbulb className="h-4 w-4" /> {t("quest.hint")}
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{quest.location_hint}</p>
            </div>

            {/* Reward */}
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-mango" />
              <span>{t("quest.reward")}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{badgeLabel(quest.reward_badge)}</span>
            </div>
          </div>

          {/* Submission form */}
          {!result?.verified && (
            <div className="rounded-3xl bg-white border border-slate-200 p-4 space-y-3 dark:bg-[#0e1a2e] dark:border-white/10">
              <p className="font-bold text-slate-900 dark:text-white">{t("quest.doneQ")}</p>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                aria-label={t("quest.doneQ")}
                placeholder={t("quest.descPlaceholder")}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sunset/40 focus:ring-2 focus:ring-sunset/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:placeholder:text-slate-500"
              />

              {photo ? (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
                  <img src={photoUrl} alt={photo.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  <span className="flex-1 truncate text-sm text-slate-500 dark:text-slate-400">{photo.name}</span>
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    aria-label={t("quest.removePhoto")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400 focus-visible:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/12">
                    <Camera className="h-4 w-4" /> {t("quest.attachPhoto")}
                  </span>
                  <span className="truncate text-xs">{t("quest.photoRequired")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
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
                      className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40 disabled:opacity-50 ${
                        nearby
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : coords
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-lagoon/40 hover:text-lagoon dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                      }`}
                    >
                      <LocateFixed className="h-4 w-4" />
                      {geoLoading ? t("quest.checkingIn") : t("quest.checkin")}
                    </button>
                    {coords && km !== null && (
                      <p className={`text-center text-sm font-semibold ${nearby ? "text-emerald-400" : "text-amber-400"}`}>
                        {nearby
                          ? t("quest.nearby", { m: Math.round(km * 1000) })
                          : t("quest.tooFar", { km: km.toFixed(1) })}
                      </p>
                    )}
                    {coords && !hasTarget && (
                      <p className="text-center text-sm text-emerald-400">{t("quest.checkedIn")}</p>
                    )}
                  </>
                );
              })()}

              <Button variant="game" onClick={submit} disabled={verifying || !desc.trim() || !photo} className="w-full">
                {verifying ? t("quest.verifying") : t("quest.submit")}
              </Button>
              {!photo && (
                <p className="text-center text-xs text-slate-500">{t("quest.photoNudge")}</p>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`flex items-start gap-2.5 rounded-2xl border p-4 ${
              result.verified
                ? "bg-emerald-50 border-emerald-500/30 dark:bg-emerald-900/20"
                : "bg-amber-50 border-amber-500/30 dark:bg-amber-900/20"
            }`}>
              {result.verified ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              )}
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  {result.verified ? t("quest.success") : t("quest.almost")}{" "}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({t("quest.confidence")}: {result.confidence})
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{result.message}</p>
                {!result.verified && result.feedback && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{result.feedback}</p>
                )}
                {result.verified && (
                  <Button onClick={finishQuest} variant="game" className="mt-3 w-full">
                    {t("quest.next")}
                  </Button>
                )}
              </div>
            </div>
          )}

          {!result?.verified && (
            <button
              onClick={finishQuest}
              className="w-full rounded-xl py-1.5 text-sm text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
            >
              {t("quest.skip")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
