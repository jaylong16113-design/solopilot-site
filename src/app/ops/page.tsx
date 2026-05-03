import Link from "next/link";
import type { Metadata } from "next";
import indexData from "@/lib/content/zh/index.json"

export const metadata: Metadata = { 
  title: "一人公司运营指南 — 自动化·SEO·零成本创业", 
  description: "一人公司自动化运营、AI工作流、SEO指南、CPS联盟变现、零成本创业路线图" 
};

const icons: Record<string, string> = {
  "what-is-solo-company": "🏢",
  "zero-cost-roadmap": "🗺️",
  "ai-writing-workflow": "🤖",
  "seo-guide-solo-company": "🔍",
  "cps-affiliate-strategy": "💰",
  "github-actions-automation": "⚙️",
  "from-0-to-1000-visitors": "📈",
  "solo-content-operations": "📝",
  "multi-site-one-domain": "🌐",
  "vercel-deployment-guide": "🚀",
  "data-driven-content": "📊",
  "build-in-public": "📢",
  "adsense-first-month": "📣",
  "ai-automation-workflow": "🔄",
  "15-free-tools-solo": "🛠️",
};

export default function OpsPage() {
  const articles: { slug: string; title: string; excerpt: string }[] = indexData.ops || []

  return (
    <div>
      <section className="relative -mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80" alt="运营站" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 px-4 py-20 md:py-28 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">一人公司运营</h1>
          <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed drop-shadow">
            AI自动化工作流、SEO策略、CPS联盟变现、零成本创业<br/>
            一个人也能运作的完整商业系统
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs">
            <span className="tag bg-warning/10 text-warning">{articles.length} 篇文章</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/ops/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`}}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{icons[a.slug] || "📄"}</span>
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
