import { useState } from "react";
import { api } from "../lib/api";
import { levelFor } from "../lib/progress";
import { Button, Card, ErrorBox, Pill, Spinner } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

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
  const { state, update, completeQuest, addBadge, celebrate, updateReward } = progress;
  const quest = state.activeQuest;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // verification UI state
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

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
      const res = await api.verify({
        quest_name: quest.quest_name,
        quest_objective: quest.objective,
        location_hint: quest.location_hint,
        user_description: desc,
        photo_base64,
        photo_media_type,
      });
      setResult(res);
      if (res.verified) {
        completeQuest(quest.quest_name, quest.reward_xp);
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
  }

  return (
    <div className="space-y-4 px-4 py-4">
      <ErrorBox message={error} />

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
            <Pill>{quest.difficulty}</Pill>
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
                className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-sunset"
              />
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold">{t("quest.attachPhoto")}</span>
                <span>{photo ? photo.name : t("quest.optional")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
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
            <button onClick={finishQuest} className="w-full text-sm text-slate-400 hover:text-slate-600">
              {t("quest.skip")}
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
