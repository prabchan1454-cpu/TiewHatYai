import { useCallback, useEffect, useState } from "react";

const KEY = "travelsongkhla_theme";

function initialTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "dark" || saved === "light") return saved;
    return "dark"; // default to dark for the adventure-game aesthetic
  } catch {
    return "light";
  }
}

function apply(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  // Keep the mobile browser chrome in sync with the surface behind it.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1525" : "#1b2a4a");
}

// Mirrors the i18n hook: a tiny stateful toggle persisted to localStorage.
// The inline script in index.html applies the class before paint; this keeps
// React state in sync and handles toggling at runtime.
export function useTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* private mode / storage disabled — theme just won't persist */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return { theme, toggle, isDark: theme === "dark" };
}
