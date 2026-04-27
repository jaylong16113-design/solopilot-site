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
      <nav className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-1 text-sm" style={{border: "none", paddingBottom: 0}}>
        <Link href={prefix || "/"} className="flex items-center gap-2 font-display font-bold no-underline text-base tracking-tight">
          <span className="grid size-8 place-items-center rounded-full text-primary-foreground"
                style={{background: "var(--gradient-claw)"}}>✦</span>
          <span className="text-foreground">AgentClaw</span>
        </Link>
        <Link href={`${prefix}/tool`} className="nav-link ml-4 px-3 py-1.5 rounded-md transition-colors no-underline"
              style={{color: "hsl(var(--muted-foreground))"}}>
          {t("nav_tool")}
        </Link>
        <Link href={`${prefix}/wear`} className="nav-link px-3 py-1.5 rounded-md transition-colors no-underline"
              style={{color: "hsl(var(--muted-foreground))"}}>
          {t("nav_wear")}
        </Link>
        <Link href={`${prefix}/ops`} className="nav-link px-3 py-1.5 rounded-md transition-colors no-underline"
              style={{color: "hsl(var(--muted-foreground))"}}>
          {t("nav_ops")}
        </Link>
        <Link href={`${prefix}/mood`} className="nav-link px-3 py-1.5 rounded-md transition-colors no-underline"
              style={{color: "hsl(var(--muted-foreground))"}}>
          {t("nav_mood")}
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px]" style={{color: "hsl(var(--muted-foreground)/0.5)"}}>{t("nav_pages_count", { count: 73 })}</span>
          <LangSwitcher />
        </div>
      </nav>
    </header>
  );
}
