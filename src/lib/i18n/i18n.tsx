"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import locales from "./locales.json";

type LocaleKey = keyof typeof locales;

interface I18nContextType {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleKey>("zh");

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
