import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { 
  title: "AI电商工具 — 免费AI工具评测与电商运营教程", 
  description: "免费AI电商工具实测、Shopify/淘宝/拼多多运营攻略、跨境电商工具推荐" 
};

const sectionIcons: Record<string, string> = {
  "free-ai-product-image-tools": "🖼️",
  "chatgpt-taobao-title-prompts": "🤖",
  "ai-remove-background-comparison": "✂️",
  "taobao-seo-guide-2026": "🔍",
  "ai-product-description-writer": "✍️",
  "cross-border-ecommerce-ai-tools": "🌐",
  "taobao-live-ai-digital-human": "📺",
  "10-free-ecommerce-tools": "🛠️",
  "ai-customer-service-automation": "💬",
  "pinduoduo-zero-cost-traffic": "📈",
  "ai-ecommerce-data-analysis": "📊",
  "ecommerce-funnel-optimization": "🔄",
  "shopify-free-apps-2026": "🛒",
  "taobao-keyword-tool-free": "🔑",
  "wechat-xiaohongshu-ecommerce-traffic": "📱",
  "ai-tools-2026-comparison": "⚖️",
  "ai-free-video-editing-ecommerce": "🎬",
  "aliexpress-ai-translation-tools": "🌍",
  "shein-temu-ai-tools": "📦",
};

export default function ToolPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.tool || []));
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">AI电商工具站</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            免费AI工具实测、Shopify/淘宝/拼多多运营攻略、跨境工具推荐<br/>
            每一篇都是实操经验，不是理论搬运
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="tag bg-blue-100 text-blue-600">{articles.length} 篇文章</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/tool/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`} as any}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{sectionIcons[a.slug] || "📄"}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{a.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
