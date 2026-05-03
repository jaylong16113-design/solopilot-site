import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "AgentClaw | AI电商工具·穿搭·一人公司·情绪短视频",
    template: "%s | AgentClaw",
  },
  description: "AI电商工具评测、男装穿搭指南、一人公司自动化运营方案、情绪短视频创作教程 —— 一个域名的四个内容站",
  openGraph: {
    title: "AgentClaw — OPS Solo System",
    description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营 · 情绪短视频创作",
    url: "https://agentclaw.sale",
    siteName: "AgentClaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw — OPS Solo System",
    description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营 · 情绪短视频创作",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 动态检测语言路由，修正英文站 lang="zh-CN" 的问题
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || headersList.get("next-url") || "";
  const isEn = pathname?.startsWith("/en");

  return (
    <html lang={isEn ? "en" : "zh-CN"} className="bg-background text-foreground">
      <head>
        <meta name="baidu-site-verification" content="REPLACE_WITH_YOUR_BAIDU_CODE" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5426111418472003" crossOrigin="anonymous"></script>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="canonical" href={`https://agentclaw.sale${pathname}`} />
        <link rel="alternate" hrefLang="zh" href={`https://agentclaw.sale${isEn ? pathname.replace(/^\/en/, '') : pathname}`} />
        <link rel="alternate" hrefLang="en" href={`https://agentclaw.sale${isEn ? pathname : '/en' + pathname}`} />
        <link rel="alternate" hrefLang="x-default" href="https://agentclaw.sale/" />
      </head>
      <body className="antialiased" style={{background: "hsl(var(--background))", color: "hsl(var(--foreground))"}}>
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
