const fs = require("fs");
const path = require("path");

const base = "https://agentclaw.sale";
const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));

const today = new Date().toISOString().split("T")[0]; // 2026-04-27

let urls = [];

// Home page
urls.push({ loc: base, priority: "1.0", changefreq: "weekly", lastmod: today });

// Chinese list pages
urls.push({ loc: base + "/tool", priority: "0.9", changefreq: "weekly", lastmod: today });
urls.push({ loc: base + "/wear", priority: "0.9", changefreq: "weekly", lastmod: today });
urls.push({ loc: base + "/ops", priority: "0.9", changefreq: "weekly", lastmod: today });
urls.push({ loc: base + "/mood", priority: "0.9", changefreq: "weekly", lastmod: today });

// Chinese article pages
(idx.tool || []).forEach(a => urls.push({ loc: base + "/tool/" + a.slug, priority: "0.8", changefreq: "weekly", lastmod: today }));
(idx.wear || []).forEach(a => urls.push({ loc: base + "/wear/" + a.slug, priority: "0.8", changefreq: "weekly", lastmod: today }));
(idx.ops || []).forEach(a => urls.push({ loc: base + "/ops/" + a.slug, priority: "0.8", changefreq: "weekly", lastmod: today }));
(idx.mood || []).forEach(a => urls.push({ loc: base + "/mood/" + a.slug, priority: "0.8", changefreq: "weekly", lastmod: today }));

// Add English versions if en/index.json exists
const enIdxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
if (fs.existsSync(enIdxPath)) {
  const enIdx = JSON.parse(fs.readFileSync(enIdxPath, "utf8"));
  urls.push({ loc: base + "/en", priority: "0.9", changefreq: "weekly", lastmod: today });
  urls.push({ loc: base + "/en/tool", priority: "0.8", changefreq: "weekly", lastmod: today });
  urls.push({ loc: base + "/en/wear", priority: "0.8", changefreq: "weekly", lastmod: today });
  urls.push({ loc: base + "/en/ops", priority: "0.8", changefreq: "weekly", lastmod: today });
  urls.push({ loc: base + "/en/mood", priority: "0.8", changefreq: "weekly", lastmod: today });
  (enIdx.tool || []).forEach(a => urls.push({ loc: base + "/en/tool/" + a.slug, priority: "0.7", changefreq: "weekly", lastmod: today }));
  (enIdx.wear || []).forEach(a => urls.push({ loc: base + "/en/wear/" + a.slug, priority: "0.7", changefreq: "weekly", lastmod: today }));
  (enIdx.ops || []).forEach(a => urls.push({ loc: base + "/en/ops/" + a.slug, priority: "0.7", changefreq: "weekly", lastmod: today }));
  (enIdx.mood || []).forEach(a => urls.push({ loc: base + "/en/mood/" + a.slug, priority: "0.7", changefreq: "weekly", lastmod: today }));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
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
