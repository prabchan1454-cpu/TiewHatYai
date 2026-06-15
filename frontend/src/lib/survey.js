// "รู้จักสงขลามากแค่ไหน?" — a short self-assessment survey shown once after
// onboarding on first login. No right/wrong answers and no scoring; the
// responses just help น้องเที่ยว get a sense of the traveler.

export const SURVEY = [
  {
    id: "familiarity",
    q: { th: "โดยรวมแล้วคุณรู้จักสงขลาดีแค่ไหน?", en: "Overall, how well do you know Songkhla?" },
    options: [
      { th: "เพิ่งเริ่มรู้จัก", en: "Just getting to know it" },
      { th: "รู้บ้างเล็กน้อย", en: "A little" },
      { th: "รู้ดีพอสมควร", en: "Fairly well" },
      { th: "รู้จักเป็นอย่างดี", en: "Very well" },
    ],
  },
  {
    id: "visited",
    q: { th: "คุณเคยมาเที่ยวสงขลามาก่อนไหม?", en: "Have you visited Songkhla before?" },
    options: [
      { th: "ไม่เคย ครั้งแรก", en: "Never, this is my first time" },
      { th: "เคยมา 1–2 ครั้ง", en: "Once or twice" },
      { th: "มาหลายครั้งแล้ว", en: "Many times" },
      { th: "อาศัยอยู่ที่นี่", en: "I live here" },
    ],
  },
  {
    id: "food",
    q: { th: "คุ้นเคยกับอาหารพื้นเมืองสงขลาแค่ไหน?", en: "How familiar are you with local Songkhla food?" },
    options: [
      { th: "ไม่คุ้นเลย", en: "Not at all" },
      { th: "พอรู้จักบ้าง", en: "Somewhat" },
      { th: "คุ้นเคยดี", en: "Quite familiar" },
      { th: "ชอบเป็นพิเศษ", en: "I love it" },
    ],
  },
  {
    id: "oldtown",
    q: { th: "รู้จักย่านเมืองเก่าสงขลามากแค่ไหน?", en: "How well do you know Songkhla's old town?" },
    options: [
      { th: "ไม่รู้จัก", en: "Not at all" },
      { th: "เคยได้ยินมาบ้าง", en: "Heard of it" },
      { th: "เคยไปมาแล้ว", en: "Been there" },
      { th: "รู้จักดีมาก", en: "Know it very well" },
    ],
  },
  {
    id: "interest",
    q: { th: "อยากให้น้องเที่ยวช่วยแนะนำด้านไหนมากที่สุด?", en: "What would you most like Nong Tiew to recommend?" },
    options: [
      { th: "ที่เที่ยว", en: "Places to go" },
      { th: "ของกิน", en: "Food" },
      { th: "ของฝาก", en: "Souvenirs" },
      { th: "ประวัติศาสตร์·วัฒนธรรม", en: "History & culture" },
    ],
  },
];
