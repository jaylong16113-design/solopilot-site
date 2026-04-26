import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { 
  title: "Solo OPS — One-Person Company Automation & Growth", 
  description: "Solo entrepreneur guides: AI automation, SEO, content operations, affiliate marketing, zero-cost startup roadmap." 
};

const sectionIcons: Record<string, string> = {
  "what-is-solo-company": "🏢",
  "zero-cost-roadmap": "💰",
  "ai-automation-workflow": "🤖",
  "vercel-deployment-guide": "🚀",
  "multi-site-one-domain": "🌐",
  "seo-guide-solo-company": "🔍",
  "15-free-tools-solo": "🛠️",
  "ai-writing-workflow": "✍️",
  "build-in-public": "📢",
  "cps-affiliate-strategy": "💎",
  "data-driven-content": "📊",
  "from-0-to-1000-visitors": "📈",
  "github-actions-automation": "⚙️",
  "adsense-first-month": "💵",
  "one-person-ai-agent": "🧠",
  "solo-content-operations": "📝",
  "solo-income-diversification": "💰",
  "nextjs-solo-devs-guide": "⚛️",
};

export default function EnOpsPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
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
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">Solo OPS</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            One-person company automation system &mdash; AI workflows, SEO, content ops<br/>
            From zero to sustainable income, no shortcuts
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="tag bg-amber-100 text-amber-600">{articles.length} articles</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/en/ops/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`} as any}>
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
