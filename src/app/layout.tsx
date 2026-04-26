import type { Metadata } from "next";
import "./globals.css";

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
        <header className="site-header">
          <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-1 text-sm">
            <a href="/" className="font-bold text-base tracking-tighter mr-4 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-blue-600">●</span> AgentClaw
            </a>
            <a href="/tool" className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">AI工具</a>
            <a href="/wear" className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">穿搭</a>
            <a href="/ops" className="nav-link px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 transition-colors">一人公司</a>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] text-gray-300 hidden sm:inline">▲ 63 pages</span>
            </div>
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer className="site-footer">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">站点</h4>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li><a href="/" className="hover:text-white transition-colors">首页</a></li>
                  <li><a href="/tool" className="hover:text-white transition-colors">AI电商工具</a></li>
                  <li><a href="/wear" className="hover:text-white transition-colors">男装穿搭</a></li>
                  <li><a href="/ops" className="hover:text-white transition-colors">一人公司</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">热门</h4>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li><a href="/tool/free-ai-product-image-tools" className="hover:text-white transition-colors">免费AI商品图工具</a></li>
                  <li><a href="/wear/first-suit-guide" className="hover:text-white transition-colors">第一次买西服指南</a></li>
                  <li><a href="/ops/what-is-solo-company" className="hover:text-white transition-colors">一人公司是什么</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">关于</h4>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li><span className="hover:text-white transition-colors cursor-default">AgentClaw OPS System</span></li>
                  <li><span className="hover:text-white transition-colors cursor-default">一个域名 · 三个内容站</span></li>
                  <li><span className="hover:text-white transition-colors cursor-default">Powered by Next.js + Vercel</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">统计</h4>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li>文章: 57篇</li>
                  <li>页面: 63个</li>
                  <li>站点: 3个</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 text-xs text-center">
              <p>AgentClaw.sale © 2026 — 不做采集站，不做伪原创，所有内容可追溯</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
