import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

const sites = [
  { key: "tool", emoji: "⚡", color: "from-blue-500 to-cyan-400", bg: "bg-blue-50" },
  { key: "wear", emoji: "👔", color: "from-violet-500 to-purple-400", bg: "bg-violet-50" },
  { key: "ops", emoji: "🚀", color: "from-amber-500 to-orange-400", bg: "bg-amber-50" },
];

function getStats() {
  try {
    const index = JSON.parse(
      readFileSync(join(process.cwd(), "src/lib/content/zh/index.json"), "utf8")
    );
    const total = index.tool.length + index.wear.length + index.ops.length;
    const pages = total * 2 + 8 + 2; // en/zh articles + home pages + list pages + sitemap etc
    return { articles: total, pages, tool: index.tool.length, wear: index.wear.length, ops: index.ops.length };
  } catch {
    return { articles: 109, pages: 230, tool: 37, wear: 36, ops: 36 };
  }
}

export default function HomePage() {
  const stats = getStats();

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient px-4 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            在线运行中
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            AI 驱动 · 一人公司 · 零成本启动
          </h1>
          <p className="text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
            从工具到穿搭再到SaaS运营，三个独立AI站点，一套自动化系统，一个域名搞定一切
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {sites.map(s => (
              <Link key={s.key} href={`/${s.key}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                <span>{s.emoji}</span> {s.key === "tool" ? "AI 工具站" : s.key === "wear" ? "穿搭站" : "运营站"}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {[
            { n: String(stats.articles), label: "文章" },
            { n: String(stats.pages), label: "静态页面" },
            { n: "3", label: "站点" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="stat-number">{s.n}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Site Cards */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {sites.map((s, i) => (
            <Link key={s.key} href={`/${s.key}`} className="feature-card animate-fade-in-up block no-underline" style={{animationDelay: `${i*0.1}s`} as any}>
              <div className={`card-icon bg-gradient-to-br ${s.color} text-white mb-4`}>
                {s.emoji}
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">{s.key === "tool" ? "AI 工具站" : s.key === "wear" ? "穿搭站" : "运营站"}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {s.key === "tool" ? "跨境电商AI工具对比评测，赋能一人电商运营" : s.key === "wear" ? "男士西装配搭指南，从入门到精通的穿搭百科" : "一人公司实战运营方法论，零成本创业全攻略"}
              </p>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <span>浏览 {s.key === "tool" ? stats.tool : (s.key === "wear" ? stats.wear : stats.ops)} 篇文章 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-3">关于 AgentClaw</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">AI 驱动的三人运营系统，七成内容由 AI 生成并持续优化。我们的使命是让一人公司拥有百人团队的产能。</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="tag bg-gray-200 text-gray-600">Next.js</span>
            <span className="tag bg-gray-200 text-gray-600">Vercel</span>
            <span className="tag bg-gray-200 text-gray-600">AI 驱动</span>
            <span className="tag bg-gray-200 text-gray-600">SEO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
