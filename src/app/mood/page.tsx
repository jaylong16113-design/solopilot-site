import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

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
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.mood || []));
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-pink-50 to-white px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">🎬</div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">情绪短视频</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            用AI工具做高赞情绪短视频、从脚本到成片全流程拆解<br/>
            每一篇都是实操经验，不是理论搬运
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-400">
            <span className="tag bg-pink-100 text-pink-600">{articles.length} 篇文章</span>
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
