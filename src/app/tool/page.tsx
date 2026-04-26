import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = { title: "AI电商工具", description: "免费AI电商工具教程、电商运营干货" };

export default function ToolPage() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
  const articles: { slug: string; title: string; excerpt: string }[] = [];
  if (fs.existsSync(idxPath)) {
    const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    articles.push(...(idx.tool || []));
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">AI电商工具站</h1>
        <p className="text-gray-500 mt-2 text-sm">免费AI电商工具教程和电商运营干货</p>
      </section>
      <div className="border-t border-gray-100 pt-4">
        {articles.map(a => (
          <Link key={a.slug} href={`/tool/${a.slug}`}
            className="block py-3 border-b border-gray-50 group">
            <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">{a.title}</span>
            <p className="text-xs text-gray-400 mt-1">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
