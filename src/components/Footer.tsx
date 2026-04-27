"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n";

export default function Footer() {
  const { t } = useI18n();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isEn = pathname?.startsWith("/en");
  const p = (href: string) => isEn ? `/en${href}` : href;

  return (
    <footer className="site-footer">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{color: "rgba(240,236,255,0.85)"}}>{t("footer_nav")}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href={p("/")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("nav_home")}</Link></li>
              <li><Link href={p("/tool")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("nav_tool")}</Link></li>
              <li><Link href={p("/wear")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("nav_wear")}</Link></li>
              <li><Link href={p("/ops")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("nav_ops")}</Link></li>
              <li><Link href={p("/mood")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("nav_mood")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{color: "rgba(240,236,255,0.85)"}}>{t("footer_popular")}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href={p("/tool/10-free-ecommerce-tools")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("free_tools")}</Link></li>
              <li><Link href={p("/wear/first-suit-guide")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>{t("suit_style")}</Link></li>
              <li><Link href={p("/ops/what-is-solo-company")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>Solo OPS</Link></li>
              <li><Link href={p("/mood/emotion-short-video-basics")} className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>情绪短视频</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{color: "rgba(240,236,255,0.85)"}}>{t("footer_about_title")}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><span className="cursor-default" style={{color: "rgba(240,236,255,0.45)"}}>{t("footer_about")}</span></li>
              <li><span className="cursor-default" style={{color: "rgba(240,236,255,0.45)"}}>{t("footer_desc")}</span></li>
              <li><span className="cursor-default" style={{color: "rgba(240,236,255,0.45)"}}>Ricky</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{color: "rgba(240,236,255,0.85)"}}>{t("contact")}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="mailto:jaylong16113@gmail.com" className="transition-colors" style={{color: "rgba(240,236,255,0.45)"}}>jaylong16113@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 text-xs text-center" style={{borderTop: "1px solid rgba(255,255,255,0.04)", color: "rgba(240,236,255,0.3)"}}>
          <p>{t("footer_copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
