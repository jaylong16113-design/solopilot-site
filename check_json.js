const fs = require("fs");
const path = require("path");

// Only run locally - skip on Vercel/Servers
if (process.env.VERCEL || process.env.NOW) {
  console.log("=== PRE-FLIGHT CHECK: SKIPPED (Vercel env) ===");
  process.exit(0);
}

const BASE = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site";

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

    const text = content.content || "";
    
    // Content length check
    if (typeof text !== "string" || text.length < 2000) {
      errors.push(`Short content: ${lang}/${f} (${text.length} chars)`);
    }

    // --- PARAGRAPH STRUCTURE CHECKS ---

    // Check 1: Must have at least one ## heading
    const headings = text.match(/^## /gm);
    if (!headings || headings.length < 3) {
      errors.push(`Too few h2 sections: ${lang}/${f} (${headings?.length || 0} h2)`);
    }

    // Check 2: Must have double-newline paragraph breaks
    const doubleNewlines = (text.match(/\n\n/g) || []).length;
    if (doubleNewlines < 5) {
      errors.push(`Too few paragraph breaks: ${lang}/${f} (${doubleNewlines} double-newlines)`);
    }

    // Check 3: longest paragraph (block between \n\n) should not exceed 800 chars
    // (no single massive block of text without breaks)
    const paragraphs = text.split(/\n\n+/);
    let maxParaLen = 0;
    let maxParaIdx = -1;
    paragraphs.forEach((para, i) => {
      const clean = para.replace(/^#+ /gm, "").replace(/^!\[.*\]\(.*\)$/gm, "").trim();
      if (clean.length > maxParaLen) {
        maxParaLen = clean.length;
        maxParaIdx = i;
      }
    });
    if (maxParaLen > 1200) {
      errors.push(`Giant paragraph (${maxParaLen} chars): ${lang}/${f} — para #${maxParaIdx}`);
    }

    // Check 4: content should not contain raw HTML tags (should be markdown)
    if (/<[a-z]+>/i.test(text) && !/```[\s\S]*?```/g.test(text)) {
      warnings.push(`Contains HTML tags: ${lang}/${f}`);
    }

    if (!content.title) warnings.push(`No title: ${lang}/${f}`);
    if (!content.site) errors.push(`No site field: ${lang}/${f}`);
    if (!indexSlugs.has(slug)) errors.push(`Not in index: ${lang}/${f}`);
  });

  const onDisk = new Set(files.map((f) => f.replace(".json", "")));
  indexSlugs.forEach((s) => { if (!onDisk.has(s)) errors.push(`In index but no file: ${lang}/${s}`); });
});

// 2. Check key config files
const configs = [
  ["robots.txt", BASE, "public", "robots.txt"],
  ["gen_sitemap.cjs", BASE, "gen_sitemap.cjs"],
  ["next.config.js", BASE, "next.config.js"],
];
configs.forEach(([name, ...parts]) => {
  const p = path.join(...parts);
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
