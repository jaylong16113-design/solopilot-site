import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">AgentClaw</h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          AI电商工具 · 男士穿搭指南 · 一人公司自动化运营<br />
          <span className="text-sm text-gray-400">一个域名，三个内容站，一套自动化系统</span>
        </p>
      </section>

      {/* Three Sites */}
      <div className="grid md:grid-cols-3 gap-6">
        <SiteCard
          href="/tool"
          emoji="🛠️"
          title="AI电商工具站"
          desc="免费AI工具教程、电商运营干货、跨境出海指南。面向中小电商卖家的实用内容平台。"
          tags={["AI工具教程", "电商运营", "跨境出海"]}
        />
        <SiteCard
          href="/wear"
          emoji="👔"
          title="穿搭内容站"
          desc="专注男士商务穿搭、西服选购、职场形象。真实的穿搭指南，从入门到精致。"
          tags={["西装选购", "穿搭教程", "职场穿搭"]}
        />
        <SiteCard
          href="/ops"
          emoji="🤖"
          title="一人公司创业站"
          desc="记录一人公司方法论、AI自动化实战、赚钱案例。从0到1的完整创业路线图。"
          tags={["AI自动化", "一人公司", "工具推荐"]}
        />
      </div>

      {/* Latest */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">最新内容</h2>
        <p className="text-gray-400 text-sm">正在建设中，敬请期待...</p>
      </section>
    </div>
  );
}

function SiteCard({ href, emoji, title, desc, tags }: {
  href: string; emoji: string; title: string; desc: string; tags: string[];
}) {
  return (
    <Link href={href} className="block p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">{t}</span>
        ))}
      </div>
    </Link>
  );
}
