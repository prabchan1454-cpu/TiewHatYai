import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, firebaseEnabled } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInGoogle = useCallback(async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  }, []);

  const logout = useCallback(async () => {
    if (firebaseEnabled) await signOut(auth);
  }, []);

  return { user, loading, error, signInGoogle, logout, enabled: firebaseEnabled };
}
