import { firestoreEnabled, loadFirebase } from "./firebase";

const COLLECTION = "checkins";

// Post a community check-in. Requires a signed-in user (real identity, so
// others can see who went). Best-effort: returns false if Firestore is off
// or the write is rejected. `image` is a small base64 data-URL thumbnail.
export async function postCheckin({ user, landmarkId, place, lat, lng, message, image }) {
  if (!firestoreEnabled || !user?.uid) return false;
  const fb = await loadFirebase();
  if (!fb?.db) return false;
  const { collection, addDoc, serverTimestamp } = fb.fsMod;
  try {
    await addDoc(collection(fb.db, COLLECTION), {
      uid: user.uid,
      displayName: user.displayName || "นักเที่ยว",
      photoURL: user.photoURL || null,
      landmarkId: landmarkId || null,
      place: place || "",
      lat: typeof lat === "number" ? lat : null,
      lng: typeof lng === "number" ? lng : null,
      message: message || "",
      image: image || null,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error("postCheckin failed:", e);
    return false;
  }
}

// Read the most-recent community check-ins. Returns [] on any failure so the
// feed renders an empty state instead of crashing.
export async function fetchCheckins(n = 50) {
  if (!firestoreEnabled) return [];
  const fb = await loadFirebase();
  if (!fb?.db) return [];
  const { collection, query, orderBy, limit, getDocs } = fb.fsMod;
  try {
    const q = query(collection(fb.db, COLLECTION), orderBy("createdAt", "desc"), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("fetchCheckins failed:", e);
    return [];
  }
}

// ── Likes & replies ─────────────────────────────────────────────────────────
// Local-first so the social loop works for guests and offline; when Firestore
// is available we also best-effort persist a like increment / a reply doc.
const LIKES_KEY = "tiewhatyai_likes_v1";    // { [postId]: true } — posts I liked
const REPLIES_KEY = "tiewhatyai_replies_v1"; // { [postId]: [{ name, text, at }] }

function readMap(key) {
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
}
function writeMap(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch { /* ignore */ }
}

export function isLiked(postId) {
  return !!readMap(LIKES_KEY)[postId];
}

// Toggle a like. Returns the new liked state. Updates local store immediately
// and best-effort increments the post's `likes` field in Firestore.
export async function toggleLike(postId, user) {
  const map = readMap(LIKES_KEY);
  const now = !map[postId];
  if (now) map[postId] = true; else delete map[postId];
  writeMap(LIKES_KEY, map);

  if (firestoreEnabled && user?.uid) {
    const fb = await loadFirebase();
    if (fb?.db) {
      const { doc, updateDoc, increment } = fb.fsMod;
      try {
        await updateDoc(doc(fb.db, COLLECTION, postId), { likes: increment(now ? 1 : -1) });
      } catch (e) {
        // Non-fatal: the like still counts locally.
        console.warn("toggleLike (firestore) skipped:", e?.code || e);
      }
    }
  }
  return now;
}

// The like count to display = backend base + (1 if I liked it locally).
export function displayLikes(post) {
  return (post.likes || 0) + (isLiked(post.id) ? 1 : 0);
}

export function getLocalReplies(postId) {
  return readMap(REPLIES_KEY)[postId] || [];
}

// Add a reply. Stored locally; best-effort mirrored to a Firestore subcollection.
export async function addReply(postId, user, text) {
  const t = (text || "").trim();
  if (!t) return [];
  const map = readMap(REPLIES_KEY);
  const entry = { name: user?.displayName || "นักเที่ยว", text: t, at: Date.now() };
  map[postId] = [...(map[postId] || []), entry];
  writeMap(REPLIES_KEY, map);

  if (firestoreEnabled && user?.uid) {
    const fb = await loadFirebase();
    if (fb?.db) {
      const { collection, addDoc, serverTimestamp } = fb.fsMod;
      try {
        await addDoc(collection(fb.db, COLLECTION, postId, "replies"), {
          uid: user.uid, name: entry.name, text: t, createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("addReply (firestore) skipped:", e?.code || e);
      }
    }
  }
  return map[postId];
}

export { firestoreEnabled };
