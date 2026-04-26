import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  site: string;
}

function getArticle(slug: string): Article | null {
  try {
    const p = path.join(process.cwd(), "src", "lib", "content", `${slug}.json`);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
  if (!fs.existsSync(idxPath)) return [];
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  return (idx.tool || []).map((a: any) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return { title: a?.title || "文章", description: a?.excerpt };
}

// Image mapping based on article slug
const articleImages: Record<string, string> = {
  "free-ai-product-image-tools": "/images/ai-tools.jpg",
  "chatgpt-taobao-title-prompts": "/images/ai-tools.jpg",
  "ai-remove-background-comparison": "/images/tool-collage1.jpg",
  "taobao-seo-guide-2026": "/images/ai-tools.jpg",
  "ai-product-description-writer": "/images/tool-collage2.jpg",
  "cross-border-ecommerce-ai-tools": "/images/translation.jpg",
  "taobao-live-ai-digital-human": "/images/video-editing.jpg",
  "10-free-ecommerce-tools": "/images/tool-collage1.jpg",
  "ai-customer-service-automation": "/images/tool-collage2.jpg",
  "pinduoduo-zero-cost-traffic": "/images/ai-tools.jpg",
  "ai-ecommerce-data-analysis": "/images/ecommerce-data.jpg",
  "ecommerce-funnel-optimization": "/images/ecommerce-funnel.jpg",
  "shopify-free-apps-2026": "/images/shopify-free.jpg",
  "taobao-keyword-tool-free": "/images/taobao-keyword.jpg",
  "wechat-xiaohongshu-ecommerce-traffic": "/images/social-media-traffic.jpg",
  "ai-tools-2026-comparison": "/images/ai-comparison.jpg",
  "ai-free-video-editing-ecommerce": "/images/video-editing.jpg",
  "aliexpress-ai-translation-tools": "/images/translation.jpg",
  "shein-temu-ai-tools": "/images/shein-temu.jpg",
};

const sectionImages: Record<string, string[]> = {
  "free-ai-product-image-tools": ["/images/ai-tools.jpg", "/images/tool-collage1.jpg"],
  "chatgpt-taobao-title-prompts": ["/images/tool-collage2.jpg"],
  "taobao-seo-guide-2026": ["/images/ai-tools.jpg"],
  "ai-product-description-writer": ["/images/tool-collage1.jpg"],
  "cross-border-ecommerce-ai-tools": ["/images/translation.jpg", "/images/ai-tools.jpg"],
  "ai-remove-background-comparison": ["/images/tool-collage2.jpg"],
  "taobao-live-ai-digital-human": ["/images/video-editing.jpg"],
  "ali-express-ai-translation-tools": ["/images/translation.jpg", "/images/ai-tools.jpg"],
  "shein-temu-ai-tools": ["/images/shein-temu.jpg", "/images/ecommerce-data.jpg"],
};

export default async function ArticlePage({ params }: any) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const heroImg = articleImages[slug] || "/images/tool-collage1.jpg";
  const sections = sectionImages[slug] || [];

  return (
    <article className="max-w-3xl mx-auto article-content">
      <Link href="/tool" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-block">← 返回列表</Link>
      
      {/* Hero image */}
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
              return (
                <span className="block my-4">
                  <Image 
                    src={src || ""} 
                    alt={alt || ""} 
                    width={800} 
                    height={400} 
                    className="rounded-lg object-cover w-full h-auto"
                  />
                </span>
              );
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-gray-100">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-semibold mt-6 mb-3">{children}</h3>;
            },
            ul({ children }) {
              return <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>;
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-gray-200 text-sm">{children}</table>
                </div>
              );
            },
            th({ children }) {
              return <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold">{children}</th>;
            },
            td({ children }) {
              return <td className="border border-gray-200 px-3 py-2">{children}</td>;
            },
            blockquote({ children }) {
              return <blockquote className="border-l-4 border-blue-200 bg-blue-50 px-4 py-3 my-4 italic text-gray-600">{children}</blockquote>;
            },
            p({ children }) {
              return <p className="mb-4 leading-relaxed text-gray-700">{children}</p>;
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-2">觉得有用？分享给朋友</p>
        <div className="flex justify-center gap-3 text-xs text-gray-400">
          <span>AI电商工具站 · 提升效率的好工具</span>
        </div>
      </div>
    </article>
  );
}
