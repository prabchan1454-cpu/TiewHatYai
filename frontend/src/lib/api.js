const BASE = import.meta.env.VITE_API_BASE_URL || "";

function currentLang() {
  const v = localStorage.getItem("travelsongkhla_lang");
  return v === "en" ? "en" : "th";
}

// Users should never see "HTTP 500" or "Failed to fetch" — surface every
// failure as น้องเที่ยว apologising in the user's language instead.
function friendlyError() {
  return new Error(
    currentLang() === "en"
      ? "Nong Tiew can't connect right now — please try again in a moment 🙏"
      : "น้องเที่ยวติดต่อไม่ได้ชั่วคราว ลองใหม่อีกครั้งนะคะ 🙏"
  );
}

async function post(path, body) {
  const payload = { ...(body || {}), lang: currentLang() };
  let res;
  try {
    res = await fetch(BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error(`POST ${path} network error:`, e);
    throw friendlyError();
  }
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      /* ignore */
    }
    console.error(`POST ${path} failed:`, detail);
    throw friendlyError();
  }
  return res.json();
}

export const api = {
  onboard: () => post("/api/onboard"),
  chat: (messages) => post("/api/chat", { messages }),
  quest: (payload) => post("/api/quest", payload),
  recommend: (payload) => post("/api/recommend", payload),
  souvenirs: (payload) => post("/api/souvenirs", payload),
  verify: (payload) => post("/api/verify", payload),
  badge: (payload) => post("/api/badge", payload),
};
