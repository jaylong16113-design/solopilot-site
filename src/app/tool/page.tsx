import Link from "next/link";
import type { Metadata } from "next";
import indexData from "@/lib/content/zh/index.json"

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
  const articles: { slug: string; title: string; excerpt: string }[] = indexData.tool || []

  return (
    <div>
      <section className="relative -mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
        <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80" alt="AI工具站" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 px-4 py-20 md:py-28 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">AI电商工具站</h1>
          <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed drop-shadow">
            免费AI工具实测、Shopify/淘宝/拼多多运营攻略、跨境工具推荐<br/>
            每一篇都是实操经验，不是理论搬运
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs">
            <span className="tag bg-primary/10 text-primary">{articles.length} 篇文章</span>
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
                  <h3 className="font-semibold text-sm text-foreground">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
