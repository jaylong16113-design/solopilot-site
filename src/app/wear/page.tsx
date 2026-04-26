import Link from "next/link";

const articles = [
  { title: "第一次买西服最全指南（从量体到试穿）", slug: "first-suit-guide", date: "即将发布" },
  { title: "西服颜色怎么选：从黑灰蓝到大地色", slug: "suit-color-guide", date: "即将发布" },
  { title: "西服搭配的5个黄金法则", slug: "suit-styling-rules", date: "即将发布" },
  { title: "运动西服和传统西服的区别：选购指南", slug: "sports-suit-vs-suit", date: "即将发布" },
  { title: "男士商务穿搭从入门到精通", slug: "business-wear-101", date: "即将发布" },
];

export default function WearPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">穿搭内容站</h1>
        <p className="text-gray-500 mt-2">男士商务穿搭指南，从入门到精致</p>
      </section>

      <div className="space-y-1 border-t border-gray-100 pt-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/wear/${a.slug}`}
            className="flex items-center justify-between py-3 group">
            <span className="text-sm group-hover:text-blue-600 transition-colors">{a.title}</span>
            <span className="text-xs text-gray-400">{a.date}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
