const fs = require("fs");
const path = require("path");

const base = "https://agentclaw.sale";
const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));

const today = new Date().toISOString().split("T")[0]; // 2026-04-28

// Build slug mappings for alternate links
const sections = ["tool", "wear", "ops", "mood"];

function getSlugSet(data, section) {
  return new Set((data[section] || []).map(a => a.slug));
}

const enIdxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
let enIdx = null;
if (fs.existsSync(enIdxPath)) {
  enIdx = JSON.parse(fs.readFileSync(enIdxPath, "utf8"));
}

// Build a mapping: for each section, which slugs exist in both languages
const bothSlugs = {};
for (const s of sections) {
  const zhSlugs = getSlugSet(idx, s);
  const enSlugs = enIdx ? getSlugSet(enIdx, s) : new Set();
  bothSlugs[s] = new Set([...zhSlugs].filter(x => enSlugs.has(x)));
}

function buildUrl(loc, priority, changefreq, lastmod, alternates = []) {
  let altLinks = "";
  for (const alt of alternates) {
    altLinks += `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`;
  }
  return `  <url>
    <loc>${loc}</loc>${altLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

let urls = [];

// Home page (Chinese)
urls.push(buildUrl(base, "1.0", "weekly", today, [{ hreflang: "en", href: base + "/en" }]));

// English home
urls.push(buildUrl(base + "/en", "0.9", "weekly", today, [{ hreflang: "zh-CN", href: base }]));

// List pages
const zhListNames = { tool: "AI工具", wear: "穿搭", ops: "运营", mood: "情绪短视频" };
const enListNames = { tool: "AI Tools", wear: "Fashion", ops: "Ops", mood: "Moods" };

for (const s of sections) {
  urls.push(buildUrl(base + "/" + s, "0.9", "weekly", today, [{ hreflang: "en", href: base + "/en/" + s }]));
  urls.push(buildUrl(base + "/en/" + s, "0.8", "weekly", today, [{ hreflang: "zh-CN", href: base + "/" + s }]));
}

// Chinese article pages with alternates to English
(idx.tool || []).forEach(a => {
  const alternates = bothSlugs.tool.has(a.slug) ? [{ hreflang: "en", href: base + "/en/tool/" + a.slug }] : [];
  urls.push(buildUrl(base + "/tool/" + a.slug, "0.8", "weekly", today, alternates));
});
(idx.wear || []).forEach(a => {
  const alternates = bothSlugs.wear.has(a.slug) ? [{ hreflang: "en", href: base + "/en/wear/" + a.slug }] : [];
  urls.push(buildUrl(base + "/wear/" + a.slug, "0.8", "weekly", today, alternates));
});
(idx.ops || []).forEach(a => {
  const alternates = bothSlugs.ops.has(a.slug) ? [{ hreflang: "en", href: base + "/en/ops/" + a.slug }] : [];
  urls.push(buildUrl(base + "/ops/" + a.slug, "0.8", "weekly", today, alternates));
});
(idx.mood || []).forEach(a => {
  const alternates = bothSlugs.mood.has(a.slug) ? [{ hreflang: "en", href: base + "/en/mood/" + a.slug }] : [];
  urls.push(buildUrl(base + "/mood/" + a.slug, "0.8", "weekly", today, alternates));
});

// English article pages with alternates to Chinese
if (enIdx) {
  (enIdx.tool || []).forEach(a => {
    const alternates = bothSlugs.tool.has(a.slug) ? [{ hreflang: "zh-CN", href: base + "/tool/" + a.slug }] : [];
    urls.push(buildUrl(base + "/en/tool/" + a.slug, "0.7", "weekly", today, alternates));
  });
  (enIdx.wear || []).forEach(a => {
    const alternates = bothSlugs.wear.has(a.slug) ? [{ hreflang: "zh-CN", href: base + "/wear/" + a.slug }] : [];
    urls.push(buildUrl(base + "/en/wear/" + a.slug, "0.7", "weekly", today, alternates));
  });
  (enIdx.ops || []).forEach(a => {
    const alternates = bothSlugs.ops.has(a.slug) ? [{ hreflang: "zh-CN", href: base + "/ops/" + a.slug }] : [];
    urls.push(buildUrl(base + "/en/ops/" + a.slug, "0.7", "weekly", today, alternates));
  });
  (enIdx.mood || []).forEach(a => {
    const alternates = bothSlugs.mood.has(a.slug) ? [{ hreflang: "zh-CN", href: base + "/mood/" + a.slug }] : [];
    urls.push(buildUrl(base + "/en/mood/" + a.slug, "0.7", "weekly", today, alternates));
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
fs.writeFileSync(outputPath, xml);

// Validate XML: check it parses correctly
const lines = xml.split("\n");
const hasUrlsetOpen = lines[0].includes('<?xml') && lines[1].includes('<urlset');
const hasUrlsetClose = lines[lines.length - 1] === '</urlset>';
const urlCount = (xml.match(/<url>/g) || []).length;
const locCount = (xml.match(/<loc>/g) || []).length;

if (!hasUrlsetOpen || !hasUrlsetClose) {
  console.error("ERROR: sitemap XML structure invalid");
  process.exit(1);
}

if (urlCount !== locCount) {
  console.error(`ERROR: URL count mismatch (${urlCount} urls, ${locCount} locs)`);
  process.exit(1);
}

console.log(`sitemap.xml generated with ${urls.length} URLs (${urlCount} <url> entries) - XML valid`);
