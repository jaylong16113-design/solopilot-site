const fs = require('fs');
const path = require('path');

// Usage: node _write_one.js <lang> <slug> <title> <excerpt> <contentFile>
const [,, lang, slug, title, excerpt, contentFile] = process.argv;

const content = fs.readFileSync(contentFile, 'utf8').trim();

const obj = {
  slug,
  title,
  excerpt,
  content,
  site: 'tool'
};

const json = JSON.stringify(obj, null, 2);
const outPath = path.resolve(__dirname, lang, `${slug}.json`);

// Validate by parsing back
const parsed = JSON.parse(json);
if (parsed.slug !== slug) throw new Error('Validation failed');

fs.writeFileSync(outPath, json, 'utf8');
console.log(`✓ ${lang}/${slug}.json (${json.length} bytes)`);
