import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { 
  title: "Men's Style Guide — Suit Tips, Fashion Trends & Shopping Guide", 
  description: "Complete men's style guide: suit buying, fabric care, color matching, seasonal outfits, and 2026 fashion trends." 
};

const sectionIcons: Record<string, string> = {
  "first-suit-guide": "👔",
  "suit-color-guide": "🎨",
  "suit-styling-rules": "✨",
  "suit-fabric-guide": "🧵",
  "suit-measure-guide": "📏",
  "business-wear-101": "💼",
  "suit-care-guide": "🧺",
  "suit-ironing-guide": "🔥",
  "suit-materials-tech": "🔬",
  "suit-mistakes-beginners": "❌",
  "suit-occasion-guide": "🎉",
  "suit-online-shopping-tips": "🛒",
  "suit-seasonal-guide": "🌤️",
  "suit-shoes-guide": "👞",
  "suit-size-guide": "📐",
  "suit-trends-2026": "📈",
  "suit-underwear-guide": "👕",
  "sports-suit-vs-suit": "🏃",
};

export default function EnWearPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.wear || []));
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-violet-50 to-white px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">👔</div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">Men's Style Guide</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Suit buying tips, fabric care, color matching &mdash; everything you need<br/>
            From first suit to style pro, one article at a time
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="tag bg-violet-100 text-violet-600">{articles.length} articles</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/en/wear/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`} as any}>
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
