import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { title: "一人公司", description: "一人公司方法论+AI自动化实战" };

export default function OpsPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.ops || []));
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">一人公司/AI自动化创业站</h1>
        <p className="text-gray-500 mt-2 text-sm">从零到一，记录一人公司的完整创业过程</p>
      </section>
      <div className="border-t border-gray-100 pt-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/ops/${a.slug}`}
            className="block py-3 border-b border-gray-50 group">
            <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">{a.title}</span>
            <p className="text-xs text-gray-400 mt-1">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
