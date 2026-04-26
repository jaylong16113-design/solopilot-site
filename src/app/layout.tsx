import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "AgentClaw | AI电商工具·穿搭·一人公司",
    template: "%s | AgentClaw",
  },
  description: "AI电商工具评测、男装穿搭指南、一人公司自动化运营方案 —— 一个域名的三个内容站",
  openGraph: {
    title: "AgentClaw — OPS Solo System",
    description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营",
    url: "https://agentclaw.sale",
    siteName: "AgentClaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw — OPS Solo System",
    description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5426111418472003" crossOrigin="anonymous"></script>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
