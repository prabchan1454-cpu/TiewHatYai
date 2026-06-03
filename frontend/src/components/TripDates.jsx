import { useT } from "../lib/i18n.jsx";
import { tripMeta, festivalNames } from "../lib/festivals";

const todayISO = () => new Date().toISOString().slice(0, 10);

const inputCls =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark]";

// Reusable arrival/last-day picker. Controlled by the parent; shows trip
// length, any overlapping festival, and an invalid-range warning. Used in
// onboarding (step 2) and the profile trip editor.
export default function TripDates({ start, end, onStart, onEnd }) {
  const { t, lang } = useT();
  const { days, valid, festivalKeys } = tripMeta(start, end);
  const names = valid ? festivalNames(festivalKeys, lang) : "";

  function handleStart(v) {
    onStart(v);
    if (end && end < v) onEnd(v);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t("onboard.date.start")}
          <input
            type="date"
            value={start || ""}
            min={todayISO()}
            onChange={(e) => handleStart(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t("onboard.date.end")}
          <input
            type="date"
            value={end || ""}
            min={start || todayISO()}
            onChange={(e) => onEnd(e.target.value)}
            className={inputCls}
          />
        </label>
      </div>
      {start && end && !valid && (
        <p className="mt-2 text-xs font-semibold text-red-500">{t("onboard.date.invalid")}</p>
      )}
      {valid && (
        <p className="mt-2 text-xs font-semibold text-lagoon">{t("onboard.date.days", { n: days })}</p>
      )}
      {valid && names && (
        <p className="mt-1 rounded-lg bg-mango/15 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          {t("onboard.date.festival", { names })}
        </p>
      )}
    </div>
  );
}
