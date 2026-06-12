// Firebase is optional and heavy (~200 kB). To keep it out of the main bundle,
// the SDK is loaded *dynamically* — only when it's actually configured AND used.
// Guest-mode users (no env vars) never download it.

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Auth is enabled only when the core Firebase env vars are set.
export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.appId);

// The leaderboard needs Firestore; it lives on the same project as auth.
export const firestoreEnabled = firebaseEnabled && Boolean(config.projectId);

let _loaded = null;

// Lazily import + initialise Firebase. Resolves to null when not configured, or
// to a bundle of the live instances and the SDK modules callers need. Memoised,
// so the dynamic import and initializeApp happen at most once.
export function loadFirebase() {
  if (!firebaseEnabled) return Promise.resolve(null);
  if (!_loaded) {
    _loaded = (async () => {
      const [appMod, authMod, fsMod] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        config.projectId ? import("firebase/firestore") : Promise.resolve(null),
      ]);
      const app = appMod.initializeApp(config);
      const auth = authMod.getAuth(app);
      const googleProvider = new authMod.GoogleAuthProvider();
      const db = fsMod ? fsMod.getFirestore(app) : null;
      return { app, auth, googleProvider, db, authMod, fsMod };
    })();
  }
  return _loaded;
}
