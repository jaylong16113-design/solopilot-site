const fs = require("fs");
const path = require("path");

const base = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site";

// Template for the enhanced JSON-LD section
const jsonLdSection = (sectionName, siteName, aboutStr, articleSectionStr, lang) => `
  // Enhanced JSON-LD with @graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://agentclaw.sale/${sectionName}/\${slug}",
        "url": "https://agentclaw.sale/${sectionName}/\${slug}",
        "name": article.title,
        "description": article.excerpt,
        "inLanguage": "${lang}",
        "isPartOf": {
          "@id": "https://agentclaw.sale/"
        },
        "breadcrumb": {
          "@id": "https://agentclaw.sale/${sectionName}/\${slug}#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://agentclaw.sale/${sectionName}/\${slug}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "${lang === 'zh-CN' ? '首页' : 'Home'}", "item": "https://agentclaw.sale/${lang === 'zh-CN' ? '' : 'en'}" },
          { "@type": "ListItem", "position": 2, "name": "${siteName}", "item": "https://agentclaw.sale/${sectionName}" },
          { "@type": "ListItem", "position": 3, "name": article.title }
        ]
      },
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "url": "https://agentclaw.sale/${sectionName}/\${slug}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://agentclaw.sale/${sectionName}/\${slug}"
        },
        "image": "https://agentclaw.sale\${heroImg}",
        "datePublished": "2026-04-26",
        "author": { "@type": "Organization", "name": "AgentClaw" },
        "publisher": { "@type": "Organization", "name": "AgentClaw" },
        "about": { "@type": "Thing", "name": "${aboutStr}" },
        "articleSection": "${articleSectionStr}"
      }
    ]
  };
`;

function patchFile(filePath, sectionName, siteName, aboutStr, articleSectionStr, lang, isEnDir) {
  if (!fs.existsSync(filePath)) {
    console.log("  SKIP (not found):", filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, "utf8");
  
  // Check if already patched
  if (content.includes("@graph")) {
    console.log("  SKIP (already patched):", filePath);
    return;
  }

  // Check which index.json it reads
  var idxSrc = isEnDir ? 'en/index.json' : 'zh/index.json';
  
  // 1. Find the getArticle line to determine what index.json to use for the list page name
  var section = sectionName.split('/').pop(); // "wear" from "en/wear" or "wear" from "wear"
  var listPageName = siteName; // This is the breadcrumb list page name
  
  // 2. Find the JSON-LD block and replace it
  // Current JSON-LD: starts with const jsonLd = { and ends with };
  var oldJsonLdMatch = content.match(/\n\s+const jsonLd = \{[\s\S]*?\n\s+\};/);
  
  if (!oldJsonLdMatch) {
    console.log("  ERROR: cannot find jsonLd block in", filePath);
    return;
  }
  
  var newCode = jsonLdSection(sectionName, siteName, aboutStr, articleSectionStr, lang);
  content = content.replace(oldJsonLdMatch[0], newCode);
  
  fs.writeFileSync(filePath, content, "utf8");
  console.log("  OK patched:", filePath);
}

// File definitions
const files = [
  // Chinese
  { file: "src/app/wear/[slug]/page.tsx", section: "wear", site: "穿搭站", about: "Men's fashion and suit styling", articleSection: "Men's Fashion", lang: "zh-CN", en: false },
  { file: "src/app/ops/[slug]/page.tsx", section: "ops", site: "运营站", about: "Solo business operations", articleSection: "Solo Business", lang: "zh-CN", en: false },
  { file: "src/app/mood/[slug]/page.tsx", section: "mood", site: "情绪短视频", about: "Emotional short video creation", articleSection: "Emotional Videos", lang: "zh-CN", en: false },
  // English
  { file: "src/app/en/tool/[slug]/page.tsx", section: "en/tool", site: "AI Tools", about: "AI tools for e-commerce", articleSection: "AI Tools", lang: "en-US", en: true },
  { file: "src/app/en/wear/[slug]/page.tsx", section: "en/wear", site: "Style Guide", about: "Men's fashion and suit styling", articleSection: "Men's Fashion", lang: "en-US", en: true },
  { file: "src/app/en/ops/[slug]/page.tsx", section: "en/ops", site: "Solo OPS", about: "Solo business operations", articleSection: "Solo Business", lang: "en-US", en: true },
  { file: "src/app/en/mood/[slug]/page.tsx", section: "en/mood", site: "Mood Videos", about: "Emotional short video creation", articleSection: "Emotional Videos", lang: "en-US", en: true },
];

console.log("Patching slug pages...");
files.forEach(function(f) {
  patchFile(
    path.join(base, f.file),
    f.section,
    f.site,
    f.about,
    f.articleSection,
    f.lang,
    f.en
  );
});
console.log("Done.");
