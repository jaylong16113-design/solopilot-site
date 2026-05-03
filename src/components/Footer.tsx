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
              <li><Link href="/privacy" className="transition-colors no-underline" style={{color: "inherit"}}>隐私政策</Link></li>
              <li><Link href="/terms" className="transition-colors no-underline" style={{color: "inherit"}}>服务条款</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3" style={{color: "hsl(var(--foreground))"}}>🔒 内部工具</h4>
            <ul className="space-y-1.5 text-xs" style={{color: "hsl(var(--muted-foreground))"}}>
              <li><a href="/compass" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>🧭 COMPASS 导航</a></li>
              <li><a href="/lens" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>🔍 LENS 情报</a></li>
              <li><a href="/axiom" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>AXIOM 社会推演</a></li>
              <li><a href="/forge" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>FORGE 内容中台</a></li>
              <li><a href="/blaze" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>BLAZE 爆款复刻</a></li>
              <li><a href="/hunter" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>HUNTER 工具箱</a></li>
              <li><a href="/mist" className="transition-colors no-underline" style={{color: "hsl(var(--accent))"}}>Mist 情绪短视频</a></li>
              <li style={{fontSize: "9px", marginTop: "4px", color: "hsl(var(--muted-foreground)/0.6)"}}>需密码 · 仅供演示</li>
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
