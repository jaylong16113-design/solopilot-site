import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI电商工具",
  description: "免费AI电商工具教程、电商运营干货、跨境出海指南",
};

const articles = [
  { title: "免费AI商品图生成工具推荐及使用教程", slug: "free-ai-product-image-tools", date: "即将发布" },
  { title: "ChatGPT做淘宝标题优化的5个高级Prompt", slug: "chatgpt-taobao-title-prompts", date: "即将发布" },
  { title: "AI一键去商品背景：5个免费工具对比", slug: "ai-remove-background-comparison", date: "即将发布" },
  { title: "电商新手必备的10个免费工具", slug: "10-free-ecommerce-tools", date: "即将发布" },
  { title: "淘宝SEO完整指南（2026最新版）", slug: "taobao-seo-guide-2026", date: "即将发布" },
];

export default function ToolPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">AI电商工具站</h1>
        <p className="text-gray-500 mt-2">免费AI电商工具教程，帮助中小电商卖家提升效率</p>
      </section>

      <div className="space-y-1 border-t border-gray-100 pt-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/tool/${a.slug}`}
            className="flex items-center justify-between py-3 group">
            <span className="text-sm group-hover:text-blue-600 transition-colors">{a.title}</span>
            <span className="text-xs text-gray-400">{a.date}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
