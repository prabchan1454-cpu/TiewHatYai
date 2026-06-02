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
