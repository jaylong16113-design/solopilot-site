const fs = require('fs');
const path = require('path');

const zhDir = path.join(__dirname, 'zh');
const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.json') && f !== 'index.json');

const targetSlugs = [
  'zero-cost-user-research',
  'solo-founder-product-docs',
  'email-list-from-zero',
  'feishu-bitable-project-management',
  'ai-assisted-product-prototyping',
  'customer-success-solo'
];

let passed = 0;
let failed = 0;

for (const targetSlug of targetSlugs) {
  const filePath = path.join(zhDir, `${targetSlug}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ [${targetSlug}] File not found`);
    failed++;
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Required fields
    const required = ['slug', 'title', 'excerpt', 'content', 'site'];
    let errors = [];

    for (const field of required) {
      if (!data[field]) {
        errors.push(`Missing field: ${field}`);
      }
    }

    // Validate slug
    if (data.slug !== targetSlug) {
      errors.push(`Slug mismatch: expected ${targetSlug}, got ${data.slug}`);
    }

    // Validate site
    if (data.site !== 'ops') {
      errors.push(`site should be 'ops', got '${data.site}'`);
    }

    // Validate content length (3000+ chars)
    if (data.content && data.content.length < 3000) {
      errors.push(`Content too short: ${data.content.length} chars (need 3000+)`);
    }

    // Validate content has at least 3 ## headings
    const h2Matches = data.content ? data.content.match(/^## /gm) : [];
    if (!h2Matches || h2Matches.length < 3) {
      errors.push(`Need at least 3 ## headings, found ${h2Matches ? h2Matches.length : 0}`);
    }

    // Validate content has at least 5 paragraph breaks (\n\n)
    const paraBreaks = data.content ? data.content.split('\n\n').length - 1 : 0;
    if (paraBreaks < 5) {
      errors.push(`Need at least 5 paragraph breaks (\\n\\n), found ${paraBreaks}`);
    }

    // Validate hot keywords
    const keywords = ['一人公司', '零成本创业', '内容营销', '自动化工作流', '被动收入', '独立开发者', 'SaaS运营'];
    const missingKeywords = keywords.filter(kw => !data.content || !data.content.includes(kw));
    if (missingKeywords.length > 0) {
      errors.push(`Missing keywords: ${missingKeywords.join(', ')}`);
    }

    if (errors.length === 0) {
      console.log(`✅ [${targetSlug}] Passed (${data.content.length} chars, ${h2Matches.length} headings, ${paraBreaks} breaks)`);
      passed++;
    } else {
      console.log(`❌ [${targetSlug}] Failed:`);
      errors.forEach(e => console.log(`     - ${e}`));
      failed++;
    }
  } catch (e) {
    console.log(`❌ [${targetSlug}] Parse error: ${e.message}`);
    failed++;
  }
}

console.log(`\n=== Summary: ${passed} passed, ${failed} failed out of ${targetSlugs.length} ===`);
