const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export const api = {
  onboard: () => post("/api/onboard"),
  chat: (messages) => post("/api/chat", { messages }),
  quest: (payload) => post("/api/quest", payload),
  recommend: (payload) => post("/api/recommend", payload),
  verify: (payload) => post("/api/verify", payload),
  badge: (payload) => post("/api/badge", payload),
};
