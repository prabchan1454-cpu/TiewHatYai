// "Know Hat Yai" local trivia quiz — gamified engagement that also teaches
// local knowledge. Extends the survey.js question shape with a correct `answer`
// index and an `explain` blurb shown after answering. Completing the quiz awards
// XP (and feeds the leaderboard via the shared progress XP).

export const QUIZ_XP_PER_CORRECT = 10; // XP per correct answer

export const QUIZ = [
  {
    id: "mermaid",
    q: { th: "รูปปั้นสัญลักษณ์คู่หาดสมิหลาคืออะไร?", en: "What is the icon statue of Samila Beach?" },
    options: [
      { th: "นางเงือกทอง", en: "Golden Mermaid" },
      { th: "พญานาค", en: "Naga serpent" },
      { th: "ปลาโลมา", en: "Dolphin" },
      { th: "เต่าทะเล", en: "Sea turtle" },
    ],
    answer: 0,
    explain: { th: "นางเงือกทองมาจากวรรณคดีพระอภัยมณี เป็นสัญลักษณ์ของสงขลา", en: "The Golden Mermaid, from the epic Phra Aphai Mani, is Songkhla's emblem." },
  },
  {
    id: "taj",
    q: { th: "มัสยิดใดได้ฉายา 'ทัชมาฮาลเมืองไทย'?", en: "Which mosque is nicknamed the 'Thai Taj Mahal'?" },
    options: [
      { th: "มัสยิดกลางสงขลา", en: "Songkhla Central Mosque" },
      { th: "มัสยิดกรือเซะ", en: "Krue Se Mosque" },
      { th: "มัสยิดต้นสน", en: "Ton Son Mosque" },
      { th: "มัสยิดกลางปัตตานี", en: "Pattani Central Mosque" },
    ],
    answer: 0,
    explain: { th: "มัสยิดกลางสงขลาสะท้อนเงาในสระน้ำ จึงได้ฉายานี้", en: "Songkhla Central Mosque mirrors in its pool, earning the nickname." },
  },
  {
    id: "bridge",
    q: { th: "สะพานข้ามทะเลสาบที่ยาวที่สุดในไทยชื่ออะไร?", en: "What is Thailand's longest lake-crossing bridge called?" },
    options: [
      { th: "สะพานติณสูลานนท์", en: "Tinsulanonda Bridge" },
      { th: "สะพานพระราม 8", en: "Rama VIII Bridge" },
      { th: "สะพานสารสิน", en: "Sarasin Bridge" },
      { th: "สะพานเทพหริรักษ์", en: "Thep Harirak Bridge" },
    ],
    answer: 0,
    explain: { th: "สะพานติณสูลานนท์เชื่อมแผ่นดินใหญ่กับเกาะยอและฝั่งสิงหนคร", en: "Tinsulanonda Bridge links the mainland to Ko Yo and Singhanakhon." },
  },
  {
    id: "market",
    q: { th: "ตลาดของฝากชื่อดังกลางเมืองหาดใหญ่คือ?", en: "The famous souvenir market in central Hat Yai is?" },
    options: [
      { th: "ตลาดกิมหยง", en: "Kim Yong Market" },
      { th: "ตลาดจตุจักร", en: "Chatuchak Market" },
      { th: "ตลาดโรงเกลือ", en: "Rong Kluea Market" },
      { th: "ตลาดวโรรส", en: "Warorot Market" },
    ],
    answer: 0,
    explain: { th: "ตลาดกิมหยงขายของฝาก ขนม และสินค้านำเข้าจากมาเลเซีย", en: "Kim Yong Market sells snacks, gifts and imports from Malaysia." },
  },
  {
    id: "waterfall",
    q: { th: "น้ำตกชื่อดังที่สายน้ำแยกคล้ายงาช้างคือ?", en: "Which famous waterfall splits like elephant tusks?" },
    options: [
      { th: "น้ำตกโตนงาช้าง", en: "Ton Nga Chang Waterfall" },
      { th: "น้ำตกทีลอซู", en: "Thi Lo Su Waterfall" },
      { th: "น้ำตกเอราวัณ", en: "Erawan Waterfall" },
      { th: "น้ำตกห้วยแก้ว", en: "Huai Kaeo Waterfall" },
    ],
    answer: 0,
    explain: { th: "‘โตนงาช้าง’ แปลว่าน้ำตกที่แยกเป็นงาช้าง อยู่เขตรักษาพันธุ์สัตว์ป่า", en: "'Ton Nga Chang' means the falls split into elephant tusks." },
  },
  {
    id: "viewpoint",
    q: { th: "จุดชมวิวเมืองหาดใหญ่บนเขาคอหงส์ขึ้นด้วยอะไร?", en: "How do you reach the Kho Hong hill viewpoint over Hat Yai?" },
    options: [
      { th: "เคเบิลคาร์ (กระเช้า)", en: "Cable car" },
      { th: "รถไฟฟ้า", en: "Sky train" },
      { th: "เรือ", en: "Boat" },
      { th: "บอลลูน", en: "Hot-air balloon" },
    ],
    answer: 0,
    explain: { th: "เคเบิลคาร์หาดใหญ่พาขึ้นชมวิวเมืองบนเขาคอหงส์", en: "The Hat Yai cable car carries you up Kho Hong hill for the city view." },
  },
  {
    id: "border",
    q: { th: "ด่านชายแดนไทย-มาเลเซียในสงขลาที่คนนิยมไปคือ?", en: "The popular Thai–Malaysia border crossing in Songkhla is?" },
    options: [
      { th: "ด่านนอก (ปาดังเบซาร์/สะเดา)", en: "Dan Nok (Padang Besar / Sadao)" },
      { th: "ด่านแม่สาย", en: "Mae Sai" },
      { th: "ด่านอรัญประเทศ", en: "Aranyaprathet" },
      { th: "ด่านเชียงของ", en: "Chiang Khong" },
    ],
    answer: 0,
    explain: { th: "ด่านนอก/สะเดาเป็นประตูการค้าและท่องเที่ยวสู่มาเลเซีย", en: "Dan Nok / Sadao is the trade and tourism gateway to Malaysia." },
  },
];
