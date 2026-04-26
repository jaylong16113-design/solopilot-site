"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import locales from "./locales.json";

type LocaleKey = keyof typeof locales;

interface I18nContextType {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLocale(): LocaleKey {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("agentclaw-locale") as LocaleKey;
  if (saved && (locales as any)[saved]) return saved;
  const nav = navigator.language?.slice(0, 2);
  if (nav && (locales as any)[nav]) return nav as LocaleKey;
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleKey>(getInitialLocale);

  const setLocale = useCallback((l: LocaleKey) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("agentclaw-locale", l);
    }
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const messages = (locales as any)[locale];
    let val = messages?.[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  }, [locale]);

  // sync on mount (edge: double-render in dev)
  useEffect(() => {
    const saved = localStorage.getItem("agentclaw-locale") as LocaleKey;
    if (saved && saved !== locale && (locales as any)[saved]) {
      setLocaleState(saved);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
