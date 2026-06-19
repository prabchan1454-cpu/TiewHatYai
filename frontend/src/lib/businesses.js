// Self-service business directory — local shops/communities register their own
// listings (judge feedback: let business owners create & manage content, show
// economic value). Mirrors the checkins.js Firestore pattern, but falls back to
// localStorage when Firestore isn't configured so the directory is always
// demoable (and works offline as a guest).
import { firestoreEnabled, loadFirestore } from "./firebase";

const COLLECTION = "businesses";
const LOCAL_KEY = "tiewhatyai_businesses_v1";

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(list) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

// Register a business listing. Uses Firestore when available, else localStorage.
// Returns true on success.
export async function addBusiness(biz) {
  const record = {
    name: biz.name || "",
    category: biz.category || "shop",
    area: biz.area || "",
    description: biz.description || "",
    promo: biz.promo || "",
    phone: biz.phone || "",
    image: biz.image || null,
    ownerUid: biz.ownerUid || null,
    ownerName: biz.ownerName || "",
    views: 0,
  };

  if (firestoreEnabled && biz.ownerUid) {
    const fb = await loadFirestore();
    if (fb?.db) {
      const { collection, addDoc, serverTimestamp } = fb.fsMod;
      try {
        await addDoc(collection(fb.db, COLLECTION), { ...record, createdAt: serverTimestamp() });
        return true;
      } catch (e) {
        console.error("addBusiness (firestore) failed:", e);
        // fall through to local
      }
    }
  }

  // Local fallback
  const list = readLocal();
  list.unshift({ ...record, id: `local-${Date.now()}`, createdAt: { seconds: Date.now() / 1000 } });
  writeLocal(list);
  return true;
}

// Fetch listings — merges Firestore + local (local first so a just-added guest
// listing shows immediately). De-dupes by id.
export async function fetchBusinesses(n = 50) {
  const local = readLocal();
  let remote = [];
  if (firestoreEnabled) {
    const fb = await loadFirestore();
    if (fb?.db) {
      const { collection, query, orderBy, limit, getDocs } = fb.fsMod;
      try {
        const qy = query(collection(fb.db, COLLECTION), orderBy("createdAt", "desc"), limit(n));
        const snap = await getDocs(qy);
        remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        // Expected until the `businesses` rules are published to Firestore;
        // we fall back to the local directory so the feature still works.
        console.warn("fetchBusinesses: using local fallback —", e?.code || e);
      }
    }
  }
  const seen = new Set();
  return [...local, ...remote].filter((b) => (seen.has(b.id) ? false : seen.add(b.id)));
}

export { firestoreEnabled };
