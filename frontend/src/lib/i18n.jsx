import { createContext, useCallback, useContext, useState } from "react";

const KEY = "travelsongkhla_lang";

export const STRINGS = {
  th: {
    // App shell
    "app.title": "เที่ยวสงขลา",
    "app.greeting": "สวัสดี {name}",
    "app.defaultName": "นักเที่ยว",
    "app.loading": "กำลังโหลด...",
    "tab.home": "หน้าหลัก",
    "tab.chat": "น้องเที่ยว",
    "tab.quests": "เควส",
    "tab.recommend": "แนะนำ",
    "tab.profile": "รางวัล",

    // Levels
    "level.Beginner": "นักเที่ยวมือใหม่",
    "level.Explorer": "นักสำรวจ",
    "level.Adventurer": "นักผจญภัย",
    "level.Master": "เซียนสงขลา",

    // Landing
    "landing.subtitle": "ผจญภัยทั่วสงขลากับน้องเที่ยว ไกด์ AI ส่วนตัวของคุณ",
    "landing.feat.chat.title": "น้องเที่ยว",
    "landing.feat.chat.desc": "ไกด์ AI ตอบทุกเรื่องสงขลา",
    "landing.feat.quest.title": "เควสผจญภัย",
    "landing.feat.quest.desc": "ทำภารกิจสะสม XP เลเวลอัป",
    "landing.feat.places.title": "ที่เที่ยวเด็ด",
    "landing.feat.places.desc": "แนะนำตามสไตล์ที่คุณชอบ",
    "landing.feat.rewards.title": "สะสมรางวัล",
    "landing.feat.rewards.desc": "ปลดล็อกตราสัญลักษณ์หายาก",
    "landing.cta": "เริ่มผจญภัย 🚀",

    // Login
    "login.subtitle": "เข้าสู่ระบบเพื่อเริ่มผจญภัยกับน้องเที่ยว",
    "login.google": "เข้าสู่ระบบด้วย Google",
    "login.guestGhost": "ข้ามไปก่อน (ใช้แบบ guest)",
    "login.guestPrimary": "เริ่มเลย 🚀",

    // Onboarding
    "onboard.subtitle": "ผจญภัยกับน้องเที่ยว ไกด์ AI ประจำเมือง",
    "onboard.greeting": "น้องเที่ยวกำลังทักทาย...",
    "onboard.q.categories": "ชอบเที่ยวแบบไหน?",
    "onboard.q.categories.hint": "(เลือกได้หลายอย่าง)",
    "onboard.q.vibe": "บรรยากาศที่ชอบ",
    "onboard.q.budget": "งบประมาณ",
    "onboard.q.companion": "มากับใคร",
    "onboard.q.vibe_budget": "สไตล์และงบประมาณ",
    "onboard.q.companion_duration": "ข้อมูลทริปของคุณ",
    "onboard.q.duration": "วันที่มาเที่ยว",
    "onboard.date.start": "วันเริ่มเที่ยว",
    "onboard.date.end": "วันสุดท้าย",
    "onboard.date.days": "เที่ยว {n} วัน",
    "onboard.date.invalid": "วันสุดท้ายต้องไม่ก่อนวันเริ่ม",
    "onboard.date.festival": "🎉 ช่วงนี้ตรงกับเทศกาล {names}",
    "onboard.q.interests": "ความสนใจพิเศษ",
    "onboard.q.interests.hint": "(เลือกได้หลายอย่าง ไม่บังคับ)",
    "onboard.next": "ถัดไป →",
    "onboard.back": "← ย้อนกลับ",
    "onboard.cta": "เริ่มผจญภัย 🎯",
    "interest.photo": "📸 ถ่ายรูป",
    "interest.history": "🏛️ ประวัติศาสตร์",
    "interest.shopping": "🛍️ ช้อปปิ้ง",
    "interest.spa": "💆 สปา/นวด",
    "interest.sport": "⚽ กีฬา",
    "interest.nightlife": "🌙 ยามค่ำคืน",
    "cat.food": "อาหาร",
    "cat.souvenir": "ของฝาก",
    "cat.temple": "วัด",
    "cat.nature": "ธรรมชาติ",
    "cat.market": "ตลาด",
    "cat.cafe": "คาเฟ่",
    "vibe.calm": "เงียบสงบ",
    "vibe.lively": "คึกคัก",
    "vibe.adventure": "ผจญภัย",
    "budget.cheap": "ประหยัด",
    "budget.medium": "ปานกลาง",
    "budget.luxury": "หรูหรา",
    "companion.solo": "คนเดียว",
    "companion.couple": "คู่",
    "companion.family": "ครอบครัว",
    "companion.friends": "เพื่อน",

    // Home
    "home.yourLevel": "เลเวลของคุณ",
    "home.toNext": "อีก {xp} XP สู่ {level}",
    "home.maxLevel": "เลเวลสูงสุดแล้ว! 🎉",
    "home.questsDone": "เควสสำเร็จ",
    "home.rewardsGot": "รางวัลที่ได้",
    "home.activeQuest": "เควสที่กำลังทำ",
    "home.continueQuest": "ทำเควสต่อ 🎯",
    "home.noActiveQuest": "ยังไม่มีเควสที่กำลังทำ",
    "home.noActiveQuestDesc": "รับภารกิจใหม่แล้วออกผจญภัยกันเลย!",
    "home.getQuest": "รับเควสใหม่ 🎯",
    "home.keepGoing": "ไปต่อกันเลย",
    "home.link.chat.title": "คุยกับน้องเที่ยว",
    "home.link.chat.desc": "ถามอะไรก็ได้เรื่องสงขลา",
    "home.link.quests.title": "เควสผจญภัย",
    "home.link.quests.desc": "ทำภารกิจสะสม XP",
    "home.link.recommend.title": "ที่เที่ยวแนะนำ",
    "home.link.recommend.desc": "ตามสไตล์ที่คุณชอบ",
    "home.link.profile.title": "รางวัลของฉัน",
    "home.link.profile.desc": "ตราสัญลักษณ์ที่สะสม",

    // Chat
    "chat.empty": "ทักน้องเที่ยวได้เลย!",
    "chat.placeholder": "พิมพ์ข้อความ...",
    "chat.send": "ส่ง",
    "chat.clear": "ล้างแชท",
    "chat.starter.1": "แนะนำของกินเด็ดๆ หน่อย 🍜",
    "chat.starter.2": "มีที่เที่ยวเงียบๆ ไหม",
    "chat.starter.3": "ของฝากสงขลาซื้ออะไรดี",

    // Quests
    "quest.readyTitle": "พร้อมออกผจญภัยไหม?",
    "quest.readyDesc": "รับเควสจากน้องเที่ยว ไปสำรวจสงขลา แล้วเก็บ XP กับ badge!",
    "quest.rolling": "กำลังสุ่มเควส...",
    "quest.getNew": "รับเควสใหม่ ✨",
    "quest.thinking": "น้องเที่ยวกำลังคิดเควส...",
    "quest.objective": "เป้าหมาย",
    "quest.hint": "คำใบ้",
    "quest.reward": "รางวัล",
    "quest.doneQ": "ทำเควสเสร็จแล้ว? ส่งหลักฐานเลย!",
    "quest.descPlaceholder": "เล่าให้น้องเที่ยวฟังว่าเจออะไรบ้าง...",
    "quest.attachPhoto": "แนบรูป",
    "quest.optional": "ไม่บังคับ",
    "quest.verifying": "กำลังตรวจสอบ...",
    "quest.submit": "ส่งยืนยันเควส ✅",
    "quest.success": "🎉 สำเร็จ!",
    "quest.almost": "เกือบแล้ว!",
    "quest.confidence": "ความมั่นใจ",
    "quest.next": "รับเควสต่อไป →",
    "quest.skip": "ข้ามเควสนี้",
    "quest.checkin": "เช็คอินด้วย GPS",
    "quest.checkingIn": "กำลังหาตำแหน่ง...",
    "quest.checkedIn": "เช็คอินแล้ว ✓",
    "quest.geoError": "เปิด GPS ไม่ได้ ลองใหม่อีกครั้ง",
    "quest.nearby": "คุณอยู่ใกล้! ({m} ม.) ✅",
    "quest.tooFar": "ยังไกลอยู่ ({km} กม.) — ไปให้ถึงสถานที่ก่อนนะ",
    "daily.title": "เควสประจำวัน",
    "daily.subtitle": "ทำสำเร็จทุกวันเพื่อสะสมสตรีค 🔥",
    "daily.streak": "สตรีค {n} วัน",
    "daily.noStreak": "ยังไม่มีสตรีค เริ่มวันนี้เลย!",
    "daily.get": "รับเควสวันนี้ 🌅",
    "daily.rolling": "กำลังสุ่มเควสวันนี้...",
    "daily.doneToday": "ทำเควสวันนี้สำเร็จแล้ว! 🎉",
    "daily.comeBack": "กลับมาใหม่พรุ่งนี้เพื่อรักษาสตรีค",
    "daily.badge": "รายวัน",

    // Recommend
    "rec.title": "แนะนำเฉพาะคุณ",
    "rec.basedOn": "อิงจากความชอบ:",
    "rec.searching": "กำลังค้นหา...",
    "rec.reroll": "สุ่มใหม่อีกครั้ง 🔄",
    "rec.ask": "ขอคำแนะนำ 3 ที่",
    "rec.picking": "น้องเที่ยวกำลังเลือกที่เด็ดๆ...",
    "rec.highlight": "เด่น:",
    "rec.tip": "ทิป:",
    "rec.openMaps": "เปิดใน Google Maps",
    "rec.modePlaces": "ที่เที่ยว",
    "rec.modeSouvenirs": "ของฝาก",
    "rec.souvenirTitle": "ของฝากสงขลา",
    "rec.souvenirDesc": "ของฝากอัตลักษณ์เฉพาะถิ่น",
    "rec.askSouvenir": "แนะนำของฝาก",
    "rec.identity": "อัตลักษณ์:",

    // Achievements
    "ach.yourLevel": "เลเวลของคุณ",
    "ach.toNext": "อีก {xp} XP → {level}",
    "ach.max": "เลเวลสูงสุด! 🏆",
    "ach.questsDone": "เควสสำเร็จ",
    "ach.badgesGot": "badge ที่ได้",
    "ach.heading": "Achievements",
    "ach.noBadges": "ยังไม่มี badge — ไปทำเควสให้สำเร็จเพื่อปลดล็อก!",
    "ach.history": "ประวัติเควส",
    "ach.noHistory": "ยังไม่มีประวัติ — เริ่มผจญภัยกันเลย!",
    "ach.share": "แชร์",
    "ach.shareText": "ฉันปลดล็อก badge “{title}” ใน เที่ยวสงขลา! 🏅 {desc}",
    "ach.copied": "คัดลอกแล้ว! ไปแชร์ได้เลย ✨",
    "ach.logout": "ออกจากระบบ",
    "ach.login": "เข้าสู่ระบบด้วย Google",
    "ach.resetConfirm": "ล้างความคืบหน้าทั้งหมด?",
    "ach.reset": "รีเซ็ตความคืบหน้า",

    // Leaderboard
    "lb.title": "🏆 อันดับนักเที่ยว",
    "lb.loading": "กำลังโหลดอันดับ...",
    "lb.empty": "ยังไม่มีใครติดอันดับ — เป็นคนแรกเลย!",
    "lb.you": "คุณ",
    "lb.refresh": "รีเฟรช",
    "lb.loginToJoin": "ล็อกอินด้วย Google เพื่อเก็บคะแนนและติดอันดับ",
    "lb.notRanked": "คะแนนของคุณ (กำลังอัปเดตอันดับ)",

    // Weather
    "weather.location": "สงขลาตอนนี้",
    "weather.high": "สูง",
    "weather.low": "ต่ำ",

    // Festival quests
    "fest.activeTitle": "🎉 เทศกาล{name}!",
    "fest.activeDesc": "รับเควสพิเศษประจำเทศกาลกันเลย",
    "fest.soonTitle": "เทศกาล{name}กำลังจะมา",
    "fest.soonDesc": "เริ่ม {date} — ลองรับเควสธีมเทศกาลก่อนใคร",
    "fest.getQuest": "รับเควสเทศกาล ✨",
  },
  en: {
    // App shell
    "app.title": "Travel Songkhla",
    "app.greeting": "Hi {name}",
    "app.defaultName": "Traveler",
    "app.loading": "Loading...",
    "tab.home": "Home",
    "tab.chat": "Nong Tiew",
    "tab.quests": "Quests",
    "tab.recommend": "For You",
    "tab.profile": "Rewards",

    // Levels
    "level.Beginner": "Beginner",
    "level.Explorer": "Explorer",
    "level.Adventurer": "Adventurer",
    "level.Master": "Songkhla Master",

    // Landing
    "landing.subtitle": "Adventure across Songkhla with Nong Tiew, your personal AI guide",
    "landing.feat.chat.title": "Nong Tiew",
    "landing.feat.chat.desc": "An AI guide for everything Songkhla",
    "landing.feat.quest.title": "Adventure Quests",
    "landing.feat.quest.desc": "Complete missions, earn XP, level up",
    "landing.feat.places.title": "Top Spots",
    "landing.feat.places.desc": "Recommended to match your style",
    "landing.feat.rewards.title": "Collect Rewards",
    "landing.feat.rewards.desc": "Unlock rare badges",
    "landing.cta": "Start Adventure 🚀",

    // Login
    "login.subtitle": "Sign in to start your adventure with Nong Tiew",
    "login.google": "Sign in with Google",
    "login.guestGhost": "Skip for now (guest)",
    "login.guestPrimary": "Let's go 🚀",

    // Onboarding
    "onboard.subtitle": "Adventure with Nong Tiew, the city's AI guide",
    "onboard.greeting": "Nong Tiew is saying hi...",
    "onboard.q.categories": "What do you enjoy?",
    "onboard.q.categories.hint": "(choose multiple)",
    "onboard.q.vibe": "Preferred vibe",
    "onboard.q.budget": "Budget",
    "onboard.q.companion": "Who's with you",
    "onboard.q.vibe_budget": "Vibe & Budget",
    "onboard.q.companion_duration": "Your trip details",
    "onboard.q.duration": "Travel dates",
    "onboard.date.start": "Arrival date",
    "onboard.date.end": "Last day",
    "onboard.date.days": "{n}-day trip",
    "onboard.date.invalid": "The last day can't be before the arrival date",
    "onboard.date.festival": "🎉 Your dates fall on {names}",
    "onboard.q.interests": "Special interests",
    "onboard.q.interests.hint": "(optional, choose multiple)",
    "onboard.next": "Next →",
    "onboard.back": "← Back",
    "onboard.cta": "Start Adventure 🎯",
    "interest.photo": "📸 Photography",
    "interest.history": "🏛️ History",
    "interest.shopping": "🛍️ Shopping",
    "interest.spa": "💆 Spa & Massage",
    "interest.sport": "⚽ Sports",
    "interest.nightlife": "🌙 Nightlife",
    "cat.food": "Food",
    "cat.souvenir": "Souvenirs",
    "cat.temple": "Temples",
    "cat.nature": "Nature",
    "cat.market": "Markets",
    "cat.cafe": "Cafés",
    "vibe.calm": "Calm",
    "vibe.lively": "Lively",
    "vibe.adventure": "Adventurous",
    "budget.cheap": "Budget",
    "budget.medium": "Moderate",
    "budget.luxury": "Luxury",
    "companion.solo": "Solo",
    "companion.couple": "Couple",
    "companion.family": "Family",
    "companion.friends": "Friends",

    // Home
    "home.yourLevel": "Your level",
    "home.toNext": "{xp} XP to {level}",
    "home.maxLevel": "Max level reached! 🎉",
    "home.questsDone": "Quests done",
    "home.rewardsGot": "Rewards earned",
    "home.activeQuest": "Active quest",
    "home.continueQuest": "Continue quest 🎯",
    "home.noActiveQuest": "No active quest yet",
    "home.noActiveQuestDesc": "Grab a new mission and start exploring!",
    "home.getQuest": "Get a quest 🎯",
    "home.keepGoing": "Keep going",
    "home.link.chat.title": "Chat with Nong Tiew",
    "home.link.chat.desc": "Ask anything about Songkhla",
    "home.link.quests.title": "Adventure Quests",
    "home.link.quests.desc": "Complete missions for XP",
    "home.link.recommend.title": "Recommended Spots",
    "home.link.recommend.desc": "Matched to your style",
    "home.link.profile.title": "My Rewards",
    "home.link.profile.desc": "Badges you've collected",

    // Chat
    "chat.empty": "Say hi to Nong Tiew!",
    "chat.placeholder": "Type a message...",
    "chat.send": "Send",
    "chat.clear": "Clear chat",
    "chat.starter.1": "Recommend some great food 🍜",
    "chat.starter.2": "Any quiet spots to visit?",
    "chat.starter.3": "What souvenirs should I buy?",

    // Quests
    "quest.readyTitle": "Ready for an adventure?",
    "quest.readyDesc": "Get a quest from Nong Tiew, explore Songkhla, and earn XP and badges!",
    "quest.rolling": "Rolling a quest...",
    "quest.getNew": "Get a new quest ✨",
    "quest.thinking": "Nong Tiew is thinking up a quest...",
    "quest.objective": "Objective",
    "quest.hint": "Hint",
    "quest.reward": "Reward",
    "quest.doneQ": "Finished the quest? Submit your proof!",
    "quest.descPlaceholder": "Tell Nong Tiew what you found...",
    "quest.attachPhoto": "Attach photo",
    "quest.optional": "optional",
    "quest.verifying": "Verifying...",
    "quest.submit": "Submit quest ✅",
    "quest.success": "🎉 Success!",
    "quest.almost": "Almost there!",
    "quest.confidence": "confidence",
    "quest.next": "Next quest →",
    "quest.skip": "Skip this quest",
    "quest.checkin": "Check in with GPS",
    "quest.checkingIn": "Finding your location...",
    "quest.checkedIn": "Checked in ✓",
    "quest.geoError": "Couldn't get GPS. Please try again.",
    "quest.nearby": "You're here! ({m} m away) ✅",
    "quest.tooFar": "Still {km} km away — head to the location first",
    "daily.title": "Daily Quest",
    "daily.subtitle": "Complete one every day to build your streak 🔥",
    "daily.streak": "{n}-day streak",
    "daily.noStreak": "No streak yet — start today!",
    "daily.get": "Get today's quest 🌅",
    "daily.rolling": "Rolling today's quest...",
    "daily.doneToday": "Today's quest is done! 🎉",
    "daily.comeBack": "Come back tomorrow to keep your streak",
    "daily.badge": "Daily",

    // Recommend
    "rec.title": "Just for you",
    "rec.basedOn": "Based on:",
    "rec.searching": "Searching...",
    "rec.reroll": "Shuffle again 🔄",
    "rec.ask": "Get 3 recommendations",
    "rec.picking": "Nong Tiew is picking great spots...",
    "rec.highlight": "Highlight:",
    "rec.tip": "Tip:",
    "rec.openMaps": "Open in Google Maps",
    "rec.modePlaces": "Places",
    "rec.modeSouvenirs": "Souvenirs",
    "rec.souvenirTitle": "Songkhla souvenirs",
    "rec.souvenirDesc": "Local-identity gifts to take home",
    "rec.askSouvenir": "Suggest souvenirs",
    "rec.identity": "Identity:",

    // Achievements
    "ach.yourLevel": "Your level",
    "ach.toNext": "{xp} XP → {level}",
    "ach.max": "Max level! 🏆",
    "ach.questsDone": "Quests done",
    "ach.badgesGot": "badges earned",
    "ach.heading": "Achievements",
    "ach.noBadges": "No badges yet — complete quests to unlock!",
    "ach.history": "Quest history",
    "ach.noHistory": "No history yet — start your adventure!",
    "ach.share": "Share",
    "ach.shareText": "I unlocked the “{title}” badge in Travel Songkhla! 🏅 {desc}",
    "ach.copied": "Copied! Paste it anywhere to share ✨",
    "ach.logout": "Sign out",
    "ach.login": "Sign in with Google",
    "ach.resetConfirm": "Clear all progress?",
    "ach.reset": "Reset progress",

    // Leaderboard
    "lb.title": "🏆 Traveler ranking",
    "lb.loading": "Loading ranking...",
    "lb.empty": "No one ranked yet — be the first!",
    "lb.you": "you",
    "lb.refresh": "Refresh",
    "lb.loginToJoin": "Sign in with Google to save your score and join the ranking",
    "lb.notRanked": "Your score (ranking is updating)",

    // Weather
    "weather.location": "Songkhla now",
    "weather.high": "H",
    "weather.low": "L",

    // Festival quests
    "fest.activeTitle": "🎉 {name} is on!",
    "fest.activeDesc": "Grab a special festival quest",
    "fest.soonTitle": "{name} is coming up",
    "fest.soonDesc": "Starts {date} — try a themed quest early",
    "fest.getQuest": "Get a festival quest ✨",
  },
};

function loadLang() {
  const saved = localStorage.getItem(KEY);
  return saved === "en" || saved === "th" ? saved : "th";
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(loadLang);

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  const toggle = useCallback(() => setLang(lang === "th" ? "en" : "th"), [lang, setLang]);

  const t = useCallback(
    (key, vars) => {
      let s = STRINGS[lang][key] ?? STRINGS.th[key] ?? key;
      if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
      return s;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
