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

export { firestoreEnabled };
