// Curated iconic Songkhla landmarks for the "Songkhla Passport" — collect a
// stamp by visiting each in person and submitting a photo the AI verifies.
// Coordinates are approximate (good enough to drop a map pin / GPS-check).
// `district` groups stamps so the passport visibly spans the whole province
// (the "spread tourism across Songkhla" angle), and `community: true` marks
// local-economy spots used in the creative-economy pitch.
import {
  Shell,
  Cat,
  Mountain,
  Landmark,
  Waves,
  TreePalm,
  Cable,
  CableCar,
  Sailboat,
  MoonStar,
  Castle,
  Umbrella,
  Building2,
  ShoppingBag,
  Train,
  Trees,
  Flag,
} from "lucide-react";

export const LANDMARKS = [
  {
    id: "golden-mermaid",
    th: "นางเงือกทอง สมิหลา",
    en: "Golden Mermaid, Samila",
    district: "เมืองสงขลา",
    Icon: Shell,
    lat: 7.2155, lng: 100.5958,
    hint: "รูปปั้นสัญลักษณ์ของสงขลา ริมหาดสมิหลา",
  },
  {
    id: "cat-mouse",
    th: "ประติมากรรมแมว-หนู",
    en: "Cat & Mouse Statue",
    district: "เมืองสงขลา",
    Icon: Cat,
    lat: 7.2143, lng: 100.5941,
    hint: "รูปปั้นแมวหนูยักษ์ แหลมสนอ่อน",
  },
  {
    id: "khao-tang-kuan",
    th: "เขาตังกวน",
    en: "Khao Tang Kuan",
    district: "เมืองสงขลา",
    Icon: Mountain,
    lat: 7.2128, lng: 100.5953,
    hint: "จุดชมวิวพาโนรามา มีเจดีย์บนยอดเขา",
  },
  {
    id: "old-town",
    th: "เมืองเก่า ถนนนางงาม",
    en: "Old Town, Nang Ngam Rd",
    district: "เมืองสงขลา",
    Icon: Landmark,
    lat: 7.1985, lng: 100.5953,
    community: true,
    hint: "ตึกชิโน-ยูโรเปียน สตรีทอาร์ต ของกินเก่าแก่",
  },
  {
    id: "kao-seng",
    th: "หาดเก้าเส้ง",
    en: "Kao Seng Beach",
    district: "เมืองสงขลา",
    Icon: Waves,
    lat: 7.1824, lng: 100.6172,
    hint: "กลุ่มหินริมทะเล ตำนานหัวนายแรง",
  },
  {
    id: "ko-yo",
    th: "เกาะยอ",
    en: "Ko Yo",
    district: "เกาะยอ",
    Icon: TreePalm,
    lat: 7.1644, lng: 100.5447,
    community: true,
    hint: "เกาะกลางทะเลสาบ ผ้าทอเกาะยอ อาหารทะเลสด",
  },
  {
    id: "tinsulanonda-bridge",
    th: "สะพานติณสูลานนท์",
    en: "Tinsulanonda Bridge",
    district: "เกาะยอ",
    Icon: Cable,
    lat: 7.1535, lng: 100.5596,
    hint: "สะพานข้ามทะเลสาบที่ยาวที่สุดในไทย",
  },
  {
    id: "cable-car",
    th: "เคเบิลคาร์เขาคอหงส์",
    en: "Hat Yai Cable Car",
    district: "หาดใหญ่",
    Icon: CableCar,
    lat: 7.0072, lng: 100.4647,
    hint: "กระเช้าชมวิวเมืองหาดใหญ่ บนเขาคอหงส์",
  },
  {
    id: "khlong-hae",
    th: "ตลาดน้ำคลองแห",
    en: "Khlong Hae Floating Market",
    district: "หาดใหญ่",
    Icon: Sailboat,
    lat: 7.0469, lng: 100.4740,
    community: true,
    hint: "ตลาดน้ำแห่งแรกของภาคใต้ ของกินพื้นบ้าน",
  },
  {
    id: "central-mosque",
    th: "มัสยิดกลางสงขลา",
    en: "Songkhla Central Mosque",
    district: "หาดใหญ่",
    Icon: MoonStar,
    lat: 7.0760, lng: 100.4915,
    hint: "\"ทัชมาฮาลเมืองไทย\" สะท้อนเงาในสระน้ำ",
  },
  {
    id: "hua-khao-daeng",
    th: "เมืองเก่าหัวเขาแดง",
    en: "Hua Khao Daeng Old Town",
    district: "สิงหนคร",
    Icon: Castle,
    lat: 7.2386, lng: 100.5639,
    hint: "ป้อม-กำแพงเมืองเก่าสมัยอยุธยา",
  },
  {
    id: "samila-beach",
    th: "หาดสมิหลา",
    en: "Samila Beach",
    district: "เมืองสงขลา",
    Icon: Umbrella,
    lat: 7.2118, lng: 100.5952,
    hint: "หาดทรายขาวคู่เมืองสงขลา สวนสน",
  },
  {
    id: "national-museum",
    th: "พิพิธภัณฑสถานแห่งชาติ สงขลา",
    en: "Songkhla National Museum",
    district: "เมืองสงขลา",
    Icon: Building2,
    lat: 7.2024, lng: 100.5889,
    hint: "คฤหาสน์ชิโน-โปรตุกีสเก่าแก่ จัดแสดงประวัติเมืองสงขลา",
  },
  {
    id: "wat-matchimawat",
    th: "วัดมัชฌิมาวาส (วัดกลาง)",
    en: "Wat Matchimawat",
    district: "เมืองสงขลา",
    Icon: Landmark,
    lat: 7.1946, lng: 100.5921,
    hint: "วัดเก่าแก่คู่เมือง จิตรกรรมฝาผนังและพิพิธภัณฑ์ภัทรศิลป์",
  },
  {
    id: "wat-hat-yai-nai",
    th: "วัดหาดใหญ่ใน (พระนอน)",
    en: "Wat Hat Yai Nai (Reclining Buddha)",
    district: "หาดใหญ่",
    Icon: Landmark,
    lat: 7.0036, lng: 100.4536,
    hint: "พระพุทธไสยาสน์องค์ใหญ่ที่สุดแห่งหนึ่งของภาคใต้",
  },
  {
    id: "kim-yong-market",
    th: "ตลาดกิมหยง",
    en: "Kim Yong Market",
    district: "หาดใหญ่",
    Icon: ShoppingBag,
    lat: 7.0077, lng: 100.4697,
    community: true,
    hint: "ตลาดของฝากชื่อดังกลางเมืองหาดใหญ่",
  },
  {
    id: "hatyai-station",
    th: "สถานีรถไฟชุมทางหาดใหญ่",
    en: "Hat Yai Junction Station",
    district: "หาดใหญ่",
    Icon: Train,
    lat: 7.0039, lng: 100.4676,
    hint: "สถานีรถไฟประวัติศาสตร์ หอนาฬิกาคู่เมือง",
  },
  {
    id: "ton-nga-chang",
    th: "น้ำตกโตนงาช้าง",
    en: "Ton Nga Chang Waterfall",
    district: "หาดใหญ่",
    Icon: Trees,
    lat: 6.9464, lng: 100.2302,
    hint: "น้ำตก 7 ชั้น สายน้ำแยกเป็นงาช้าง ในเขตรักษาพันธุ์สัตว์ป่า",
  },
  {
    id: "wat-pha-kho",
    th: "วัดพะโคะ",
    en: "Wat Pha Kho",
    district: "สทิงพระ",
    Icon: Landmark,
    lat: 7.6015, lng: 100.3918,
    hint: "วัดถิ่นกำเนิดตำนานหลวงปู่ทวด เจดีย์พระมาลิกบนเขา",
  },
  {
    id: "wat-cha-thing-phra",
    th: "วัดจะทิ้งพระ",
    en: "Wat Cha Thing Phra",
    district: "สทิงพระ",
    Icon: Landmark,
    lat: 7.4745, lng: 100.4388,
    hint: "วัดเก่าสมัยอยุธยา เจดีย์และวิหารพระพุทธไสยาสน์",
  },
  {
    id: "khlong-daen-market",
    th: "ตลาดริมน้ำคลองแดน",
    en: "Khlong Daen Riverside Market",
    district: "ระโนด",
    Icon: Sailboat,
    lat: 7.9144, lng: 100.3089,
    community: true,
    hint: "ชุมชนเรือนไม้ริมคลองอายุร่วม 100 ปี ตลาดวัฒนธรรมสามคลอง",
  },
  {
    id: "muang-ngam-beach",
    th: "หาดม่วงงาม",
    en: "Muang Ngam Beach",
    district: "สิงหนคร",
    Icon: Waves,
    lat: 7.3490, lng: 100.5560,
    hint: "หาดทรายยาวเงียบสงบ วิถีประมงชายฝั่ง",
  },
  {
    id: "wat-khu-tao",
    th: "วัดคูเต่า",
    en: "Wat Khu Tao",
    district: "บางกล่ำ",
    Icon: Landmark,
    lat: 7.1329, lng: 100.4958,
    hint: "วัดริมคลองอู่ตะเภา ศิลปกรรมพื้นถิ่นรางวัลอนุรักษ์",
  },
  {
    id: "hat-sakom",
    th: "หาดสะกอม",
    en: "Sakom Beach",
    district: "เทพา",
    Icon: Waves,
    lat: 6.9597, lng: 100.8455,
    hint: "หาดทรายขาวน้ำใส ปากบางสะกอม วิถีประมงพื้นบ้าน",
  },
  {
    id: "khao-nam-khang",
    th: "อุโมงค์ประวัติศาสตร์เขาน้ำค้าง",
    en: "Khao Nam Khang Historical Tunnel",
    district: "นาทวี",
    Icon: Trees,
    lat: 6.5638, lng: 100.5977,
    hint: "อุโมงค์ดินยาวที่สุดในไทย ในอุทยานแห่งชาติเขาน้ำค้าง",
  },
  {
    id: "dan-nok",
    th: "ด่านนอก (ปาดังเบซาร์)",
    en: "Dan Nok Border Market",
    district: "สะเดา",
    Icon: Flag,
    lat: 6.5222, lng: 100.4187,
    community: true,
    hint: "ตลาดและด่านชายแดนไทย-มาเลเซีย ของกิน-ของฝาก",
  },
];

