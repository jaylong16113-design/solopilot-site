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
      <section className="relative -mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
        <img src="https://images.unsplash.com/photo-1507679799987-c6ebd63a4447?w=1200&q=80" alt="穿搭站" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 px-4 py-20 md:py-28 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">男装穿搭指南</h1>
          <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed drop-shadow">
            西服选购、面料知识、搭配法则、保养技巧<br/>
            从入门到精通的完整路线图
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs">
            <span className="tag bg-accent/10 text-accent">{articles.length} 篇文章</span>
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
