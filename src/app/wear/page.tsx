import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { 
  title: "男装穿搭指南 — 西服选购·面料·搭配", 
  description: "男士西装穿搭从入门到精通：西服选购、面料知识、搭配法则、保养技巧、场景穿搭完整指南" 
};

const icons: Record<string, string> = {
  "first-suit-guide": "👔",
  "suit-color-guide": "🎨",
  "suit-styling-rules": "✨",
  "sports-suit-vs-suit": "⚡",
  "business-wear-101": "💼",
  "suit-fabric-guide": "🧵",
  "suit-measure-guide": "📏",
  "suit-care-guide": "🧹",
  "suit-underwear-guide": "👕",
  "suit-size-guide": "📐",
  "suit-shoes-guide": "👞",
  "suit-occasion-guide": "🎯",
  "suit-materials-tech": "🔬",
  "suit-mistakes-beginners": "⚠️",
  "suit-seasonal-guide": "🌤️",
  "suit-trends-2026": "📈",
  "suit-online-shopping-tips": "🛍️",
  "suit-ironing-guide": "🔥",
};

export default function WearPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.wear || []));
  }

  return (
    <div>
      <section className="bg-background border-b border-border/50 px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">👔</div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">男装穿搭指南</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            西服选购、面料知识、搭配法则、保养技巧<br/>
            从入门到精通的完整路线图
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs">
            <span className="tag bg-accent/10 text-accent-foreground">{articles.length} 篇文章</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/wear/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`}}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{icons[a.slug] || "👔"}</span>
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
