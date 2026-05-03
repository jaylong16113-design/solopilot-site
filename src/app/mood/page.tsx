import Link from "next/link";
import type { Metadata } from "next";
import indexData from "@/lib/content/zh/index.json"

export const metadata: Metadata = { 
  title: "情绪短视频 — AI工具推荐与创作教程", 
  description: "用AI工具做高赞情绪短视频、从脚本到成片全流程拆解" 
};

const sectionIcons: Record<string, string> = {
  "emotion-short-video-basics": "🎬",
  "ai-video-script-tools": "✍️",
  "clipchamp-capcut-emotional-editing": "✂️",
  "ai-voiceover-music-tools": "🎵",
  "viral-duan-emotional-video-case": "📊",
};

export default function MoodPage() {
  const articles: { slug: string; title: string; excerpt: string }[] = indexData.mood || []

  return (
    <div>
      <section className="relative -mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
        <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80" alt="情绪短视频" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 px-4 py-20 md:py-28 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">情绪短视频</h1>
          <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed drop-shadow">
            用AI工具做高赞情绪短视频、从脚本到成片全流程拆解<br/>
            每一篇都是实操经验，不是理论搬运
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs">
            <span className="tag bg-info/10 text-info">{articles.length} 篇文章</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/mood/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`} as any}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{sectionIcons[a.slug] || "🎬"}</span>
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
