"use client";
import { useI18n } from "@/lib/i18n/i18n";
import { usePathname, useRouter } from "next/navigation";

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

const localePrefixes = ["/en/", "/en"];

function stripLocale(path: string): string {
  for (const p of localePrefixes) {
    if (path.startsWith(p)) return path.slice(p.length - (p.endsWith("/") ? 1 : 1)) || "/";
  }
  // also check /ja/ /ko/ etc
  const match = path.match(/^\/([a-z]{2})\//);
  if (match) return path.slice(3) || "/";
  return path;
}

export default function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    setLocale(newLocale as any);
    const basePath = stripLocale(pathname);
    if (newLocale === "en") {
      // only English gets /en/ prefix (others keep zh/root)
      const target = `/en${basePath === "/" ? "" : basePath}`;
      router.push(target);
    } else {
      // Chinese (or other languages) → strip /en/ prefix
      router.push(basePath);
    }
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="text-[11px] bg-transparent border border-gray-200 rounded-md px-2 py-1 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors cursor-pointer outline-none max-w-[120px]"
    >
      {Object.entries(locales).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
