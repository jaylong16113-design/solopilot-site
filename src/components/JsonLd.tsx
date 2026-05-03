"use client";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  site: string;
  lang: string;
}

const siteLabels: Record<string, Record<string, string>> = {
  tool: { zh: "AI工具站", en: "AI Tools" },
  wear: { zh: "穿搭站", en: "Fashion" },
  ops: { zh: "运营站", en: "Solo Ops" },
  mood: { zh: "情绪短视频", en: "Mood Videos" },
};

export function ArticleJsonLd({ title, description, url, datePublished, site, lang }: ArticleJsonLdProps) {
  const label = siteLabels[site]?.[lang] || site;
  const sitePath = lang === "en" ? `/en/${site}` : `/${site}`;
  const inLanguage = lang === "zh" ? "zh-CN" : "en";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: datePublished,
    author: { "@type": "Organization", "name": "AgentClaw" },
    publisher: { "@type": "Organization", "name": "AgentClaw", "url": "https://agentclaw.sale" },
    inLanguage: inLanguage,
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", "position": 1, "name": "AgentClaw", "item": "https://agentclaw.sale" },
      { "@type": "ListItem", "position": 2, "name": label, "item": `https://agentclaw.sale${sitePath}` },
      { "@type": "ListItem", "position": 3, "name": title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
