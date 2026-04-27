import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

const sites = [
  { key: "tool", emoji: "⚡", color: "from-amber-400 to-yellow-500", bg: "bg-amber-50", label: "AI 工具站", desc: "跨境电商AI工具对比评测，赋能一人电商运营" },
  { key: "wear", emoji: "👔", color: "from-violet-400 to-purple-400", bg: "bg-violet-50", label: "穿搭站", desc: "男士西装配搭指南，从入门到精通的穿搭百科" },
  { key: "ops", emoji: "🚀", color: "from-cyan-400 to-blue-400", bg: "bg-cyan-50", label: "运营站", desc: "一人公司实战运营方法论，零成本创业全攻略" },
  { key: "mood", emoji: "🎬", color: "from-pink-400 to-rose-400", bg: "bg-pink-50", label: "情绪短视频", desc: "情绪短视频创作教程与AI工具实操，手把手教你出爆款" },
];

function getStats() {
  try {
    const index = JSON.parse(
      readFileSync(join(process.cwd(), "src/lib/content/zh/index.json"), "utf8")
    );
    const total = (index.tool?.length||0) + (index.wear?.length||0) + (index.ops?.length||0) + (index.mood?.length||0);
    const pages = total * 2 + 10 + 2;
    return { articles: total, pages, tool: index.tool?.length||0, wear: index.wear?.length||0, ops: index.ops?.length||0, mood: index.mood?.length||0 };
  } catch {
    return { articles: 114, pages: 240, tool: 37, wear: 36, ops: 36, mood: 5 };
  }
}

export default function HomePage() {
  const stats = getStats();

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient px-4 py-20 md:py-28 text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-6"
               style={{background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,236,255,0.7)"}}>
            <span style={{width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px rgba(34,197,94,0.5)"}}></span>
            在线运行中
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            AI 驱动 · 一人公司 · 零成本启动
          </h1>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{color: "rgba(240,236,255,0.6)"}}>
            从工具到穿搭到运营再到情绪短视频，四个独立AI内容站，一个域名搞定一切
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {sites.map(s => (
              <Link key={s.key} href={`/${s.key}`} 
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all"
                    style={{background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,236,255,0.85)"}}>
                <span>{s.emoji}</span> {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="stats-glass grid grid-cols-4 gap-4 p-6">
          {[
            { n: String(stats.articles), label: "文章" },
            { n: String(stats.pages), label: "静态页面" },
            { n: "4", label: "站点" },
            { n: String(stats.mood), label: "情绪专题" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="stat-number">{s.n}</div>
              <div className="text-xs mt-1" style={{color: "rgba(240,236,255,0.45)"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Site Cards */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="section-title text-center text-xl mb-8">探索内容站</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sites.map((s, i) => (
            <Link key={s.key} href={`/${s.key}`} className="feature-card animate-fade-in-up block no-underline" style={{animationDelay: `${i*0.1}s`} as any}>
              <div className={`card-icon bg-gradient-to-br ${s.color} text-white mb-4`}>
                {s.emoji}
              </div>
              <h3 className="font-bold text-lg mb-1">{s.label}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{color: "rgba(240,236,255,0.55)"}}>{s.desc}</p>
              <div className="flex items-center gap-1 text-xs font-medium" style={{color: "#e3a75e"}}>
                <span>浏览 {stats[s.key as keyof typeof stats]} 篇文章 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="glass-about p-8">
          <h2 className="section-title text-xl mb-3">关于 AgentClaw</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto mb-6" style={{color: "rgba(240,236,255,0.55)"}}>
            AI 驱动的四人运营系统，七成内容由 AI 生成并持续优化。我们的使命是让一人公司拥有百人团队的产能。
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {["Next.js","Vercel","AI 驱动","SEO"].map(t => (
              <span key={t} className="tag" style={{background: "rgba(255,255,255,0.06)", color: "rgba(240,236,255,0.6)", border: "1px solid rgba(255,255,255,0.06)"}}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
