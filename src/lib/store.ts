import { useEffect, useState } from "react";

export function useStoredState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return defaultValue;
      const raw = window.localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}