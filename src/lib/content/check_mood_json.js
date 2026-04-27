const fs = require('fs');
const path = require('path');

const dirs = {
  zh: path.join(__dirname, 'zh'),
  en: path.join(__dirname, 'en'),
};

const slugs = [
  'silent-diary-intro',
  'silent-diary-narrative',
  'emotional-prompt-engineering',
  'mood-camera-language',
  'ai-digital-human-realistic',
];

let passed = 0;
let failed = 0;
let total = 0;

for (const [lang, dir] of Object.entries(dirs)) {
  for (const slug of slugs) {
    total++;
    const filePath = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ [${lang}/${slug}] File not found`);
      failed++;
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const required = ['slug', 'title', 'excerpt', 'content', 'site'];
      let errors = [];

      for (const field of required) {
        if (!data[field]) {
          errors.push(`Missing field: ${field}`);
        }
      }

      if (data.slug !== slug) {
        errors.push(`Slug mismatch: expected ${slug}, got ${data.slug}`);
      }

      if (data.site !== 'mood') {
        errors.push(`site should be 'mood', got '${data.site}'`);
      }

      // Content length check
      const minLen = lang === 'zh' ? 2500 : 2000;
      if (data.content && data.content.length < minLen) {
        errors.push(`Content too short: ${data.content.length} chars (need ${minLen}+)`);
      }

      // Has at least 3 H2 headings
      const h2Matches = data.content ? data.content.match(/^## /gm) : [];
      if (!h2Matches || h2Matches.length < 3) {
        errors.push(`Need at least 3 ## headings, found ${h2Matches ? h2Matches.length : 0}`);
      }

      // Has at least 5 paragraph breaks
      const paraBreaks = data.content ? data.content.split('\n\n').length - 1 : 0;
      if (paraBreaks < 5) {
        errors.push(`Need at least 5 paragraph breaks, found ${paraBreaks}`);
      }

      // Silent Diary mentions (at least 3)
      const sdMatches = data.content ? data.content.match(/Silent Diary/g) : [];
      if (!sdMatches || sdMatches.length < 3) {
        errors.push(`Need at least 3 "Silent Diary" mentions, found ${sdMatches ? sdMatches.length : 0}`);
      }

      // Check for multiple 总结/Summary headings
      if (lang === 'zh') {
        const summaryCount = data.content ? (data.content.match(/^## 总结$/gm) || []).length : 0;
        if (summaryCount > 1) {
          errors.push(`Multiple "## 总结" headings found: ${summaryCount}`);
        }
      } else {
        const summaryCount = data.content ? (data.content.match(/^## Summary$/gm) || []).length : 0;
        if (summaryCount > 1) {
          errors.push(`Multiple "## Summary" headings found: ${summaryCount}`);
        }
      }

      // Check for images
      const imgMatches = data.content ? data.content.match(/!\[.*?\]\(.*?\)/g) : [];
      if (!imgMatches || imgMatches.length < 2) {
        errors.push(`Need at least 2 images, found ${imgMatches ? imgMatches.length : 0}`);
      }

      // Check for no HTML
      if (data.content && /<[^>]+>/.test(data.content)) {
        errors.push('Contains HTML tags');
      }

      if (errors.length === 0) {
        console.log(`✅ [${lang}/${slug}] Passed (${data.content.length} chars, ${h2Matches.length} headings, ${sdMatches.length} SD mentions, ${imgMatches.length} images)`);
        passed++;
      } else {
        console.log(`❌ [${lang}/${slug}] Failed:`);
        errors.forEach(e => console.log(`     - ${e}`));
        failed++;
      }
    } catch (e) {
      console.log(`❌ [${lang}/${slug}] Parse error: ${e.message}`);
      failed++;
    }
  }
}

console.log(`\n=== Summary: ${passed} passed, ${failed} failed out of ${total} ===`);
process.exit(failed > 0 ? 1 : 0);
