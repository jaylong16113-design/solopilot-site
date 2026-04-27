import fs from 'fs';

const zhDir = 'src/lib/content/zh';
const enDir = 'src/lib/content/en';

function audit(slug, lang) {
  const raw = fs.readFileSync(`${lang === 'zh' ? zhDir : enDir}/${slug}.json`, 'utf8');
  const d = JSON.parse(raw);

  const txt = d.content;
  const issues = [];

  // 1. Count ## headings
  const h2s = (txt.match(/^## /gm) || []);
  const h3s = (txt.match(/^### /gm) || []);

  // 2. Count "## 总结" / "## Summary" - should be exactly 1
  const summaryZH = (txt.match(/^## 总结$/gm) || []).length;
  const summaryEN = (txt.match(/^## Summary$/gm) || []).length;
  
  // Check for multiple summary-like headings
  const summaryAllZH = (txt.match(/^## 总结/mg) || []).length;
  const summaryAllEN = (txt.match(/^## Summary/mg) || []).length;

  // 3. Check Silent diary / Silent Diary references
  const silentDiaryCount = (txt.match(/Silent Diary/gi) || []).length;

  // 4. Check for images (markdown image syntax)
  const imgCount = (txt.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // 5. Check structure: should have # title, opening, h2 sections
  const hasH1 = txt.startsWith('# ');
  const firstLineEnds = txt.indexOf('\n');

  // Build report
  const header = `\n--- ${lang}/${slug} ---`;
  console.log(header);
  console.log(`Title: ${d.title}`);
  console.log(`Content length: ${txt.length} chars`);
  console.log(`Headings: h1=${hasH1 ? 1 : 0} h2=${h2s.length} h3=${h3s.length}`);
  console.log(`## 总结 occurrences: ${summaryAllZH}`);
  console.log(`## Summary occurrences: ${summaryAllEN}`);
  console.log(`"Silent Diary" references: ${silentDiaryCount}`);
  console.log(`Images: ${imgCount}`);

  // Issues
  if (summaryAllZH > 1) issues.push(`Multiple "## 总结" (${summaryAllZH})`);
  if (summaryAllEN > 1) issues.push(`Multiple "## Summary" (${summaryAllEN})`);
  if (silentDiaryCount < 3) issues.push(`Only ${silentDiaryCount} "Silent Diary" - should reference more`);
  // if (imgCount < 2) issues.push(`Only ${imgCount} images - should have more relevant images`);
  
  if (issues.length > 0) {
    console.log(`ISSUES: ${issues.join('; ')}`);
  } else {
    console.log('OK ✅');
  }
}

console.log('=== AUDIT: content rules ===');
console.log('1. # title + opening (pain point/question) + ## sections + ## FAQ + ## Summary');
console.log('2. Only one ## 总结 / ## Summary');
console.log('3. Reference Silent Diary by name multiple times');
console.log('4. More relevant images');
console.log('5. Mimic viral article structure (short paragraphs, subheadings, bullet points)');

const slugs = ['silent-diary-intro','silent-diary-narrative','emotional-prompt-engineering','mood-camera-language','ai-digital-human-realistic'];

console.log('\n=== ZH ===');
slugs.forEach(s => audit(s, 'zh'));
console.log('\n=== EN ===');
slugs.forEach(s => audit(s, 'en'));
