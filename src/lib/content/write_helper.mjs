import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_BASE = __dirname;

export function writeArticle(lang, slug, title, excerpt, content) {
  const obj = { slug, title, excerpt, content, site: 'tool' };
  const json = JSON.stringify(obj, null, 2);
  const outPath = path.join(CONTENT_BASE, lang, `${slug}.json`);
  const parsed = JSON.parse(json);
  if (parsed.slug !== slug) throw new Error(`Validation failed for ${slug}`);
  fs.writeFileSync(outPath, json, 'utf8');
  const cLen = content.length;
  console.log(`✓ ${slug} [${lang}] (${json.length}B, content: ${cLen} chars)`);
  return { bytes: json.length, chars: cLen };
}
