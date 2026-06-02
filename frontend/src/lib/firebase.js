import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Auth is optional — only enabled when Firebase env vars are set.
export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.appId);

// The leaderboard needs Firestore; it lives on the same project, so it's
// available whenever auth is. projectId is part of the config above.
export const firestoreEnabled = firebaseEnabled && Boolean(config.projectId);

let auth = null;
let googleProvider = null;
let db = null;

if (firebaseEnabled) {
  const app = initializeApp(config);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  if (config.projectId) db = getFirestore(app);
}

export { auth, googleProvider, db };
