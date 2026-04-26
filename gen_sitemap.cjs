const fs = require("fs");
const path = require("path");

const base = "https://agentclaw.sale";
const idxPath = path.join(process.cwd(), "src", "lib", "content", "index.json");
const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));

let urls = [
  { loc: base, priority: "1.0" },
  { loc: base + "/tool", priority: "0.9" },
  { loc: base + "/wear", priority: "0.9" },
  { loc: base + "/ops", priority: "0.9" },
];

(idx.tool || []).forEach(a => urls.push({ loc: base + "/tool/" + a.slug, priority: "0.7" }));
(idx.wear || []).forEach(a => urls.push({ loc: base + "/wear/" + a.slug, priority: "0.7" }));
(idx.ops || []).forEach(a => urls.push({ loc: base + "/ops/" + a.slug, priority: "0.7" }));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), xml);
console.log("sitemap.xml generated with " + urls.length + " URLs");
