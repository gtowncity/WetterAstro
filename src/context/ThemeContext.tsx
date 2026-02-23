import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeCtx = {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

const KEY = "wa_theme"; // "dark" | "light"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem(KEY);
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark]);

  const value = useMemo(
    () => ({ dark, setDark, toggle: () => setDark((v) => !v) }),
    [dark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}