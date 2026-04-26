import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

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
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.ops || []));
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50 to-white px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">一人公司运营</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            AI自动化工作流、SEO策略、CPS联盟变现、零成本创业<br/>
            一个人也能运作的完整商业系统
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="tag bg-amber-100 text-amber-600">{articles.length} 篇文章</span>
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
