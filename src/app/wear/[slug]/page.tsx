import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface Article { slug: string; title: string; excerpt: string; content: string; site: string; }

function getArticle(slug: string): Article | null {
  try {
    const p = path.join(process.cwd(), "src", "lib", "content", `${slug}.json`);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch { return null; }
}

export async function generateStaticParams() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
  if (!fs.existsSync(idxPath)) return [];
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  return (idx.wear || []).map((a: any) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return { 
    title: a?.title || "文章", 
    description: a?.excerpt,
    openGraph: { title: a?.title, description: a?.excerpt, type: "article" },
  };
}

const heroImages: Record<string, string> = {
  "first-suit-guide": "/images/suit-buying-guide.jpg",
  "suit-color-guide": "/images/suit-color.jpg",
  "suit-styling-rules": "/images/suit-styling.jpg",
  "sports-suit-vs-suit": "/images/suit-fabric.jpg",
  "business-wear-101": "/images/business-suit.jpg",
  "suit-fabric-guide": "/images/suit-fabric.jpg",
  "suit-measure-guide": "/images/suit-measure.jpg",
  "suit-care-guide": "/images/suit-care.jpg",
  "suit-underwear-guide": "/images/suit-accessories.jpg",
  "suit-size-guide": "/images/suit-measure.jpg",
  "suit-shoes-guide": "/images/suit-shoes.jpg",
  "suit-occasion-guide": "/images/suit-styling.jpg",
  "suit-materials-tech": "/images/suit-fabric.jpg",
  "suit-mistakes-beginners": "/images/suit-buying-guide.jpg",
  "suit-seasonal-guide": "/images/suit-styling.jpg",
  "suit-trends-2026": "/images/suit-color.jpg",
  "suit-online-shopping-tips": "/images/business-suit.jpg",
  "suit-ironing-guide": "/images/suit-care.jpg",
};

export default async function ArticlePage({ params }: any) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const heroImg = heroImages[slug] || "/images/business-suit.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `https://agentclaw.sale/wear/${slug}`,
    author: { "@type": "Organization", name: "AgentClaw" },
    datePublished: "2026-04-26",
    publisher: { "@type": "Organization", name: "AgentClaw" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto article-content">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 px-4 pt-6">
          <Link href="/" className="hover:text-gray-600">首页</Link>
          <span>/</span>
          <Link href="/wear" className="hover:text-gray-600">穿搭</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[120px]">{article.title}</span>
        </div>

        <div className="relative w-full h-56 md:h-72 mb-6 rounded-xl overflow-hidden mx-4" style={{width: "calc(100% - 2rem)"}}>
          <Image src={heroImg} alt={article.title} fill className="object-cover" priority />
        </div>

        <div className="px-4">
          <h1 className="text-xl md:text-3xl font-extrabold mb-2 leading-tight">{article.title}</h1>
          <p className="text-sm text-gray-400 mb-6 border-l-2 border-violet-200 pl-3 italic">{article.excerpt}</p>

          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                img({ src, alt }) {
                  const imgSrc = typeof src === "string" ? src : "";
                  return <span className="block my-6"><Image src={imgSrc} alt={alt || ""} width={800} height={400} className="rounded-xl object-cover w-full h-auto shadow-sm" /></span>;
                },
                h2({ children }) { return <h2 className="text-lg md:text-xl font-bold mt-10 mb-4 pb-2 border-b border-gray-100">{children}</h2>; },
                h3({ children }) { return <h3 className="text-base md:text-lg font-semibold mt-6 mb-3">{children}</h3>; },
                ul({ children }) { return <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>; },
                ol({ children }) { return <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>; },
                table({ children }) { return <div className="overflow-x-auto mb-6"><table className="min-w-full border-collapse border border-gray-200 text-sm rounded-lg overflow-hidden">{children}</table></div>; },
                th({ children }) { return <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-600">{children}</th>; },
                td({ children }) { return <td className="border border-gray-200 px-3 py-2 text-sm">{children}</td>; },
                blockquote({ children }) { return <blockquote className="border-l-4 border-violet-200 bg-violet-50/50 px-4 py-3 my-6 italic text-gray-500 text-sm rounded-r-lg">{children}</blockquote>; },
                p({ children }) { return <p className="mb-4 leading-relaxed text-gray-700 text-sm md:text-base">{children}</p>; }
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            <span className="tag bg-violet-100 text-violet-600">男装穿搭</span>
            <span className="tag bg-gray-100 text-gray-500">西服</span>
            <span className="tag bg-gray-100 text-gray-500">时尚指南</span>
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 text-sm">
            <Link href="/wear" className="text-violet-600 hover:underline">← 返回穿搭列表</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-600">首页 →</Link>
          </div>
        </div>
      </article>
    </>
  );
}
