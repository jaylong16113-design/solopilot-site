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
    const p = path.join(process.cwd(), "src", "lib", "content", "en", `${slug}.json`);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch { return null; }
}

export async function generateStaticParams() {
  const idxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
  if (!fs.existsSync(idxPath)) return [];
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  return (idx.wear || []).map((a: any) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return { 
    title: a?.title || "Article", 
    description: a?.excerpt,
    openGraph: { title: a?.title, description: a?.excerpt, type: "article" },
  };
}

const heroImages: Record<string, string> = {
  "first-suit-guide": "/images/suit-buying-guide.jpg",
  "suit-color-guide": "/images/suit-color.jpg",
  "suit-styling-rules": "/images/suit-styling.jpg",
  "suit-fabric-guide": "/images/suit-fabric.jpg",
  "suit-measure-guide": "/images/suit-measure.jpg",
  "business-wear-101": "/images/business-wear.jpg",
  "suit-care-guide": "/images/suit-care.jpg",
  "suit-ironing-guide": "/images/suit-care.jpg",
  "suit-materials-tech": "/images/suit-design.jpg",
  "suit-mistakes-beginners": "/images/suit-buying-guide.jpg",
  "suit-occasion-guide": "/images/suit-color.jpg",
  "suit-online-shopping-tips": "/images/suit-shopping.jpg",
  "suit-seasonal-guide": "/images/suit-design.jpg",
  "suit-shoes-guide": "/images/suit-shoes.jpg",
  "suit-size-guide": "/images/suit-measure.jpg",
  "suit-trends-2026": "/images/suit-styling.jpg",
  "suit-underwear-guide": "/images/suit-underwear.jpg",
  "sports-suit-vs-suit": "/images/sports-suit.jpg",
};

export default async function ArticlePage({ params }: any) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const heroImg = heroImages[slug] || "/images/suit-styling.jpg";

const sectionName = "wear";
const sectionNames: Record<string, string> = { tool: "AI Tools", wear: "Fashion", ops: "Ops", mood: "Moods" };
const sectionAbout: Record<string, string> = { tool: "AI tools", wear: "men fashion", ops: "solo business", mood: "emotional short videos" };
const sectionArticleSections: Record<string, string> = { tool: "AI Tools", wear: "Fashion", ops: "Ops", mood: "Moods" };
const sectionImage: Record<string, string> = { tool: "/images/ai-tools.jpg", wear: "/images/business-suit.jpg", ops: "/images/ops-collage.jpg", mood: "/images/ecommerce-dashboard.jpg" };

function getIndex(): any[] {
  try {
    const idxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
    return JSON.parse(fs.readFileSync(idxPath, "utf8"))[sectionName] || [];
  } catch { return []; }
}

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://agentclaw.sale/en/${sectionName}/${slug}`,
        "url": `https://agentclaw.sale/en/${sectionName}/${slug}`,
        "name": article.title,
        "description": article.excerpt,
        "inLanguage": "en-US",
        "isPartOf": {
          "@id": "https://agentclaw.sale/"
        },
        "breadcrumb": {
          "@id": `https://agentclaw.sale/en/${sectionName}/${slug}#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://agentclaw.sale/en/${sectionName}/${slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://agentclaw.sale/en" },
          { "@type": "ListItem", "position": 2, "name": sectionNames[sectionName], "item": `https://agentclaw.sale/en/${sectionName}` },
          { "@type": "ListItem", "position": 3, "name": article.title }
        ]
      },
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "url": `https://agentclaw.sale/en/${sectionName}/${slug}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://agentclaw.sale/en/${sectionName}/${slug}`
        },
        "image": `https://agentclaw.sale${heroImg}`,
        "datePublished": "2026-04-26",
        "author": { "@type": "Organization", "name": "AgentClaw" },
        "publisher": { "@type": "Organization", "name": "AgentClaw" },
        "about": { "@type": "Thing", "name": sectionAbout[sectionName] },
        "articleSection": sectionArticleSections[sectionName]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto article-content">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 px-4 pt-6">
          <Link href="/en" className="hover:text-gray-200">Home</Link>
          <span>/</span>
          <Link href="/en/wear" className="hover:text-gray-200">Style Guide</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[120px]">{article.title}</span>
        </div>
        <div className="relative w-full h-56 md:h-72 mb-6 rounded-xl overflow-hidden mx-4" style={{width: "calc(100% - 2rem)"}}>
          <Image src={heroImg} alt={article.title} fill className="object-cover" priority />
        </div>
        <div className="px-4">
          <h1 className="text-xl md:text-3xl font-extrabold mb-2 leading-tight">{article.title}</h1>
          <p className="text-sm text-gray-400 mb-6 border-l-2 border-purple-500/50 pl-3 italic">{article.excerpt}</p>
          <div className="prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                img({ src, alt }) {
                  const imgSrc = typeof src === "string" ? src : "";
                  return (
                    <span className="block my-6">
                      <Image src={imgSrc} alt={alt || ""} width={800} height={400} className="rounded-xl object-cover w-full h-auto shadow-sm" />
                    </span>
                  );
                },
                h2({ children }) { return <h2 className="text-lg md:text-xl font-bold mt-10 mb-4 pb-2 border-b border-gray-700">{children}</h2>; },
                h3({ children }) { return <h3 className="text-base md:text-lg font-semibold mt-6 mb-3">{children}</h3>; },
                ul({ children }) { return <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>; },
                ol({ children }) { return <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>; },
                table({ children }) {
                  return (<div className="overflow-x-auto mb-6"><table className="min-w-full border-collapse border border-gray-700 text-sm rounded-lg overflow-hidden">{children}</table></div>);
                },
                th({ children }) { return <th className="border border-gray-700 bg-gray-800 px-3 py-2 text-left text-xs font-semibold text-gray-200">{children}</th>; },
                td({ children }) { return <td className="border border-gray-700 px-3 py-2 text-sm text-gray-200">{children}</td>; },
                blockquote({ children }) { return <blockquote className="border-l-4 border-purple-500/50 bg-white/5 px-4 py-3 my-6 italic text-gray-300 text-sm rounded-r-lg">{children}</blockquote>; },
                p({ children }) { return <p className="mb-4 leading-relaxed text-gray-200 text-sm md:text-base">{children}</p>; }
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-700">
            <span className="tag bg-amber-900/40 text-amber-300">Solo</span>
            <span className="tag bg-gray-700 text-gray-300">Ops</span>
            <span className="tag bg-gray-700 text-gray-300">Automation</span>
          </div>
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-700 text-sm">
            <Link href="/en/wear" className="text-purple-400 hover:text-purple-300">← Back to Style Guide</Link>
            <Link href="/en" className="text-gray-400 hover:text-gray-300">Home →</Link>
          </div>
        </div>
      </article>
    </>
  );
}