export const STAMP_XP = 60; // XP awarded per landmark stamp collected

export function landmarkById(id) {
  return LANDMARKS.find((l) => l.id === id) || null;
}

// Curated, verified Wikimedia Commons photos (filename only). Referenced via the
// stable Special:FilePath redirect so we never hardcode brittle hashed thumbnail
// URLs. Landmarks without a confirmed free photo fall back to their icon.
const LANDMARK_PHOTOS = {
  "samila-beach":        "Songkhla, Thailand, Samila Beach, 2024.jpg",
  "cat-mouse":           "Songkhla Laem Samila.jpg",
  "khao-tang-kuan":      "ยอดเขาตังกวน - panoramio (1).jpg",
  "old-town":            "Songkhla Old Town Shophouse (II).jpg",
  "national-museum":     "Songkhla National Museum - front.jpg",
  "ko-yo":               "Ko Yo, Mueang Songkhla District, Songkhla, Thailand - panoramio (3).jpg",
  "tinsulanonda-bridge": "Tinsulanonda Bridge 1.jpg",
  "cable-car":           "May 2025 - Road to Hat Yai cable car and Kho Hong Viewpoint, Hat Yai Park.jpg",
  "khlong-hae":          "Hat-Yai-Klonghae-Floating-Market 15.jpg",
  "central-mosque":      "Masjid Pusat Songkhla (1).jpg",
  "hatyai-station":      "Thamnoonvithi 1.jpg",
  "wat-pha-kho":         "Pha-Ko Songkhla.jpg",
  "wat-cha-thing-phra":  "Cha-Ting-Pra Temple.JPG",
  "khao-nam-khang":      "Khao Nam Khang National Park in Songkhla, Thailand.jpg",
  "dan-nok":             "Padang Besar 27.jpg",
  // Added via geosearch / article images (verified to resolve)
  "golden-mermaid":      "Songkhla mermaid - panoramio.jpg",
  "kao-seng":            "หัวนายแรง - panoramio.jpg",
  "ton-nga-chang":       "น้ำตกโตนงาช้าง - panoramio.jpg",
  "hat-sakom":           "Sakom, Thepha District, Songkhla, Thailand - panoramio.jpg",
  "kim-yong-market":     "Kimyong 1.jpg",
  "wat-khu-tao":         "Ubosod-01.jpg",
  "wat-hat-yai-nai":     "AT HAT YAI NAI.jpg",
};

// Build a Commons image URL for a landmark id, or null if we have no photo.
export function landmarkImageUrl(id, width = 600) {
  const file = LANDMARK_PHOTOS[id];
  return file
    ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
    : null;
}

// Link to the real Google Maps place. Prefer the name (so Google resolves its
// own canonical pin — accurate even if our stored lat/lng is only approximate);
// fall back to coordinates when there's no name (e.g. user check-ins).
export function gmapsUrl({ name, lat, lng } = {}) {
  const query = name
    ? encodeURIComponent(`${name} สงขลา`)
    : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// Districts in display order, for grouping the passport grid.
export const DISTRICTS = [
  "เมืองสงขลา",
  "เกาะยอ",
  "สิงหนคร",
  "สทิงพระ",
  "ระโนด",
  "บางกล่ำ",
  "หาดใหญ่",
  "นาทวี",
  "สะเดา",
  "เทพา",
];
