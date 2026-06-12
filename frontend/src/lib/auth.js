import { useCallback, useEffect, useState } from "react";
import { firebaseEnabled, loadFirebase } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) return;
    let active = true;
    let unsub = () => {};
    loadFirebase()
      .then((fb) => {
        if (!fb || !active) return;
        unsub = fb.authMod.onAuthStateChanged(fb.auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      })
      .catch((e) => {
        // SDK failed to load (offline / blocked) — fall back to guest mode
        // instead of spinning forever on the auth gate.
        console.error("Firebase failed to load:", e);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const signInGoogle = useCallback(async () => {
    setError("");
    try {
      const fb = await loadFirebase();
      if (!fb) return;
      await fb.authMod.signInWithPopup(fb.auth, fb.googleProvider);
    } catch (e) {
      setError(e.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  }, []);

  const logout = useCallback(async () => {
    if (!firebaseEnabled) return;
    const fb = await loadFirebase();
    if (fb) await fb.authMod.signOut(fb.auth);
  }, []);

  return { user, loading, error, signInGoogle, logout, enabled: firebaseEnabled };
}
