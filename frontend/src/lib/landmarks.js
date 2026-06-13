// Curated iconic Songkhla landmarks for the "Songkhla Passport" — collect a
// stamp by visiting each in person and submitting a photo the AI verifies.
// Coordinates are approximate (good enough to drop a map pin / GPS-check).
// `district` groups stamps so the passport visibly spans the whole province
// (the "spread tourism across Songkhla" angle), and `community: true` marks
// local-economy spots used in the creative-economy pitch.

export const LANDMARKS = [
  {
    id: "golden-mermaid",
    th: "นางเงือกทอง สมิหลา",
    en: "Golden Mermaid, Samila",
    district: "เมืองสงขลา",
    emoji: "🧜‍♀️",
    lat: 7.1986, lng: 100.5905,
    hint: "รูปปั้นสัญลักษณ์ของสงขลา ริมหาดสมิหลา",
  },
  {
    id: "cat-mouse",
    th: "ประติมากรรมแมว-หนู",
    en: "Cat & Mouse Statue",
    district: "เมืองสงขลา",
    emoji: "🐱",
    lat: 7.2099, lng: 100.5933,
    hint: "รูปปั้นแมวหนูยักษ์ แหลมสนอ่อน",
  },
  {
    id: "khao-tang-kuan",
    th: "เขาตังกวน",
    en: "Khao Tang Kuan",
    district: "เมืองสงขลา",
    emoji: "⛰️",
    lat: 7.2128, lng: 100.5953,
    hint: "จุดชมวิวพาโนรามา มีเจดีย์บนยอดเขา",
  },
  {
    id: "old-town",
    th: "เมืองเก่า ถนนนางงาม",
    en: "Old Town, Nang Ngam Rd",
    district: "เมืองสงขลา",
    emoji: "🏘️",
    lat: 7.1985, lng: 100.5953,
    community: true,
    hint: "ตึกชิโน-ยูโรเปียน สตรีทอาร์ต ของกินเก่าแก่",
  },
  {
    id: "kao-seng",
    th: "หาดเก้าเส้ง",
    en: "Kao Seng Beach",
    district: "เมืองสงขลา",
    emoji: "🪨",
    lat: 7.1722, lng: 100.6011,
    hint: "กลุ่มหินริมทะเล ตำนานหัวนายแรง",
  },
  {
    id: "ko-yo",
    th: "เกาะยอ",
    en: "Ko Yo",
    district: "เกาะยอ",
    emoji: "🏝️",
    lat: 7.1644, lng: 100.5447,
    community: true,
    hint: "เกาะกลางทะเลสาบ ผ้าทอเกาะยอ อาหารทะเลสด",
  },
  {
    id: "tinsulanonda-bridge",
    th: "สะพานติณสูลานนท์",
    en: "Tinsulanonda Bridge",
    district: "เกาะยอ",
    emoji: "🌉",
    lat: 7.1789, lng: 100.5311,
    hint: "สะพานข้ามทะเลสาบที่ยาวที่สุดในไทย",
  },
  {
    id: "cable-car",
    th: "เคเบิลคาร์เขาคอหงส์",
    en: "Hat Yai Cable Car",
    district: "หาดใหญ่",
    emoji: "🚠",
    lat: 7.0072, lng: 100.4647,
    hint: "กระเช้าชมวิวเมืองหาดใหญ่ บนเขาคอหงส์",
  },
  {
    id: "khlong-hae",
    th: "ตลาดน้ำคลองแห",
    en: "Khlong Hae Floating Market",
    district: "หาดใหญ่",
    emoji: "🛶",
    lat: 7.0289, lng: 100.4869,
    community: true,
    hint: "ตลาดน้ำแห่งแรกของภาคใต้ ของกินพื้นบ้าน",
  },
  {
    id: "central-mosque",
    th: "มัสยิดกลางสงขลา",
    en: "Songkhla Central Mosque",
    district: "หาดใหญ่",
    emoji: "🕌",
    lat: 7.0469, lng: 100.4914,
    hint: "\"ทัชมาฮาลเมืองไทย\" สะท้อนเงาในสระน้ำ",
  },
  {
    id: "hua-khao-daeng",
    th: "เมืองเก่าหัวเขาแดง",
    en: "Hua Khao Daeng Old Town",
    district: "สิงหนคร",
    emoji: "🏯",
    lat: 7.2386, lng: 100.5639,
    hint: "ป้อม-กำแพงเมืองเก่าสมัยอยุธยา",
  },
  {
    id: "samila-beach",
    th: "หาดสมิหลา",
    en: "Samila Beach",
    district: "เมืองสงขลา",
    emoji: "🏖️",
    lat: 7.1969, lng: 100.5897,
    hint: "หาดทรายขาวคู่เมืองสงขลา สวนสน",
  },
];

export const STAMP_XP = 60; // XP awarded per landmark stamp collected

export function landmarkById(id) {
  return LANDMARKS.find((l) => l.id === id) || null;
}

// Districts in display order, for grouping the passport grid.
export const DISTRICTS = ["เมืองสงขลา", "หาดใหญ่", "เกาะยอ", "สิงหนคร"];
