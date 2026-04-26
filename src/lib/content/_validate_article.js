const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'zh', 'zero-cost-user-research.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);
const c = data.content;

const phrases = ['用评论验证产品想法', 'SaaS运营', '被动收入', '自动化工作流', '零成本创业', '零成本创业'];
for (const p of phrases) {
  const idx = c.indexOf(p);
  if (idx > -1) {
    const start = Math.max(0, idx - 20);
    const end = Math.min(c.length, idx + p.length + 80);
    console.log(`Found "${p}" at ${idx}:`);
    console.log('  ...' + c.substring(start, end).replace(/\n/g, '\\n') + '...');
    console.log();
  } else {
    console.log(`NOT found: "${p}"`);
  }
}
