import Link from "next/link";

const articles = [
  { title: "一人公司是什么？为什么现在是最好的时代", slug: "what-is-solo-company", date: "即将发布" },
  { title: "AI自动化工作流的完整搭建教程", slug: "ai-automation-workflow", date: "即将发布" },
  { title: "零成本从0到1一人公司路线图", slug: "zero-cost-roadmap", date: "即将发布" },
  { title: "一人公司必用的15个免费工具", slug: "15-free-tools-solo", date: "即将发布" },
];

export default function OpsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">一人公司/AI自动化创业站</h1>
        <p className="text-gray-500 mt-2">从零到一，记录一人公司的完整创业过程</p>
      </section>

      <div className="space-y-1 border-t border-gray-100 pt-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/ops/${a.slug}`}
            className="flex items-center justify-between py-3 group">
            <span className="text-sm group-hover:text-blue-600 transition-colors">{a.title}</span>
            <span className="text-xs text-gray-400">{a.date}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
