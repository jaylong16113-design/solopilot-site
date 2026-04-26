const fs = require("fs");
const path = require("path");

const BASE = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site";
let errors = [];
let warnings = [];

// 1. 检查所有JSON文件是否可解析 + 字数达标
const dirs = ["zh", "en"];
dirs.forEach((lang) => {
  const d = path.join(BASE, "src", "lib", "content", lang);
  if (!fs.existsSync(d)) return;
  const files = fs.readdirSync(d).filter((f) => f.endsWith(".json") && f !== "index.json");
  const index = path.join(d, "index.json");
  if (!fs.existsSync(index)) {
    errors.push(`${lang}/index.json not found`);
    return;
  }
  let idx;
  try {
    idx = JSON.parse(fs.readFileSync(index, "utf8"));
  } catch (e) {
    errors.push(`${lang}/index.json parse error`);
    return;
  }
  // Check index has tool/wear/ops arrays
  ["tool", "wear", "ops"].forEach((site) => {
    if (!Array.isArray(idx[site])) errors.push(`${lang}/index.json missing ${site} array`);
  });

  const indexSlugs = new Set(
    (idx.tool || [])
      .concat(idx.wear || [])
      .concat(idx.ops || [])
      .map((a) => a.slug)
  );

  files.forEach((f) => {
    const slug = f.replace(".json", "");
    const p = path.join(d, f);
    let content;
    try {
      content = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      errors.push(`JSON broken: ${lang}/${f}`);
      return;
    }
    if (typeof content.content !== "string" || content.content.length < 2000) {
      errors.push(`Short content: ${lang}/${f} (${content.content?.length || 0} chars)`);
    }
    if (!content.title) warnings.push(`No title: ${lang}/${f}`);
    if (!content.site) errors.push(`No site field: ${lang}/${f}`);
    if (!indexSlugs.has(slug)) errors.push(`Not in index: ${lang}/${f}`);
  });

  // Check for files in index but missing on disk
  const onDisk = new Set(files.map((f) => f.replace(".json", "")));
  indexSlugs.forEach((s) => {
    if (!onDisk.has(s)) errors.push(`In index but no file: ${lang}/${s}`);
  });
});

// 2. 检查pages路由完全
const enPages = path.join(BASE, "src", "app", "en");
["tool", "wear", "ops"].forEach((s) => {
  const p = path.join(enPages, s, "[slug]", "page.tsx");
  if (!fs.existsSync(p)) errors.push(`Missing route: /en/${s}/[slug]/page.tsx`);
  const pl = path.join(enPages, s, "page.tsx");
  if (!fs.existsSync(pl)) errors.push(`Missing route: /en/${s}/page.tsx`);
  const c = path.join(BASE, "src", "app", s, "[slug]", "page.tsx");
  if (!fs.existsSync(c)) errors.push(`Missing route: /${s}/[slug]/page.tsx`);
  const cl = path.join(BASE, "src", "app", s, "page.tsx");
  if (!fs.existsSync(cl)) errors.push(`Missing route: /${s}/page.tsx`);
});

// 3. 检查图片文件
const imgDir = path.join(BASE, "public", "images");
if (fs.existsSync(imgDir)) {
  const imgs = fs.readdirSync(imgDir);
  if (imgs.length === 0) warnings.push("No images in public/images/");
  // Check referenced images in content
  console.log(`Images: ${imgs.length} files`);
}

// 4. 检查关键配置文件
const checks = [
  ["robots.txt", path.join(BASE, "public", "robots.txt")],
  ["sitemap.cjs", path.join(BASE, "gen_sitemap.cjs")],
  ["next.config.js", path.join(BASE, "next.config.js")],
];
checks.forEach(([name, p]) => {
  if (!fs.existsSync(p)) errors.push(`Missing: ${name}`);
});

// 5. 检查sitemap URL数
const sitemap = path.join(BASE, "public", "sitemap.xml");
if (fs.existsSync(sitemap)) {
  const sm = fs.readFileSync(sitemap, "utf8");
  const urls = (sm.match(/<url>/g) || []).length;
  console.log(`sitemap URLs: ${urls}`);
}

// Report
console.log(`\n=== PRE-FLIGHT CHECK ===`);
console.log(`Errors: ${errors.length}`);
errors.forEach((e) => console.log(`  ❌ ${e}`));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
console.log(`Status: ${errors.length === 0 ? "✅ PASS" : "❌ FAIL"}`);

if (errors.length > 0) process.exit(1);
