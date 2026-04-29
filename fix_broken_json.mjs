import { readFileSync, writeFileSync } from 'fs';

const file = 'src/lib/content/zh/mood-xiaohongshu-comment-ops.json';
let content = readFileSync(file, 'utf8');

// Remove stray backslashes before any character (they confound JSON parser)
// but keep valid JSON escapes like \n, \", \\, \/
let result = '';
let inString = false;
for (let i = 0; i < content.length; i++) {
  let ch = content[i];
  if (ch === '"') inString = !inString;
  result += ch;
  if (ch === '\\' && inString) {
    let next = content[i + 1];
    if (next && (next.charCodeAt(0) > 127 || next === '\\' || next === '/' || next === '"' || next === 'n' || next === 't' || next === 'r')) {
      // This is either a valid escape or a backslash before Unicode
      // If it's backslash + unicode char, it's invalid JSON
      if (next.charCodeAt(0) > 127) {
        // Remove the backslash, keep the unicode char
        result = result.slice(0, -1); // remove the backslash we already added
        // next char will be added in the next iteration
      }
    }
  }
}

try {
  JSON.parse(result);
  writeFileSync(file, result, 'utf8');
  console.log('✅ Fixed JSON');
} catch (e) {
  console.log('❌ Still broken:', e.message);
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    console.log('Context:', JSON.stringify(result.slice(Math.max(0, pos - 30), pos + 30)));
  }
}
