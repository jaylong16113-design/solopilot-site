import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentClaw | AI电商工具·穿搭·一人公司",
  description: "一个域名三个内容站：AI电商工具评测、男装穿搭指南、一人公司自动化运营方案",
};

const sites = [
  {
    key: "tool",
    title: "AI电商工具站",
    desc: "免费AI工具实测、电商运营教程、Shopify/淘宝/拼多多攻略",
    emoji: "⚡",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
    count: "19",
  },
  {
    key: "wear",
    title: "男装穿搭指南",
    desc: "西服选购、面料知识、搭配法则、从入门到精通的完整路线图",
    emoji: "👔",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    count: "18",
  },
  {
    key: "ops",
    title: "一人公司运营",
    desc: "AI自动化工作流、SEO策略、CPS变现、零成本创业路线图",
    emoji: "🚀",
    color: "from-amber-500 to-orange-400",
    bg: "bg-amber-50",
    count: "18",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient px-4 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            一个域名 · 三个内容站 · 57篇文章
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            OPS Solo System
          </h1>
          <p className="text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
            AI电商工具评测 × 男装穿搭指南 × 一人公司自动化运营<br/>
            一个人运营三个内容站的完整实践
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {sites.map(s => (
              <Link key={s.key} href={`/${s.key}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                <span>{s.emoji}</span> {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {[
            { n: "57", label: "文章" },
            { n: "63", label: "静态页面" },
            { n: "3", label: "内容站点" },
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
            <Link key={s.key} href={`/${s.key}`} className="feature-card animate-fade-in-up block no-underline" style={{animationDelay: `${i*0.1}s`}}>
              <div className={`card-icon bg-gradient-to-br ${s.color} text-white mb-4`}>
                {s.emoji}
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <span>浏览 {s.count} 篇文章</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-3">关于 AgentClaw</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
            这是一个一人公司自动化运营的实践项目。通过 AI 工具完成内容创作、
            SEO 优化和数据分析，一个人管理三个内容站。
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="tag bg-gray-200 text-gray-600">Next.js</span>
            <span className="tag bg-gray-200 text-gray-600">Vercel</span>
            <span className="tag bg-gray-200 text-gray-600">AI 驱动内容</span>
            <span className="tag bg-gray-200 text-gray-600">SEO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
