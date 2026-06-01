import { createContext, useCallback, useContext, useState } from "react";

const KEY = "tiewhatyai_lang";

export const STRINGS = {
  th: {
    // App shell
    "app.title": "เที่ยวหาดใหญ่",
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
    "level.Master": "เซียนหาดใหญ่",

    // Landing
    "landing.subtitle": "ผจญภัยทั่วเมืองหาดใหญ่กับน้องเที่ยว ไกด์ AI ส่วนตัวของคุณ",
    "landing.feat.chat.title": "น้องเที่ยว",
    "landing.feat.chat.desc": "ไกด์ AI ตอบทุกเรื่องหาดใหญ่",
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
    "onboard.cta": "เริ่มผจญภัย 🎯",
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
    "home.link.chat.desc": "ถามอะไรก็ได้เรื่องหาดใหญ่",
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
    "chat.starter.1": "แนะนำของกินเด็ดๆ หน่อย 🍜",
    "chat.starter.2": "มีที่เที่ยวเงียบๆ ไหม",
    "chat.starter.3": "ของฝากหาดใหญ่ซื้ออะไรดี",

    // Quests
    "quest.readyTitle": "พร้อมออกผจญภัยไหม?",
    "quest.readyDesc": "รับเควสจากน้องเที่ยว ไปสำรวจหาดใหญ่ แล้วเก็บ XP กับ badge!",
    "quest.rolling": "กำลังสุ่มเควส...",
    "quest.getNew": "รับเควสใหม่ ✨",
    "quest.thinking": "น้องเที่ยวกำลังคิดเควส...",
    "quest.objective": "🎯 เป้าหมาย",
    "quest.hint": "🔍 คำใบ้",
    "quest.reward": "🏅 รางวัล:",
    "quest.doneQ": "ทำเควสเสร็จแล้ว? ส่งหลักฐานเลย!",
    "quest.descPlaceholder": "เล่าให้น้องเที่ยวฟังว่าเจออะไรบ้าง...",
    "quest.attachPhoto": "📷 แนบรูป",
    "quest.optional": "ไม่บังคับ",
    "quest.verifying": "กำลังตรวจสอบ...",
    "quest.submit": "ส่งยืนยันเควส ✅",
    "quest.success": "🎉 สำเร็จ!",
    "quest.almost": "เกือบแล้ว!",
    "quest.confidence": "ความมั่นใจ",
    "quest.next": "รับเควสต่อไป →",
    "quest.skip": "ข้ามเควสนี้",
    "daily.title": "เควสประจำวัน",
    "daily.subtitle": "ทำสำเร็จทุกวันเพื่อสะสมสตรีค 🔥",
    "daily.streak": "สตรีค {n} วัน 🔥",
    "daily.noStreak": "ยังไม่มีสตรีค เริ่มวันนี้เลย!",
    "daily.get": "รับเควสวันนี้ 🌅",
    "daily.rolling": "กำลังสุ่มเควสวันนี้...",
    "daily.doneToday": "ทำเควสวันนี้สำเร็จแล้ว! 🎉",
    "daily.comeBack": "กลับมาใหม่พรุ่งนี้เพื่อรักษาสตรีค",
    "daily.badge": "รายวัน",

    // Recommend
    "rec.title": "แนะนำเฉพาะคุณ ⭐",
    "rec.basedOn": "อิงจากความชอบ:",
    "rec.searching": "กำลังค้นหา...",
    "rec.reroll": "สุ่มใหม่อีกครั้ง 🔄",
    "rec.ask": "ขอคำแนะนำ 3 ที่",
    "rec.picking": "น้องเที่ยวกำลังเลือกที่เด็ดๆ...",
    "rec.highlight": "เด่น:",
    "rec.tip": "ทิป:",
    "rec.openMaps": "🗺️ เปิดใน Google Maps",

    // Achievements
    "ach.yourLevel": "เลเวลของคุณ",
    "ach.toNext": "อีก {xp} XP → {level}",
    "ach.max": "เลเวลสูงสุด! 🏆",
    "ach.questsDone": "เควสสำเร็จ",
    "ach.badgesGot": "badge ที่ได้",
    "ach.heading": "🏅 Achievements",
    "ach.noBadges": "ยังไม่มี badge — ไปทำเควสให้สำเร็จเพื่อปลดล็อก!",
    "ach.history": "📜 ประวัติเควส",
    "ach.noHistory": "ยังไม่มีประวัติ — เริ่มผจญภัยกันเลย!",
    "ach.logout": "ออกจากระบบ",
    "ach.login": "เข้าสู่ระบบด้วย Google",
    "ach.resetConfirm": "ล้างความคืบหน้าทั้งหมด?",
    "ach.reset": "รีเซ็ตความคืบหน้า",
  },
  en: {
    // App shell
    "app.title": "Explore Hat Yai",
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
    "level.Master": "Hat Yai Master",

    // Landing
    "landing.subtitle": "Adventure across Hat Yai with Nong Tiew, your personal AI guide",
    "landing.feat.chat.title": "Nong Tiew",
    "landing.feat.chat.desc": "An AI guide for everything Hat Yai",
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
    "onboard.cta": "Start Adventure 🎯",
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
    "home.link.chat.desc": "Ask anything about Hat Yai",
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
    "chat.starter.1": "Recommend some great food 🍜",
    "chat.starter.2": "Any quiet spots to visit?",
    "chat.starter.3": "What souvenirs should I buy?",

    // Quests
    "quest.readyTitle": "Ready for an adventure?",
    "quest.readyDesc": "Get a quest from Nong Tiew, explore Hat Yai, and earn XP and badges!",
    "quest.rolling": "Rolling a quest...",
    "quest.getNew": "Get a new quest ✨",
    "quest.thinking": "Nong Tiew is thinking up a quest...",
    "quest.objective": "🎯 Objective",
    "quest.hint": "🔍 Hint",
    "quest.reward": "🏅 Reward:",
    "quest.doneQ": "Finished the quest? Submit your proof!",
    "quest.descPlaceholder": "Tell Nong Tiew what you found...",
    "quest.attachPhoto": "📷 Attach photo",
    "quest.optional": "optional",
    "quest.verifying": "Verifying...",
    "quest.submit": "Submit quest ✅",
    "quest.success": "🎉 Success!",
    "quest.almost": "Almost there!",
    "quest.confidence": "confidence",
    "quest.next": "Next quest →",
    "quest.skip": "Skip this quest",
    "daily.title": "Daily Quest",
    "daily.subtitle": "Complete one every day to build your streak 🔥",
    "daily.streak": "{n}-day streak 🔥",
    "daily.noStreak": "No streak yet — start today!",
    "daily.get": "Get today's quest 🌅",
    "daily.rolling": "Rolling today's quest...",
    "daily.doneToday": "Today's quest is done! 🎉",
    "daily.comeBack": "Come back tomorrow to keep your streak",
    "daily.badge": "Daily",

    // Recommend
    "rec.title": "Just for you ⭐",
    "rec.basedOn": "Based on:",
    "rec.searching": "Searching...",
    "rec.reroll": "Shuffle again 🔄",
    "rec.ask": "Get 3 recommendations",
    "rec.picking": "Nong Tiew is picking great spots...",
    "rec.highlight": "Highlight:",
    "rec.tip": "Tip:",
    "rec.openMaps": "🗺️ Open in Google Maps",

    // Achievements
    "ach.yourLevel": "Your level",
    "ach.toNext": "{xp} XP → {level}",
    "ach.max": "Max level! 🏆",
    "ach.questsDone": "Quests done",
    "ach.badgesGot": "badges earned",
    "ach.heading": "🏅 Achievements",
    "ach.noBadges": "No badges yet — complete quests to unlock!",
    "ach.history": "📜 Quest history",
    "ach.noHistory": "No history yet — start your adventure!",
    "ach.logout": "Sign out",
    "ach.login": "Sign in with Google",
    "ach.resetConfirm": "Clear all progress?",
    "ach.reset": "Reset progress",
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
