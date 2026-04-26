"use client";
import { useI18n } from "@/lib/i18n/i18n";

const flags: Record<string, string> = {
  zh: "🇨🇳 中文",
  en: "🇺🇸 EN",
  ja: "🇯🇵 日本語",
};

export default function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as any)}
      className="text-[11px] bg-transparent border border-gray-200 rounded-md px-2 py-1 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors cursor-pointer outline-none"
    >
      {Object.entries(flags).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
