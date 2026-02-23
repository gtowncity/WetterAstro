// src/context/ThemeContext.tsx
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeCtx = {
  dark: boolean;
  setDark: (v: boolean) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);
const KEY = "wa_theme";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return true;

  const saved = window.localStorage.getItem(KEY);
  if (saved === "dark") return true;
  if (saved === "light") return false;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ?? true;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => getInitialDark());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";

    try {
      window.localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [dark]);

  const value = useMemo<ThemeCtx>(() => {
    return { dark, setDark, toggle: () => setDark((v) => !v) };
  }, [dark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}