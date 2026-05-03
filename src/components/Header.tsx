"use client";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";
import { useI18n } from "@/lib/i18n/i18n";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const prefix = isEn ? "/en" : "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `${prefix}/tool`, label: t("nav_tool") },
    { href: `${prefix}/wear`, label: t("nav_wear") },
    { href: `${prefix}/ops`, label: t("nav_ops") },
    { href: `${prefix}/mood`, label: t("nav_mood") },
  ];

  return (
    <header className="site-header">
      <nav className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-1 text-sm" style={{border: "none", paddingBottom: 0}}>
        <Link href={prefix || "/"} className="flex items-center gap-2 font-display font-bold no-underline text-base tracking-tight">
          <span className="grid size-8 place-items-center rounded-full text-primary-foreground"
                style={{background: "var(--gradient-claw)"}}>✦</span>
          <span className="text-foreground">AgentClaw</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link px-3 py-1.5 rounded-md transition-colors no-underline"
                  style={{color: "hsl(var(--muted-foreground))"}}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LangSwitcher />

          {/* Hamburger button — visible on mobile only */}
          <button
            className="md:hidden flex items-center justify-center size-8 rounded-md border"
            style={{borderColor: "hsl(var(--border))", background: "transparent", cursor: "pointer"}}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40"
             style={{background: "hsl(208 25% 3% / 0.95)", backdropFilter: "blur(8px)"}}
             onClick={() => setMobileOpen(false)}>
          <div className="flex flex-col items-center justify-center gap-6 h-full" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                    className="text-lg font-medium no-underline transition-colors"
                    style={{color: "hsl(var(--foreground))"}}
                    onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
