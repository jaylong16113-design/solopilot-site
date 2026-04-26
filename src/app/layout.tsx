import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AgentClaw | OPS Solo System",
    template: "%s | AgentClaw",
  },
  description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营",
  openGraph: {
    title: "AgentClaw",
    description: "AI电商工具 · 男装穿搭指南 · 一人公司自动化运营",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5426111418472003" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-100">
          <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6 text-sm">
            <a href="/" className="font-bold text-base tracking-tight">AgentClaw</a>
            <a href="/tool" className="text-gray-500 hover:text-gray-900 transition-colors">AI工具</a>
            <a href="/wear" className="text-gray-500 hover:text-gray-900 transition-colors">穿搭</a>
            <a href="/ops" className="text-gray-500 hover:text-gray-900 transition-colors">一人公司</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-400 text-center">
            <p>AgentClaw.sale — AI电商工具 · 男士穿搭 · 一人公司运营</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
