"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n";

export default function Footer() {
  const { t } = useI18n();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isEn = pathname?.startsWith("/en");
  const p = (href: string) => isEn ? `/en${href}` : href;

  return (
    <footer style={{borderTop: "1px solid hsl(var(--border)/0.5)", background: "hsl(var(--background))"}}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-display text-sm font-semibold mb-3" style={{color: "hsl(var(--foreground))"}}>{t("footer_nav")}</h4>
            <ul className="space-y-1.5 text-xs" style={{color: "hsl(var(--muted-foreground))"}}>
              <li><Link href={p("/")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("nav_home")}</Link></li>
              <li><Link href={p("/tool")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("nav_tool")}</Link></li>
              <li><Link href={p("/wear")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("nav_wear")}</Link></li>
              <li><Link href={p("/ops")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("nav_ops")}</Link></li>
              <li><Link href={p("/mood")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("nav_mood")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3" style={{color: "hsl(var(--foreground))"}}>{t("footer_popular")}</h4>
            <ul className="space-y-1.5 text-xs" style={{color: "hsl(var(--muted-foreground))"}}>
              <li><Link href={p("/tool/10-free-ecommerce-tools")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("free_tools")}</Link></li>
              <li><Link href={p("/wear/first-suit-guide")} className="transition-colors no-underline" style={{color: "inherit"}}>{t("suit_style")}</Link></li>
              <li><Link href={p("/ops/what-is-solo-company")} className="transition-colors no-underline" style={{color: "inherit"}}>Solo OPS</Link></li>
              <li><Link href={p("/mood/emotion-short-video-basics")} className="transition-colors no-underline" style={{color: "inherit"}}>情绪短视频</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3" style={{color: "hsl(var(--foreground))"}}>{t("footer_about_title")}</h4>
            <ul className="space-y-1.5 text-xs" style={{color: "hsl(var(--muted-foreground))"}}>
              <li><span className="cursor-default">{t("footer_about")}</span></li>
              <li><span className="cursor-default">{t("footer_desc")}</span></li>
              <li><span className="cursor-default">Ricky</span></li>
              <li><a href="/axiom" className="transition-colors no-underline" style={{color: "inherit"}}>AXIOM →</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3" style={{color: "hsl(var(--foreground))"}}>{t("contact")}</h4>
            <ul className="space-y-1.5 text-xs" style={{color: "hsl(var(--muted-foreground))"}}>
              <li><a href="mailto:jaylong16113@gmail.com" className="transition-colors">jaylong16113@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 text-xs text-center" style={{borderTop: "1px solid hsl(var(--border)/0.4)", color: "hsl(var(--muted-foreground))"}}>
          <p>© 2026 AgentClaw</p>
        </div>
      </div>
    </footer>
  );
}
