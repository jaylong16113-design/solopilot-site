"use client";
import { useI18n } from "@/lib/i18n/i18n";
import { usePathname, useRouter } from "next/navigation";

const locales: Record<string, string> = {
  en: "🇺🇸 English",
  zh: "🇨🇳 中文",
};

function stripLocale(path: string): string {
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  if (path === "/en") return "/";
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
      router.push(`/en${basePath === "/" ? "" : basePath}`);
    } else {
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
