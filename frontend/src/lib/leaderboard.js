import { firestoreEnabled, loadFirebase } from "./firebase";

const COLLECTION = "leaderboard";

// Write (or update) the signed-in user's row. Best-effort: if Firestore isn't
// enabled or the rules reject the write, we swallow the error — the leaderboard
// is a bonus, never a blocker for gameplay.
export async function syncScore(user, { xp, level, badges }) {
  if (!firestoreEnabled || !user?.uid) return;
  const fb = await loadFirebase();
  if (!fb?.db) return;
  const { doc, setDoc, serverTimestamp } = fb.fsMod;
  try {
    await setDoc(
      doc(fb.db, COLLECTION, user.uid),
      {
        displayName: user.displayName || "นักเที่ยว",
        photoURL: user.photoURL || null,
        xp: xp || 0,
        level: level || "",
        badges: badges || 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    /* rules not set yet / offline — ignore */
  }
}

// Read the top N players by XP. Returns [] on any failure so callers can render
// an empty state instead of crashing.
export async function fetchTop(n = 50) {
  if (!firestoreEnabled) return [];
  const fb = await loadFirebase();
  if (!fb?.db) return [];
  const { collection, query, orderBy, limit, getDocs } = fb.fsMod;
  try {
    const q = query(collection(fb.db, COLLECTION), orderBy("xp", "desc"), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export { firestoreEnabled };
