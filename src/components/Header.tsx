"use client";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";
import { useI18n } from "@/lib/i18n/i18n";
import { usePathname } from "next/navigation";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const prefix = isEn ? "/en" : "";

  return (
    <header className="site-header">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-1 text-sm">
        <Link href={prefix || "/"} className="font-bold text-base tracking-tighter mr-4 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-blue-600">●</span> AgentClaw
        </Link>
        <Link href={`${prefix}/tool`} className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">
          {t("nav_tool")}
        </Link>
        <Link href={`${prefix}/wear`} className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">
          {t("nav_wear")}
        </Link>
        <Link href={`${prefix}/ops`} className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">
          {t("nav_ops")}
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-gray-300 hidden sm:inline">{t("nav_pages_count", { count: 63 })}</span>
          <LangSwitcher />
        </div>
      </nav>
    </header>
  );
}
