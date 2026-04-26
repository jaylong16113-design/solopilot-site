const fs = require("fs");
const path = require("path");

// Only run locally - skip on Vercel/Servers
if (process.env.VERCEL || process.env.NOW) {
  console.log("=== PRE-FLIGHT CHECK: SKIPPED (Vercel env) ===");
  process.exit(0);
}

const BASE = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site";
const SRC = path.join(BASE, "src", "app");

let errors = [];
let warnings = [];

// 1. Check all JSON files
const dirs = ["zh", "en"];
dirs.forEach((lang) => {
  const d = path.join(BASE, "src", "lib", "content", lang);
  if (!fs.existsSync(d)) { errors.push(`${lang} content dir not found`); return; }
  const files = fs.readdirSync(d).filter((f) => f.endsWith(".json") && f !== "index.json");
  const index = path.join(d, "index.json");
  let idx;
  try { idx = JSON.parse(fs.readFileSync(index, "utf8")); }
  catch (e) { errors.push(`${lang}/index.json parse error`); return; }
  
  const indexSlugs = new Set(
    (idx.tool || []).concat(idx.wear || []).concat(idx.ops || []).map((a) => a.slug)
  );

  files.forEach((f) => {
    const slug = f.replace(".json", "");
    const p = path.join(d, f);
    let content;
    try { content = JSON.parse(fs.readFileSync(p, "utf8")); }
    catch (e) { errors.push(`JSON broken: ${lang}/${f}`); return; }
    if (typeof content.content !== "string" || content.content.length < 2000) {
      errors.push(`Short content: ${lang}/${f} (${content.content?.length || 0} chars)`);
    }
    if (!indexSlugs.has(slug)) errors.push(`Not in index: ${lang}/${f}`);
  });

  const onDisk = new Set(files.map((f) => f.replace(".json", "")));
  indexSlugs.forEach((s) => { if (!onDisk.has(s)) errors.push(`In index but no file: ${lang}/${s}`); });
});

// 2. Check key config files
const configs = [
  ["robots.txt", "public", "robots.txt"],
  ["gen_sitemap.cjs", "gen_sitemap.cjs"],
  ["next.config.js", "next.config.js"],
];
configs.forEach(([name, ...parts]) => {
  const p = path.join(BASE, ...parts);
  if (!fs.existsSync(p)) warnings.push(`Missing: ${name}`);
});

// Report
console.log(`\n=== PRE-FLIGHT CHECK ===`);
console.log(`Errors: ${errors.length}`);
errors.forEach((e) => console.log(`  ❌ ${e}`));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
console.log(`Status: ${errors.length === 0 ? "✅ PASS" : "❌ FAIL"}`);

if (errors.length > 0) process.exit(1);
