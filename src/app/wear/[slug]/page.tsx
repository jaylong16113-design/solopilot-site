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
  return { title: a?.title || "文章", description: a?.excerpt };
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

  return (
    <article className="max-w-3xl mx-auto article-content">
      <Link href="/wear" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-block">← 返回列表</Link>
      
      <div className="relative w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
        <Image src={heroImg} alt={article.title} fill className="object-cover" priority />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{article.excerpt}</p>
      
      <div className="prose prose-gray max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img({ src, alt }) {
              const imgSrc = typeof src === "string" ? src : "";
              return (
                <span className="block my-4">
                  <Image src={imgSrc} alt={alt || ""} width={800} height={400} className="rounded-lg object-cover w-full h-auto" />
                </span>
              );
            },
            h2({ children }) { return <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-gray-100">{children}</h2>; },
            h3({ children }) { return <h3 className="text-lg font-semibold mt-6 mb-3">{children}</h3>; },
            ul({ children }) { return <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>; },
            ol({ children }) { return <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>; },
            table({ children }) {
              return <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse border border-gray-200 text-sm">{children}</table></div>;
            },
            th({ children }) { return <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold">{children}</th>; },
            td({ children }) { return <td className="border border-gray-200 px-3 py-2">{children}</td>; },
            blockquote({ children }) { return <blockquote className="border-l-4 border-blue-200 bg-blue-50 px-4 py-3 my-4 italic text-gray-600">{children}</blockquote>; },
            p({ children }) { return <p className="mb-4 leading-relaxed text-gray-700">{children}</p>; }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
      
      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-2">觉得有用？分享给朋友</p>
        <div className="flex justify-center gap-3 text-xs text-gray-400">
          <span>男装穿搭站 · 从入门到精通</span>
        </div>
      </div>
    </article>
  );
}
