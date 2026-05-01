import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { 
  title: "Emotional Short Videos — AI Tools & Creation Tutorials | AgentClaw", 
  description: "Make emotional short videos with AI tools. Script writing, editing, voiceovers, music — hands-on guides with real case studies." 
};

const sectionIcons: Record<string, string> = {
  "emotion-short-video-basics": "🎬",
  "ai-video-script-tools": "✍️",
  "clipchamp-capcut-emotional-editing": "✂️",
  "ai-voiceover-music-tools": "🎵",
  "viral-duan-emotional-video-case": "📊",
};

export default function EnMoodPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.mood || []));
  }

  const totalMood = articles.length;

  return (
    <div>
      <section className="bg-gradient-to-b from-pink-900/30 to-background px-4 py-12 md:py-16 -mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">🎬</div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">Emotional Short Videos</h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Make high-impact emotional short videos with AI tools &mdash; from script to final cut<br/>
            Every article is hands-on experience, not theory
          </p>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-500">
            <span className="tag bg-pink-900/40 text-pink-300">{totalMood} articles</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid gap-3">
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/en/mood/${a.slug}`} className="article-card block animate-fade-in-up" style={{animationDelay: `${i*0.03}s`} as any}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{sectionIcons[a.slug] || "🎬"}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-100">{a.title}</h3>
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
