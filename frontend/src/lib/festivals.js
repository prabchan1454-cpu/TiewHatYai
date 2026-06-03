// Hat Yai / southern-Thai festivals used to theme quests.
//
// Lunar-based festivals (Chinese New Year, the vegetarian festival, Loy
// Krathong) shift a few weeks each year. The ranges below are approximate for
// ~2026 and are worth a yearly check; `theme` is the context handed to the
// quest generator so น้องเที่ยว can build a festival-flavoured quest.
const FESTIVALS = [
  { key: "newyear", emoji: "🎆", th: "ปีใหม่", en: "New Year",
    theme: "ปีใหม่ การเฉลิมฉลอง การนับถอยหลัง จุดชมเมือง", start: [12, 29], end: [1, 2] },
  { key: "chinesenewyear", emoji: "🧧", th: "ตรุษจีน", en: "Chinese New Year",
    theme: "ตรุษจีน ศาลเจ้า อาหารจีน ย่านคนไทยเชื้อสายจีนในสงขลา", start: [2, 14], end: [2, 20] },
  { key: "songkran", emoji: "💦", th: "สงกรานต์", en: "Songkran",
    theme: "สงกรานต์ เล่นน้ำ รดน้ำดำหัว ประเพณีปีใหม่ไทย", start: [4, 12], end: [4, 16] },
  { key: "veggie", emoji: "🥬", th: "เทศกาลกินเจ", en: "Vegetarian Festival",
    theme: "เทศกาลกินเจ อาหารเจ ศาลเจ้า ธงเหลือง วัฒนธรรมจีนในสงขลา", start: [10, 10], end: [10, 20] },
  { key: "loykrathong", emoji: "🪷", th: "ลอยกระทง", en: "Loy Krathong",
    theme: "ลอยกระทง กระทง แม่น้ำ คลองอู่ตะเภา แสงไฟยามค่ำคืน", start: [11, 22], end: [11, 26] },
];

const FESTIVAL_BY_KEY = Object.fromEntries(FESTIVALS.map((f) => [f.key, f]));

function mmdd(m, d) {
  return m * 100 + d;
}

function inRange(now, start, end) {
  const cur = mmdd(now.getMonth() + 1, now.getDate());
  const s = mmdd(start[0], start[1]);
  const e = mmdd(end[0], end[1]);
  return s <= e ? cur >= s && cur <= e : cur >= s || cur <= e; // handles year-end wrap
}

function startDate(f, now) {
  const y = now.getFullYear();
  let dt = new Date(y, f.start[0] - 1, f.start[1]);
  if (dt < now && !inRange(now, f.start, f.end)) dt = new Date(y + 1, f.start[0] - 1, f.start[1]);
  return dt;
}

// Returns every festival that overlaps the user's travel window [start, end]
// (inclusive). Trips are short, so we just walk day-by-day and dedupe by key —
// `inRange` already handles year-end wrap. Used to theme recommendations.
export function festivalsInRange(start, end) {
  if (!start || !end) return [];
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e) || e < s) return [];
  const found = new Map();
  const day = new Date(s.getFullYear(), s.getMonth(), s.getDate());
  let guard = 0;
  while (day <= e && guard < 400) {
    for (const f of FESTIVALS) {
      if (inRange(day, f.start, f.end)) found.set(f.key, f);
    }
    day.setDate(day.getDate() + 1);
    guard++;
  }
  return [...found.values()];
}

// Derives trip length, validity, and overlapping festival keys from a date
// range. Shared by the onboarding flow and the profile editor so both store
// preferences identically (festivals as keys, not localized text).
export function tripMeta(dateStart, dateEnd) {
  const s = new Date(dateStart);
  const e = new Date(dateEnd);
  const valid = !!dateStart && !!dateEnd && !isNaN(s) && !isNaN(e) && e >= s;
  const days = valid ? Math.round((e - s) / 86400000) + 1 : 0;
  const festivalKeys = valid
    ? festivalsInRange(dateStart, dateEnd)
        .map((f) => f.key)
        .join(",")
    : "";
  return { days, valid, festivalKeys };
}

// Resolves a comma-separated list of festival keys into localized display
// names. Preferences store keys (not localized text) so the label follows the
// current language and survives a language switch. Unknown keys are dropped.
export function festivalNames(csvKeys, lang = "th") {
  if (!csvKeys) return "";
  return csvKeys
    .split(",")
    .map((k) => k.trim())
    .map((k) => FESTIVAL_BY_KEY[k])
    .filter(Boolean)
    .map((f) => (lang === "en" ? f.en : f.th))
    .join(", ");
}

// Picks the festival that best matches the user's trip: the first one whose
// window overlaps the travel dates, falling back to festivalForToday() so the
// quest screen always has something to show off-trip.
export function festivalForTrip(dateStart, dateEnd, now = new Date()) {
  const inTrip = festivalsInRange(dateStart, dateEnd);
  if (inTrip.length) {
    return { festival: inTrip[0], active: true, date: startDate(inTrip[0], now) };
  }
  return festivalForToday(now);
}

// True when a saved trip's last day is already in the past, so callers can stop
// recommending against stale dates and prompt the user to update them.
export function isTripExpired(dateEnd, now = new Date()) {
  if (!dateEnd) return false;
  const e = new Date(dateEnd);
  if (isNaN(e)) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return e < today;
}

// Returns the festival happening now, or the next upcoming one, so the UI
// always has something to show (and stays demoable off-season).
export function festivalForToday(now = new Date()) {
  const active = FESTIVALS.find((f) => inRange(now, f.start, f.end));
  if (active) return { festival: active, active: true, date: startDate(active, now) };

  const cur = mmdd(now.getMonth() + 1, now.getDate());
  let best = null;
  let bestDelta = Infinity;
  for (const f of FESTIVALS) {
    let delta = mmdd(f.start[0], f.start[1]) - cur;
    if (delta < 0) delta += 1231; // wrap into next year
    if (delta < bestDelta) {
      bestDelta = delta;
      best = f;
    }
  }
  return { festival: best, active: false, date: best ? startDate(best, now) : null };
}
