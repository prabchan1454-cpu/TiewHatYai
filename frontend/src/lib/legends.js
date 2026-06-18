// "Legends & Mysteries" — the hyperlocal entertainment layer that no global app
// has: local legends, ghost stories, fortune/sacred-wish spots, and cultural
// mysteries. Each story is anchored to a real coordinate so reading drives a
// real visit (and an in-person unlock that awards XP). `landmarkId` links to an
// existing passport landmark when one exists; otherwise lat/lng stand alone.
//
// type: "legend" | "ghost" | "fortune" | "mystery"
// `wish: true` adds a "make a wish" interaction (for sacred/fortune spots).
import { landmarkById } from "./landmarks";

export const LEGEND_XP = 40; // XP awarded the first time a story is unlocked on-site

const RAW = [
  {
    id: "hua-nai-raeng",
    type: "legend",
    landmarkId: "kao-seng",
    title: { th: "ตำนานหัวนายแรง", en: "The Legend of Hua Nai Raeng" },
    teaser: {
      th: "ก้อนหินยักษ์ริมหาดเก้าเส้งกับคำสาปขุมทรัพย์ที่ยังหาไม่เจอ",
      en: "A giant boulder at Kao Seng beach and a treasure curse still unsolved",
    },
    story: {
      th: "เล่ากันว่า 'นายแรง' ชายผู้มีพละกำลังมหาศาล แบกสมบัติไปบูชาพระธาตุแต่ไปไม่ทันพิธี ด้วยความเสียใจจึงสาปแช่งสมบัติไว้แล้วสิ้นใจ กลายเป็นก้อนหินหัวคนริมหาดเก้าเส้งที่เห็นทุกวันนี้ ใครตามหาขุมทรัพย์ใต้หินก็ยังไม่เคยเจอ",
      en: "They say 'Nai Raeng', a man of immense strength, carried treasure to honor a sacred relic but arrived too late for the ceremony. In grief he cursed the treasure and died — becoming the head-shaped rock at Kao Seng you can still see today. No one who hunts the treasure beneath it has ever found it.",
    },
  },
  {
    id: "golden-mermaid-wish",
    type: "fortune",
    landmarkId: "golden-mermaid",
    wish: true,
    title: { th: "พรนางเงือกทองสมิหลา", en: "The Golden Mermaid's Blessing" },
    teaser: {
      th: "ลูบหางนางเงือกทองแล้วอธิษฐาน เชื่อกันว่าจะได้กลับมาสงขลาอีกครั้ง",
      en: "Touch the mermaid's tail and wish — legend says you'll return to Songkhla",
    },
    story: {
      th: "นางเงือกทองคือสัญลักษณ์คู่หาดสมิหลา จากวรรณคดีเรื่องพระอภัยมณี ผู้คนเชื่อว่าการได้สัมผัสหางทองแล้วอธิษฐาน จะนำโชคและทำให้ได้หวนคืนสู่สงขลาอีกครั้ง",
      en: "The Golden Mermaid, inspired by the epic Phra Aphai Mani, is Samila beach's icon. Touching her golden tail and making a wish is said to bring luck — and ensure you'll one day return to Songkhla.",
    },
  },
  {
    id: "luang-pu-thuat",
    type: "legend",
    landmarkId: "wat-pha-kho",
    title: { th: "ตำนานหลวงปู่ทวด เหยียบน้ำทะเลจืด", en: "Luang Pu Thuat & the Sweetened Sea" },
    teaser: {
      th: "พระเกจิผู้เปลี่ยนน้ำทะเลให้ดื่มได้ ณ ถิ่นกำเนิดวัดพะโคะ",
      en: "The revered monk who turned seawater drinkable — born near Wat Pha Kho",
    },
    story: {
      th: "หลวงปู่ทวด พระเกจิอาจารย์ผู้เป็นที่เคารพทั่วภาคใต้ มีตำนานว่าครั้งโดยสารเรือแล้วเกิดพายุขาดน้ำจืด ท่านหย่อนเท้าลงทะเลแล้วน้ำเค็มกลายเป็นน้ำจืดดื่มได้ วัดพะโคะคือถิ่นกำเนิดและสถานที่ศักดิ์สิทธิ์ของตำนานนี้",
      en: "Luang Pu Thuat, venerated across the South, is said to have dipped his foot into the sea during a storm — turning the saltwater fresh and drinkable. Wat Pha Kho is the birthplace and sacred heart of his legend.",
    },
  },
  {
    id: "old-town-spirits",
    type: "ghost",
    landmarkId: "old-town",
    title: { th: "เงาราตรีย่านเมืองเก่า", en: "Night Shadows of the Old Town" },
    teaser: {
      th: "ตึกชิโน-ยูโรเปียนอายุร้อยปีกับเรื่องเล่าหลังเที่ยงคืนบนถนนนางงาม",
      en: "Century-old shophouses and after-midnight tales on Nang Ngam Road",
    },
    story: {
      th: "ถนนนางงาม ถนนนครนอก-นครใน เต็มไปด้วยตึกเก่าอายุนับร้อยปี ชาวบ้านเล่าถึงเสียงฝีเท้าและเงาในตรอกยามดึก บ้างว่าเป็นวิญญาณพ่อค้าจีนรุ่นเก่าที่ยังเฝ้าร้านของตน เดินเที่ยวกลางวันสวยงาม แต่กลางคืนมีมนตร์ขลังอีกแบบ",
      en: "Nang Ngam and the Nakhon Nai–Nakhon Nok streets are lined with century-old shophouses. Locals speak of footsteps and shadows in the lanes after dark — said to be old Chinese merchants still watching over their shops. Beautiful by day; a different kind of magic by night.",
    },
  },
  {
    id: "khao-tang-kuan-mystery",
    type: "mystery",
    landmarkId: "khao-tang-kuan",
    title: { th: "ปริศนาเจดีย์เขาตังกวน", en: "The Mystery of Khao Tang Kuan Chedi" },
    teaser: {
      th: "เจดีย์เก่าบนยอดเขากับทำเลที่มองเห็นสองทะเลพร้อมกัน",
      en: "An ancient hilltop chedi positioned to watch over two seas at once",
    },
    story: {
      th: "บนยอดเขาตังกวนมีเจดีย์และศาลาที่สร้างมาแต่โบราณ จุดนี้มองเห็นทั้งทะเลสาบสงขลาและอ่าวไทยพร้อมกัน นักประวัติศาสตร์ยังถกกันถึงเหตุผลเชิงยุทธศาสตร์และความเชื่อที่เลือกสร้างไว้ตรงนี้ ขึ้นไปชมพระอาทิตย์แล้วลองหาคำตอบด้วยตัวเอง",
      en: "Atop Khao Tang Kuan sit an ancient chedi and pavilion — a spot that overlooks both the Songkhla Lagoon and the Gulf of Thailand at once. Historians still debate the strategic and spiritual reasons it was built exactly here. Climb up for the view and decide for yourself.",
    },
  },
  {
    id: "central-mosque-reflection",
    type: "mystery",
    landmarkId: "central-mosque",
    title: { th: "เงาสะท้อน 'ทัชมาฮาลเมืองไทย'", en: "Reflection of the 'Thai Taj Mahal'" },
    teaser: {
      th: "มัสยิดกลางที่สะท้อนเงาสมบูรณ์แบบในสระน้ำ สัญลักษณ์พหุวัฒนธรรม",
      en: "A central mosque mirrored perfectly in its pool — an icon of plural culture",
    },
    story: {
      th: "มัสยิดกลางสงขลาได้ฉายา 'ทัชมาฮาลเมืองไทย' จากสถาปัตยกรรมงดงามและเงาสะท้อนในสระน้ำเบื้องหน้า เป็นภาพแทนสังคมพหุวัฒนธรรมไทย-จีน-มลายูที่อยู่ร่วมกันในสงขลามาช้านาน ยามเย็นแสงทองตกกระทบผิวน้ำคือช่วงเวลาที่งดงามที่สุด",
      en: "Songkhla Central Mosque earned the nickname 'Thai Taj Mahal' for its graceful architecture mirrored in the reflecting pool. It embodies the Thai–Chinese–Malay plural society that has shared Songkhla for centuries. Golden hour on the water is its most beautiful moment.",
    },
  },
];

// Attach resolved coordinates (from the linked landmark, or the story's own).
export const LEGENDS = RAW.map((s) => {
  const lm = s.landmarkId ? landmarkById(s.landmarkId) : null;
  return {
    ...s,
    lat: s.lat ?? lm?.lat ?? null,
    lng: s.lng ?? lm?.lng ?? null,
    placeTh: lm?.th ?? null,
    placeEn: lm?.en ?? null,
  };
});

export const LEGEND_TYPES = ["legend", "ghost", "fortune", "mystery"];

export function legendById(id) {
  return LEGENDS.find((l) => l.id === id) || null;
}
