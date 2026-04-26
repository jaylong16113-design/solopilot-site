"use client";
import { useI18n } from "@/lib/i18n/i18n";

const locales: Record<string, string> = {
  en: "🇺🇸 English",
  zh: "🇨🇳 中文",
  ja: "🇯🇵 日本語",
  ko: "🇰🇷 한국어",
  fr: "🇫🇷 Français",
  de: "🇩🇪 Deutsch",
  es: "🇪🇸 Español",
  pt: "🇧🇷 Português",
  id: "🇮🇩 Indonesia",
  ar: "🇸🇦 العربية",
};

export default function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as any)}
      className="text-[11px] bg-transparent border border-gray-200 rounded-md px-2 py-1 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors cursor-pointer outline-none max-w-[120px]"
    >
      {Object.entries(locales).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
