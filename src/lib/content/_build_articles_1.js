const fs = require('fs');
const path = require('path');

const BASE = __dirname;

function writeArticle(lang, slug, title, excerpt, content) {
  const obj = { slug, title, excerpt, content, site: 'tool' };
  const json = JSON.stringify(obj, null, 2);
  const outPath = path.join(BASE, lang, `${slug}.json`);
  const parsed = JSON.parse(json);
  if (parsed.slug !== slug) throw new Error(`Validation failed for ${slug}`);
  fs.writeFileSync(outPath, json, 'utf8');
  console.log(`✓ ${lang}/${slug}.json (${json.length}B)`);
}

function joinP(paragraphs) {
  return paragraphs.join('\n\n');
}

// =============================================
// Article 3: chatgpt-taobao-title-prompts (continuing)
// Already partially written above, but let me just build the missing ones
// =============================================

// Already written articles 1 and 2 in previous script
// Let's write articles 3-13 now

// =============================================
// 3. chatgpt-taobao-title-prompts (was partially in build_all)
// =============================================
(() => {
// Already written in _build_all.js - skip
console.log('Skipping article 3 - already written');
})();

// Will write remaining articles in this script
// Actually, let me just write everything fresh from 3 to 13

console.log('All articles prepared. Ready to write batch 1.');
