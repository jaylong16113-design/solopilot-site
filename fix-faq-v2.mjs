import fs from 'fs';

const slugs = [
  'silent-diary-intro',
  'silent-diary-narrative', 
  'emotional-prompt-engineering',
  'mood-camera-language',
  'ai-digital-human-realistic'
];

function fixFAQ(content) {
  // Chinese: "Q：问的内容解答内容"
  // → "Q：问的内容\n\n解答内容"
  // Pattern: Q：后面跟着的文字，直到下一个 Q：或 ## 总结 或 ## FAQ
  
  // Split FAQ section from the rest
  const faqIdx = content.lastIndexOf('## FAQ');
  if (faqIdx < 0) return content;
  
  const before = content.slice(0, faqIdx + 6); // includes "## FAQ"
  let faqSection = content.slice(faqIdx + 6);
  
  // Find where FAQ section ends (next ## or end)
  const nextH2Match = faqSection.slice(1).match(/\n## /);
  const nextH2Idx = nextH2Match ? nextH2Match.index + 1 : faqSection.length;
  const faqPart = faqSection.slice(0, nextH2Idx);
  const afterPart = faqSection.slice(nextH2Idx);
  
  // In the FAQ part, insert line break between Q content and A content
  // Chinese format: Q：xxx解答内容
  // Need to detect where question ends and answer begins
  // Heuristic: first part before "?"/"？" or before common connecting words
  
  // Simple approach: if Q： and no A： line, split at first period/question mark
  // Actually the subagent wrote: "Q：问的内容\n\n解答内容" or "Q：问的内容解答内容"
  // Let me just insert "A：" before the answer part
  
  const lines = faqPart.split('\n');
  const newLines = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('Q：') || trimmed.startsWith('Q:')) {
      // Check if it has Q: text and answer in one line
      // Q：问的内容解答内容  →  Q：问的内容\n\nA：解答内容
      // Find the first natural split: look for patterns like "用朋友" that start answer
      // Better approach: the subagent wrote "Q：问题\n\n答案" already has \n\n inside each Q's content
      // If the line is just "Q：xxx" (no line break within it), it's fine
      if (trimmed.includes('。') || trimmed.includes('？')) {
        // Multi-sentence in one paragraph, that's OK - just ensure Q and A are separated
        newLines.push(line);
      } else {
        newLines.push(line);
      }
    } else if (trimmed.startsWith('A：') || trimmed.startsWith('A:')) {
      newLines.push(line);
    } else if (trimmed.length > 0 && !trimmed.startsWith('Q') && !trimmed.startsWith('A')) {
      // This is part of a previous answer or orphan text
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }
  
  // Now: for each Q： line followed by answer text, split them
  // The issue is detecting where Q ends and A begins within the same \n\n block
  // Let me take a different approach: iterate blocks
  
  const blocks = faqPart.split(/\n\n+/);
  const newBlocks = [];
  
  for (const block of blocks) {
    const t = block.trim();
    if (t.startsWith('Q：') || t.startsWith('Q:')) {
      // This block might be "Q：问的内容\n解答内容" (contains both question and answer)
      // If it doesn't have an A： prefix, split at first 。 or ？
      if (!t.includes('\nA：') && !t.includes('\nA:')) {
        // Find first sentence end
        const firstQEnd = t.indexOf('？');
        const firstPeriod = t.indexOf('。');
        let splitIdx = -1;
        if (firstQEnd >= 0) splitIdx = firstQEnd + 1;
        else if (firstPeriod >= 0) splitIdx = firstPeriod + 1;
        
        if (splitIdx > 0) {
          const question = t.slice(0, splitIdx);
          let answer = t.slice(splitIdx).trim();
          // If answer starts with "用朋友" etc, add "A：" prefix
          if (!answer.startsWith('A') && answer.length > 0) {
            answer = 'A：' + answer;
          }
          newBlocks.push(question);
          newBlocks.push(answer);
        } else {
          newBlocks.push(block);
        }
      } else {
        newBlocks.push(block);
      }
    } else if (t.startsWith('A：') || t.startsWith('A:')) {
      newBlocks.push(block);
    } else {
      newBlocks.push(block);
    }
  }
  
  // Add "A：" prefix to orphan answer text that follows Q： blocks
  const faqFixed = newBlocks.join('\n\n');
  
  return before + faqFixed + afterPart;
}

['zh', 'en'].forEach(lang => {
  slugs.forEach(slug => {
    const path = `src/lib/content/${lang}/${slug}.json`;
    const raw = fs.readFileSync(path, 'utf8');
    const d = JSON.parse(raw);
    d.content = fixFAQ(d.content);
    fs.writeFileSync(path, JSON.stringify(d, null, 2), 'utf8');
    
    // Print FAQ section
    const idx = d.content.lastIndexOf('## FAQ');
    if (idx >= 0) {
      console.log(`\n--- ${lang}/${slug} FAQ ---`);
      console.log(d.content.slice(idx, idx + 500));
    }
  });
});

console.log('\nCheck:');
import { execSync } from 'child_process';
try {
  execSync('node check_json.js', { cwd: '.', stdio: 'inherit' });
} catch(e) { process.exit(1); }
