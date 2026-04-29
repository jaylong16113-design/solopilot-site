import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';

const BASE = process.cwd();

function main() {
  ['zh', 'en'].forEach(lang => fixLang(lang));
  console.log('Done!');
}

function fixLang(lang) {
  console.log(`\n=== Fixing ${lang} ===`);
  const contentDir = path.join(BASE, 'src', 'lib', 'content', lang);
  const idxPath = path.join(contentDir, 'index.json');
  
  // Read index
  const index = JSON.parse(readFileSync(idxPath, 'utf8'));
  
  // Collect all files on disk (json + mdx)
  const files = new Map();
  const diskFiles = new Set();
  const dirEntries = readdirSync(contentDir);
  
  dirEntries.forEach(f => {
    const slug = f.replace(/\.(json|mdx)$/, '');
    if (f.endsWith('.json') && f !== 'index.json') {
      try {
        const data = JSON.parse(readFileSync(path.join(contentDir, f), 'utf8'));
        files.set(slug, { type: 'json', site: data.site || 'mood', data });
        diskFiles.add(slug);
      } catch(e) {
        console.log(`  ❌ Broken JSON: ${f} - ${e.message}`);
      }
    } else if (f.endsWith('.mdx')) {
      // For mdx files, extract title from frontmatter
      const text = readFileSync(path.join(contentDir, f), 'utf8');
      const titleMatch = text.match(/^title:\s*(.+)$/m);
      const excerptMatch = text.match(/^description:\s*(.+)$/m);
      files.set(slug, { 
        type: 'mdx', 
        site: 'mood',
        data: { 
          slug, 
          title: titleMatch ? titleMatch[1] : slug,
          excerpt: excerptMatch ? excerptMatch[1] : ''
        }
      });
      diskFiles.add(slug);
    }
  });
  
  // Get all slugs referenced in index
  const indexSlugs = new Set();
  ['tool', 'wear', 'ops', 'mood'].forEach(site => {
    (index[site] || []).forEach(item => {
      indexSlugs.add(item.slug);
    });
  });
  
  // 1) Remove from index slugs that don't exist on disk
  ['tool', 'wear', 'ops', 'mood'].forEach(site => {
    if (!index[site]) return;
    index[site] = index[site].filter(item => {
      if (!diskFiles.has(item.slug)) {
        console.log(`  🗑️  Removing ${lang}/${site}/${item.slug} from index (no file)`);
        return false;
      }
      return true;
    });
  });
  
  // 2) Add files on disk not in index
  diskFiles.forEach(slug => {
    if (indexSlugs.has(slug)) return;
    const file = files.get(slug);
    if (!file) return;
    const site = file.site || 'mood';
    if (!index[site]) index[site] = [];
    
    // Check if it's a duplicate slug name but different case
    const existing = index[site].find(i => i.slug === slug);
    if (existing) return;
    
    index[site].push({
      slug: file.data.slug,
      title: file.data.title || slug,
      excerpt: file.data.excerpt || ''
    });
    console.log(`  ➕ Adding ${lang}/${site}/${slug} to index`);
  });
  
  // 3) Fix short content issue: silent-diary-cold-start.json
  if (lang === 'zh') {
    const coldStartFile = path.join(contentDir, 'silent-diary-cold-start.json');
    if (existsSync(coldStartFile)) {
      const data = JSON.parse(readFileSync(coldStartFile, 'utf8'));
      if ((data.content || '').length < 2000) {
        data.content += `\n\n## 为什么推荐你从 Silent Diary 开始\n\n如果你是一个短视频创作者，想要进入情绪赛道但不知道从哪里开始，Silent Diary（沉默日记）就是最好的起点。\n\n它的门槛最低：不需要露脸、不需要专业设备、不需要表演技巧。只需要一部手机、一些生活素材片段、一段合适的BGM，和一两个能引起共鸣的文字标题。\n\n而它的天花板却很高：国内已经有账号靠单一 Silent Diary 模式做到百万粉丝，海外 TikTok 上 #silentdiary 标签的播放量超过 50 亿次。\n\n从商业变现的角度，Silent Diary 的粉丝价值极高。关注这类账号的用户通常具有较高的共情能力和消费意愿，是知识付费、情感陪伴、生活方式类产品转化的理想受众。\n\n## 启动清单\n\n- [ ] 准备 10 条以上生活片段素材（走路、风景、下雨、咖啡）\n- [ ] 选择 3-5 首符合风格的 BGM（钢琴/氛围音乐）\n- [ ] 确定统一的画面色调（冷色或暖色，保持一致）\n- [ ] 准备 30 个以上文案标题库存\n- [ ] 发布节奏：前两周每天 1 条，之后每 2-3 天 1 条`;
        writeFileSync(coldStartFile, JSON.stringify(data, null, 2), 'utf8');
        console.log('  📝 Extended silent-diary-cold-start.json content');
      }
    }
  }
  
  // 4) Add site field to any JSON files missing it
  dirEntries.forEach(f => {
    if (!f.endsWith('.json') || f === 'index.json') return;
    try {
      const data = JSON.parse(readFileSync(path.join(contentDir, f), 'utf8'));
      if (!data.site) {
        data.site = 'mood';
        writeFileSync(path.join(contentDir, f), JSON.stringify(data, null, 2), 'utf8');
        console.log(`  🔧 Added site field to ${lang}/${f}`);
      }
    } catch(e) {
      // Already reported above
    }
  });
  
  // Write updated index
  writeFileSync(idxPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`  ✅ ${lang} index updated`);
}

main();
