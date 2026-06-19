// Firebase is optional and heavy (~200 kB auth + ~250 kB firestore). To keep it
// out of the main bundle, the SDK is loaded *dynamically* — only when configured
// AND used. Auth and Firestore load independently: a guest who never opens the
// leaderboard / check-ins / business directory never downloads the firestore chunk.

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Auth is enabled only when the core Firebase env vars are set.
export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.appId);

// Firestore needs a projectId; it lives on the same project as auth.
export const firestoreEnabled = firebaseEnabled && Boolean(config.projectId);

let _app = null;
let _fs = null;

// Lazily import + initialise the core app and auth SDK. Resolves to null when not
// configured. Memoised, so the dynamic import + initializeApp happen at most once.
// NOTE: this intentionally does NOT pull in firebase/firestore — see loadFirestore.
export function loadFirebase() {
  if (!firebaseEnabled) return Promise.resolve(null);
  if (!_app) {
    _app = (async () => {
      const [appMod, authMod] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
      ]);
      const app = appMod.initializeApp(config);
      const auth = authMod.getAuth(app);
      const googleProvider = new authMod.GoogleAuthProvider();
      return { app, auth, googleProvider, authMod };
    })();
  }
  return _app;
}

// Lazily import Firestore *on top of* the initialised app. Resolves to null when
// Firestore isn't configured. Memoised. Call this from data modules (leaderboard,
// check-ins, businesses) so the ~250 kB firestore chunk only loads when a user
// actually opens one of those features — not on every app boot.
export function loadFirestore() {
  if (!firestoreEnabled) return Promise.resolve(null);
  if (!_fs) {
    _fs = (async () => {
      const fb = await loadFirebase();
      if (!fb) return null;
      const fsMod = await import("firebase/firestore");
      const db = fsMod.getFirestore(fb.app);
      return { db, fsMod };
    })();
  }
  return _fs;
}
