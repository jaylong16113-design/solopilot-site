const fs = require("fs");
const path = require("path");

const enDir = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site\\src\\lib\\content\\en";
const zhIdxPath = "C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site\\src\\lib\\content\\zh\\index.json";

const zhIdx = JSON.parse(fs.readFileSync(zhIdxPath, "utf8"));

const index = { tool: [], wear: [], ops: [] };

const files = fs.readdirSync(enDir).filter(f => f.endsWith(".json") && f !== "index.json");

files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(enDir, f), "utf8"));
    if (!data.slug || !data.title) return;
    const slug = data.slug;
    // determine site from zh index
    if (zhIdx.tool.some(a => a.slug === slug)) index.tool.push({ slug, title: data.title, excerpt: data.excerpt || "" });
    else if (zhIdx.wear.some(a => a.slug === slug)) index.wear.push({ slug, title: data.title, excerpt: data.excerpt || "" });
    else if (zhIdx.ops.some(a => a.slug === slug)) index.ops.push({ slug, title: data.title, excerpt: data.excerpt || "" });
  } catch (e) {
    console.error("Error reading", f, e.message);
  }
});

fs.writeFileSync(path.join(enDir, "index.json"), JSON.stringify(index, null, 2), "utf8");
console.log("en/index.json created");
console.log("tool:", index.tool.length, "wear:", index.wear.length, "ops:", index.ops.length);
