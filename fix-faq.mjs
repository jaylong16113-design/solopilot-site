import fs from 'fs';

const slugs = [
  'silent-diary-intro',
  'silent-diary-narrative', 
  'emotional-prompt-engineering',
  'mood-camera-language',
  'ai-digital-human-realistic'
];

function fixFAQ(content) {
  // Fix Chinese FAQ: 把 Q: xxx A: xxx 改成 Q: xxx 空行 A: xxx 空行
  // zh: "Q：……A：……" → "Q：……\n\nA：……\n\n"
  content = content.replace(/([。？])\n*Q[：:]/g, '$1\n\nQ：');
  content = content.replace(/([。？])\n*A[：:]/g, '$1\n\nA：');
  
  // Fix English FAQ: "Q: ...... A: ......" -> "Q: ......\n\nA: ......"
  content = content.replace(/([?.!])\n*Q[：: ]/g, '$1\n\nQ: ');
  content = content.replace(/([?.!])\n*A[：: ]/g, '$1\n\nA: ');

  return content;
}

['zh', 'en'].forEach(lang => {
  slugs.forEach(slug => {
    const path = `src/lib/content/${lang}/${slug}.json`;
    const raw = fs.readFileSync(path, 'utf8');
    const d = JSON.parse(raw);
    const before = d.content.length;
    d.content = fixFAQ(d.content);
    
    // Find FAQ section and print before/after
    const faqIdx = d.content.lastIndexOf('## FAQ') >= 0 ? d.content.lastIndexOf('## FAQ') : d.content.lastIndexOf('## FAQ');
    let faqText = '';
    if (faqIdx >= 0) {
      faqText = d.content.slice(faqIdx, faqIdx + 400);
    }
    
    // Write
    fs.writeFileSync(path, JSON.stringify(d, null, 2), 'utf8');
    
    // Verify JSON
    JSON.parse(fs.readFileSync(path, 'utf8'));
    
    const qCount = (d.content.match(/Q[：:]/g) || []).length;
    const aCount = (d.content.match(/A[：:]/g) || []).length;
    const brCount = (d.content.match(/A[：:].*?\n\n/g) || []).length;
    
    console.log(`${lang}/${slug}: ${before}c -> ${d.content.length}c | Q=${qCount} A=${aCount}`);
  });
});

// Verify check_json
console.log('\nRunning check...');
const { execSync } = await import('child_process');
try {
  execSync('node check_json.js', { cwd: process.cwd(), stdio: 'inherit' });
} catch(e) {
  process.exit(1);
}
