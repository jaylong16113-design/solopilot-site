'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

// ── Data ──

const marketData = [
  { key: 'ai_note_growth', zh: 'AI商业笔记互动增长', en: 'AI Commercial Note Interaction Growth', val: '+263% YoY' },
  { key: 'emotion_conversion', zh: '情绪标签内容转化提升', en: 'Emotion-tagged Conversion Lift', val: '+40%' },
  { key: 'fashion_search', zh: 'AI时尚关键词搜索增长', en: 'AI Fashion Keyword Search Growth', val: '+210% YoY' },
  { key: 'interaction_rate', zh: 'AI时尚平均互动率', en: 'AI Fashion Avg Interaction Rate', val: '18.7%' },
  { key: 'fashion_avg', zh: '时尚品类平均互动率', en: 'Fashion Category Avg', val: '9.3%' },
]

const personas = [
  {
    id: 1,
    emoji: '📜',
    priority: '🥇',
    nameZh: '英伦档案员',
    nameEn: 'The British Archivist',
    descZh: '品牌历史策展人，用AI角色存档与讲述Burberry传承故事',
    descEn: 'Brand history curator archiving Burberry\'s heritage through AI narration',
    audienceZh: '时尚历史爱好者、奢侈品鉴赏家、向往中产',
    audienceEn: 'Fashion history enthusiasts, luxury connoisseurs, aspirational middle class',
    styleZh: '解构T台元素、Burberry档案系列、英伦生活方式',
    styleEn: 'Runway deconstruction, Burberry Archives, British lifestyle',
    anchorZh: '身份归属 + 审美共鸣',
    anchorEn: 'Identity Belonging + Aesthetic Resonance',
    gapZh: '无奢侈品牌在小红书做"品牌历史策展"内容',
    gapEn: 'No luxury brand does "brand history curator" content on Xiaohongshu',
  },
  {
    id: 2,
    emoji: '🤵',
    priority: '🥈',
    nameZh: '骑士管家',
    nameEn: 'The Knight Butler',
    descZh: '代表骑士精神的绅士管家，男性向核心人设',
    descEn: 'A gentleman butler embodying chivalrous spirit, male-focused',
    audienceZh: '男性职场精英，25-45岁',
    audienceEn: 'Male professionals, 25-45, workplace elites',
    styleZh: '场景穿搭系列、骑士品格、英伦绅士生活方式',
    styleEn: 'Occasion dressing, knight\'s character, British gentleman lifestyle',
    anchorZh: '品质确认 + 身份归属 + 审美共鸣',
    anchorEn: 'Quality Confirmation + Identity Belonging + Aesthetic Resonance',
    gapZh: '小红书男性奢侈内容极度稀缺，职场精英+绅士生活近乎空白',
    gapEn: 'Male luxury content extremely scarce on Xiaohongshu; near-blank space',
  },
  {
    id: 3,
    emoji: '🎨',
    priority: '🥉',
    nameZh: '策展人·伦敦',
    nameEn: 'The London Curator',
    descZh: '往返伦敦与上海之间的艺术策展人',
    descEn: 'An art curator living between London and Shanghai',
    audienceZh: '艺术爱好者、文化精英、25-40岁创意阶层',
    audienceEn: 'Art lovers, cultural elites, 25-40 aspirational creatives',
    styleZh: '伦敦艺术现场、艺术×时尚跨界、双城生活美学',
    styleEn: 'London art scene, Art×Fashion crossover, dual-city aesthetics',
    anchorZh: '审美共鸣 + 身份归属 + 超越感',
    anchorEn: 'Aesthetic Resonance + Identity Belonging + Transcendence',
    gapZh: '奢侈品牌小红书账号尚无"艺术策展"视角',
    gapEn: 'No luxury brand has an "art curator" perspective on Xiaohongshu',
  },
  {
    id: 4,
    emoji: '🚇',
    priority: '🔥',
    nameZh: '通勤骑士日记',
    nameEn: 'The Commuting Knight\'s Diary',
    descZh: '记录日常通勤生活的年轻职场人，最容易病毒传播',
    descEn: 'Young urban professional documenting daily commute, easiest to go viral',
    audienceZh: '一线城市年轻白领，22-35岁',
    audienceEn: 'Young urbanites, 22-35, working in first-tier cities',
    styleZh: '通勤日记短视频、POV情绪内容、都市精英内心独白',
    styleEn: 'Commute diary, POV emotional content, urban elite inner monologue',
    anchorZh: '情感共鸣（转化提升40%）',
    anchorEn: 'Emotional Resonance (40% conversion boost)',
    gapZh: '"通勤+穿搭"在小红书搜索量极高，POV是2026平台推荐格式',
    gapEn: '"Commute+outfit" has extremely high search volume on Xiaohongshu',
  },
  {
    id: 5,
    emoji: '🫖',
    priority: '⭐',
    nameZh: '英伦下午茶主理人',
    nameEn: 'The British Afternoon Tea Hostess',
    descZh: '精致女主理人，融合英式茶文化与生活美学',
    descEn: 'Refined female hostess curating British tea culture and lifestyle',
    audienceZh: '女性奢侈品消费者，25-40岁',
    audienceEn: 'Female luxury consumers, 25-40',
    styleZh: '英式下午茶场景、Burberry配饰穿搭、女性职场平衡',
    styleEn: 'British afternoon tea, Burberry accessories styling, female workplace narrative',
    anchorZh: '审美共鸣 + 身份归属',
    anchorEn: 'Aesthetic Resonance + Identity Belonging',
    gapZh: 'Burberry女性用户是主力，这个人设锚定女性种草矩阵',
    gapEn: 'Burberry\'s female users are the main force; anchors the female seeding matrix',
  },
  {
    id: 6,
    emoji: '🔧',
    priority: '💎',
    nameZh: 'Burberry文献修复师#01',
    nameEn: 'The Burberry Archive Restorer #01',
    descZh: 'AI驱动的古着修复师与档案管理员，最具差异化',
    descEn: 'AI-powered vintage restorer and archive curator, most differentiated',
    audienceZh: '古着爱好者、可持续时尚倡导者、时尚收藏家',
    audienceEn: 'Vintage lovers, sustainability advocates, fashion collectors',
    styleZh: 'Burberry古着修复前后对比、数字档案×AI生成、工艺可视化',
    styleEn: 'Vintage before/after, digital archives × AI, craftsmanship visualization',
    anchorZh: '超越感 + 审美共鸣',
    anchorEn: 'Transcendence + Aesthetic Resonance',
    gapZh: '全球首个以AI修复师视角运营的奢侈品牌账号',
    gapEn: 'World\'s 1st luxury brand account from an AI-restorer perspective',
  },
]

const topKols = [
  { rank: 1, name: 'HAKUSON', followers: '9.3万', type: '非报备图文' },
  { rank: 2, name: 'XIAOXUE', followers: '1.6万', type: '非报备图文' },
  { rank: 3, name: '今天有点13', followers: '1.3万', type: '非报备图文' },
  { rank: 4, name: 'LENGLENG', followers: '7.1万', type: '非报备图文' },
  { rank: 5, name: 'GraceeePAN', followers: '5.4万', type: '非报备图文' },
  { rank: 6, name: '弗兰西', followers: '4.2万', type: '非报备图文' },
  { rank: 7, name: 'VCjessica', followers: '6.8万', type: '非报备图文' },
  { rank: 8, name: 'Rachel富', followers: '3.1万', type: '非报备图文' },
  { rank: 9, name: '好好女子', followers: '5.1万', type: '非报备图文' },
  { rank: 10, name: '默子张', followers: '1.4万', type: '非报备图文' },
  { rank: 11, name: 'ZHAIAIAIA', followers: '10.1万', type: '非报备图文' },
  { rank: 12, name: 'Dengdeng 2022', followers: '3.8万', type: '非报备图文' },
  { rank: 13, name: 'May粟', followers: '2.8万', type: '非报备视频' },
  { rank: 14, name: '柒玥有点忙', followers: '6.8万', type: '非报备视频' },
  { rank: 15, name: '刘丹萌', followers: '12.6万', type: '非报备图文' },
]

const scriptSteps = [
  { phase: 'Hook', time: '0-8s', zh: '否定常规 Hook — 打破认知，引发好奇', en: 'Anti-conventional Hook — break expectations, spark curiosity' },
  { phase: 'Mechanism', time: '8-15s', zh: '揭示真相 Mechanism — 指出行业/认知误区', en: 'Reveal truth — point out industry/misconception' },
  { phase: 'Demo', time: '15-50s', zh: '错误示范 → 正确做法 → 进阶技巧', en: 'Wrong demo → Correct method → Advanced tips' },
  { phase: 'Formula', time: '50-57s', zh: '总结公式 — 可复用的方法论', en: 'Formula summary — reusable methodology' },
  { phase: 'CTA', time: '57-60s', zh: '行动号召 — 点赞/收藏/关注引导', en: 'Call to action — likes/bookmarks/follow' },
]

const galleryImages = [
  { src: '/burberry/images/ChatGPT Image 2026年4月29日 19_27_58.png', label: 'Brand Concept', sublabel: '品牌概念' },
  { src: '/burberry/images/ChatGPT Image 2026年4月29日 20_47_07.png', label: 'Visual Identity', sublabel: '视觉识别' },
  { src: '/burberry/images/ChatGPT Image 2026年4月29日 20_12_58.png', label: 'AI Portrait', sublabel: 'AI人像' },
  { src: '/burberry/images/ChatGPT Image 2026年4月30日 17_41_11.png', label: 'Scene Design', sublabel: '场景设计' },
  { src: '/burberry/images/人物特写/ChatGPT Image 2026年4月30日 19_11_15.png', label: 'Character Close-up', sublabel: '人物特写' },
  { src: '/burberry/images/人物特写/ChatGPT Image 2026年4月30日 19_05_17.png', label: 'Portrait Study', sublabel: '肖像研究' },
  { src: '/burberry/images/人物表情/ChatGPT Image 2026年4月30日 20_31_50.png', label: 'Expression Study', sublabel: '表情研究' },
  { src: '/burberry/images/人物表情/ChatGPT Image 2026年4月30日 20_25_45 (3).png', label: 'Micro-expression', sublabel: '微表情' },
  { src: '/burberry/images/大女主IP/ChatGPT Image 2026年5月3日 02_47_00.png', label: 'Female Lead IP', sublabel: '大女主IP' },
  { src: '/burberry/images/大女主IP/ChatGPT Image 2026年5月3日 02_04_28.png', label: 'Heroine Design', sublabel: '女主设计' },
]

// ── Page ──

export default function BurberryPage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'

  return (
    <div>
      <style>{`
        :root {
          --br-void:#08090a; --br-abyss:#0c0d0f; --br-deep:#0f1011; --br-panel:#141518; --br-panel-hover:#191a1d;
          --br-border:rgba(255,255,255,0.06); --br-border-s:rgba(255,255,255,0.08);
          --br-t1:#f7f8f8; --br-t2:#cfd2d8; --br-t3:#8a8f98; --br-t4:#5f636b;
          --br-accent:#c4a962; --br-accent-hover:#b8984a; --br-accent-glow:rgba(196,169,98,0.12);
          --br-gold:#c4a962; --br-gold-dim:#a08840;
          --br-font:'Inter',system-ui,-apple-system,sans-serif; --br-mono:'JetBrains Mono',monospace;
          --br-rad-sm:4px; --br-rad-md:6px; --br-rad-lg:8px; --br-rad-xl:12px; --br-rad-pill:9999px;
        }
        .br-wrap {
          max-width:1280px; margin:0 auto; padding:0 24px;
          font-family:var(--br-font); background:var(--br-void); color:var(--br-t1);
          min-height:100vh; position:relative; z-index:1;
        }
        @media(max-width:640px){ .br-wrap{ padding:0 16px; } }

        /* ── Header ── */
        .br-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 0; border-bottom:1px solid var(--br-border);
        }
        .br-logo { display:flex; align-items:center; gap:10px; }
        .br-logo-icon {
          width:36px; height:36px; border-radius:var(--br-rad-lg);
          background:linear-gradient(135deg,var(--br-accent),#8a7530);
          display:grid; place-items:center; font-size:15px; font-weight:700; color:#fff;
          font-family:Georgia,serif;
        }
        .br-logo-name { font-size:16px; font-weight:600; letter-spacing:-0.02em; }
        .br-logo-sub {
          font-size:9px; font-weight:500; color:var(--br-t4);
          text-transform:uppercase; letter-spacing:0.1em;
        }

        /* ── Hero ── */
        .br-hero {
          position:relative; padding:60px 0 50px; text-align:center;
          overflow:hidden;
        }
        .br-hero::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse at 50% 0%, rgba(196,169,98,0.06) 0%, transparent 70%);
          pointer-events:none;
        }
        .br-hero-badge {
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 14px; border-radius:var(--br-rad-pill);
          background:rgba(196,169,98,0.1); border:1px solid rgba(196,169,98,0.2);
          font-size:11px; font-weight:500; color:var(--br-accent); letter-spacing:0.05em;
          margin-bottom:20px;
        }
        .br-hero h1 {
          font-size:clamp(28px,5vw,52px); font-weight:700; letter-spacing:-0.03em;
          line-height:1.1; margin-bottom:14px;
        }
        .br-hero h1 span { color:var(--br-accent); }
        .br-hero p {
          font-size:clamp(14px,2vw,17px); color:var(--br-t3); max-width:560px;
          margin:0 auto; line-height:1.6;
        }
        .br-hero-stats {
          display:flex; justify-content:center; gap:24px; margin-top:28px; flex-wrap:wrap;
        }
        .br-hero-stat {
          text-align:center; padding:12px 20px;
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-lg); min-width:100px;
        }
        .br-hero-stat-val { font-size:20px; font-weight:700; color:var(--br-accent); }
        .br-hero-stat-lbl { font-size:11px; color:var(--br-t4); margin-top:2px; }

        /* ── Section ── */
        .br-section { padding:48px 0; }
        .br-section-header {
          text-align:center; margin-bottom:36px;
        }
        .br-section-header h2 {
          font-size:clamp(22px,3.5vw,32px); font-weight:700; letter-spacing:-0.02em;
          margin-bottom:8px;
        }
        .br-section-header p {
          font-size:14px; color:var(--br-t3); max-width:500px; margin:0 auto;
        }
        .br-section-accent {
          width:40px; height:3px; background:var(--br-accent); margin:12px auto 0;
          border-radius:2px;
        }
        .br-btn-lang {
          padding:4px 12px; border-radius:var(--br-rad-pill);
          background:var(--br-deep); border:1px solid var(--br-border);
          font-size:11px; font-weight:500; color:var(--br-t3);
          cursor:pointer; font-family:var(--br-font);
          transition:all .15s;
        }
        .br-btn-lang:hover { border-color:var(--br-border-s); color:var(--br-t2); }

        /* ── Market Data Grid ── */
        .br-data-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
          gap:10px; margin-bottom:24px;
        }
        .br-data-card {
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-lg); padding:16px; text-align:center;
        }
        .br-data-val { font-size:22px; font-weight:700; color:var(--br-accent); }
        .br-data-lbl { font-size:12px; color:var(--br-t3); margin-top:4px; line-height:1.4; }

        .br-info-cards { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:700px){ .br-info-cards{ grid-template-columns:1fr; } }
        .br-info-card {
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-xl); padding:20px;
        }
        .br-info-card h4 {
          font-size:13px; font-weight:600; color:var(--br-accent);
          text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px;
        }
        .br-info-card ul { list-style:none; padding:0; margin:0; }
        .br-info-card li {
          font-size:13px; color:var(--br-t2); padding:5px 0;
          border-bottom:1px solid var(--br-border);
        }
        .br-info-card li:last-child { border-bottom:none; }
        .br-info-card li::before { content:'• '; color:var(--br-accent); }

        /* ── Personas ── */
        .br-persona-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:14px;
        }
        @media(max-width:900px){ .br-persona-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:560px){ .br-persona-grid{ grid-template-columns:1fr; } }
        .br-persona-card {
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-xl); padding:20px;
          transition:all .25s; position:relative;
        }
        .br-persona-card:hover {
          border-color:rgba(196,169,98,0.25);
          background:var(--br-panel);
          transform:translateY(-2px);
          box-shadow:0 6px 24px rgba(196,169,98,0.06);
        }
        .br-persona-priority {
          position:absolute; top:-1px; right:-1px;
          width:24px; height:24px; border-radius:50%;
          background:var(--br-accent); color:#08090a;
          display:grid; place-items:center; font-size:11px; font-weight:700;
          border:2px solid var(--br-void);
        }
        .br-persona-emoji { font-size:28px; margin-bottom:8px; }
        .br-persona-name { font-size:15px; font-weight:600; margin-bottom:2px; }
        .br-persona-name-en { font-size:11px; color:var(--br-t4); margin-bottom:10px; }
        .br-persona-desc { font-size:12px; color:var(--br-t3); line-height:1.5; margin-bottom:10px; }
        .br-persona-tags { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px; }
        .br-persona-tag {
          padding:2px 8px; border-radius:var(--br-rad-pill);
          background:rgba(196,169,98,0.08);
          border:1px solid rgba(196,169,98,0.12);
          font-size:10px; color:var(--br-accent);
        }
        .br-persona-section { font-size:11px; color:var(--br-t4); margin-top:6px; }
        .br-persona-section strong { color:var(--br-t2); }

        /* ── KOL Table ── */
        .br-table-wrap {
          overflow-x:auto;
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-xl);
        }
        .br-table {
          width:100%; border-collapse:collapse; font-size:13px;
        }
        .br-table th {
          padding:12px 16px; text-align:left; font-size:11px; font-weight:600;
          color:var(--br-t4); text-transform:uppercase; letter-spacing:0.05em;
          background:var(--br-abyss); border-bottom:1px solid var(--br-border);
          white-space:nowrap;
        }
        .br-table td {
          padding:11px 16px; border-bottom:1px solid var(--br-border);
          color:var(--br-t2); white-space:nowrap;
        }
        .br-table tr:last-child td { border-bottom:none; }
        .br-table tr:hover td { background:var(--br-panel-hover); }
        .br-table-rank { color:var(--br-t4); font-weight:600; width:32px; }
        .br-table-name { font-weight:600; color:var(--br-t1); }
        .br-table-followers { font-family:var(--br-mono); color:var(--br-accent); }
        .br-table-type { 
          padding:2px 10px; border-radius:var(--br-rad-pill);
          font-size:11px;
        }
        .br-table-type-video { background:rgba(196,169,98,0.1); color:var(--br-accent); }
        .br-table-type-image { background:rgba(255,255,255,0.04); color:var(--br-t3); }

        /* ── Script ── */
        .br-script-steps { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .br-script-step {
          flex:1; min-width:150px; max-width:220px;
          background:var(--br-deep); border:1px solid var(--br-border);
          border-radius:var(--br-rad-lg); padding:16px; text-align:center;
        }
        .br-script-phase {
          font-size:16px; font-weight:700; color:var(--br-accent);
          margin-bottom:2px;
        }
        .br-script-time {
          font-size:11px; font-family:var(--br-mono); color:var(--br-t4);
          margin-bottom:6px;
        }
        .br-script-desc { font-size:12px; color:var(--br-t3); line-height:1.5; }

        /* ── Gallery ── */
        .br-gallery-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
        }
        @media(max-width:900px){ .br-gallery-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:640px){ .br-gallery-grid{ grid-template-columns:repeat(2,1fr); } }
        .br-gallery-item {
          border-radius:var(--br-rad-lg); overflow:hidden;
          background:var(--br-deep); border:1px solid var(--br-border);
          transition:all .25s; cursor:pointer;
        }
        .br-gallery-item:hover {
          border-color:rgba(196,169,98,0.3);
          transform:scale(1.02);
          box-shadow:0 4px 20px rgba(0,0,0,0.4);
        }
        .br-gallery-img {
          width:100%; aspect-ratio:1; object-fit:cover;
          display:block; background:var(--br-abyss);
        }
        .br-gallery-label {
          padding:8px 10px; font-size:11px; color:var(--br-t2);
        }
        .br-gallery-label span { display:block; font-size:10px; color:var(--br-t4); margin-top:1px; }

        /* ── Lightbox ── */
        .br-lightbox {
          position:fixed; inset:0; z-index:999;
          background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center;
          padding:24px; cursor:pointer; backdrop-filter:blur(8px);
        }
        .br-lightbox img {
          max-width:90vw; max-height:85vh; object-fit:contain;
          border-radius:var(--br-rad-lg);
        }
        .br-lightbox-close {
          position:absolute; top:16px; right:20px;
          font-size:28px; color:var(--br-t2); cursor:pointer;
          background:none; border:none; font-family:var(--br-font);
          opacity:0.7; transition:opacity .15s;
        }
        .br-lightbox-close:hover { opacity:1; }

        /* ── Footer ── */
        .br-footer {
          padding:32px 0; border-top:1px solid var(--br-border);
          text-align:center; font-size:12px; color:var(--br-t4);
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="br-wrap">
        {/* ─── Header ─── */}
        <header className="br-header">
          <div className="br-logo">
            <div className="br-logo-icon">B</div>
            <div>
              <div className="br-logo-name">Burberry AI</div>
              <div className="br-logo-sub">
                {isZh ? '情绪短视频全案' : 'Emotional Short Video Project'}
              </div>
            </div>
          </div>
          <button className="br-btn-lang" onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}>
            {locale === 'zh' ? '🌐 EN' : '🌐 中文'}
          </button>
        </header>

        {/* ─── Hero ─── */}
        <section className="br-hero">
          <div className="br-hero-badge">
            {isZh ? '📱 小红书 · 2026' : '📱 Xiaohongshu · 2026'}
          </div>
          <h1>
            Burberry AI <span>·</span>
            <br />
            {isZh ? '情绪短视频全案' : 'Emotional Short Video Project'}
          </h1>
          <p>
            {isZh
              ? '基于原创虚拟角色 + 持续人格化的 AI 情绪短视频矩阵方案，抢占小红书奢侈品 AI 内容先发优势'
              : 'An AI emotional short-video matrix strategy based on original virtual characters + continuous personification, capturing first-mover advantage on Xiaohongshu'}
          </p>
          <div className="br-hero-stats">
            <div className="br-hero-stat">
              <div className="br-hero-stat-val">6</div>
              <div className="br-hero-stat-lbl">{isZh ? 'AI人格' : 'AI Personas'}</div>
            </div>
            <div className="br-hero-stat">
              <div className="br-hero-stat-val">26</div>
              <div className="br-hero-stat-lbl">{isZh ? '合作KOL' : 'Recommended KOLs'}</div>
            </div>
            <div className="br-hero-stat">
              <div className="br-hero-stat-val">66+</div>
              <div className="br-hero-stat-lbl">{isZh ? 'AI生成素材' : 'AI-Generated Assets'}</div>
            </div>
            <div className="br-hero-stat">
              <div className="br-hero-stat-val">+40%</div>
              <div className="br-hero-stat-lbl">{isZh ? '情绪内容转化提升' : 'Emotion Conversion Lift'}</div>
            </div>
          </div>
        </section>

        {/* ─── Strategy ─── */}
        <section className="br-section">
          <div className="br-section-header">
            <h2>{isZh ? '策略概览' : 'Strategy Overview'}</h2>
            <p>{isZh ? '数据驱动的情感化短视频矩阵策略' : 'Data-driven emotional short-video matrix strategy'}</p>
            <div className="br-section-accent" />
          </div>

          <div className="br-data-grid">
            {marketData.map((d) => (
              <div key={d.key} className="br-data-card">
                <div className="br-data-val">{d.val}</div>
                <div className="br-data-lbl">{isZh ? d.zh : d.en}</div>
              </div>
            ))}
          </div>

          <div className="br-info-cards">
            <div className="br-info-card">
              <h4>{isZh ? '📋 平台合规（小红书 AI 政策 2026）' : '📋 Platform Compliance'}</h4>
              <ul>
                <li>{isZh ? '✅ 鼓励：原创虚拟角色、持续人格化、创意AI内容' : '✅ Encouraged: Original virtual characters, continuous personification'}</li>
                <li>{isZh ? '❌ 禁止：批量生成美图、低质量AI内容' : '❌ Prohibited: Mass-generated beauty images, low-effort AI slop'}</li>
                <li>{isZh ? '💡 机会：尚无奢侈品牌在小红书建立系统化AI内容矩阵' : '💡 Opportunity: No luxury brand has a systematic AI content matrix yet'}</li>
              </ul>
            </div>
            <div className="br-info-card">
              <h4>{isZh ? '🧠 情感框架（分析14M+笔记）' : '🧠 Emotional Framework (14M+ Notes)'}</h4>
              <ul>
                <li>{isZh ? '生存适应：安全感、身体舒适' : 'Survival Adaptation: Security, physical comfort'}</li>
                <li>{isZh ? '社会适应：归属感、身份认同、社会认可' : 'Social Adaptation: Belonging, identity, recognition'}</li>
                <li>{isZh ? '超越感：自我实现、意义感、审美升华' : 'Transcendence: Self-actualization, meaning, aesthetic sublimation'}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Personas ─── */}
        <section className="br-section">
          <div className="br-section-header">
            <h2>{isZh ? '六大AI人格矩阵' : '6 AI Persona Matrix'}</h2>
            <p>{isZh ? '覆盖不同受众圈层的内容人设体系' : 'Content persona system covering diverse audience segments'}</p>
            <div className="br-section-accent" />
          </div>

          <div className="br-persona-grid">
            {personas.map((p) => (
              <div key={p.id} className="br-persona-card">
                <div className="br-persona-priority">{p.priority}</div>
                <div className="br-persona-emoji">{p.emoji}</div>
                <div className="br-persona-name">{isZh ? p.nameZh : p.nameEn}</div>
                <div className="br-persona-name-en">{isZh ? p.nameEn : p.nameZh}</div>
                <div className="br-persona-desc">{isZh ? p.descZh : p.descEn}</div>
                <div className="br-persona-tags">
                  <span className="br-persona-tag">{isZh ? '受众' : 'Audience'}: {isZh ? p.audienceZh : p.audienceEn}</span>
                </div>
                <div className="br-persona-tags">
                  <span className="br-persona-tag">{isZh ? '风格' : 'Style'}: {isZh ? p.styleZh : p.styleEn}</span>
                </div>
                <div className="br-persona-section">
                  <strong>{isZh ? '情绪锚点' : 'Emotional Anchor'}:</strong> {isZh ? p.anchorZh : p.anchorEn}
                </div>
                <div className="br-persona-section">
                  <strong>{isZh ? '差异优势' : 'Gap'}:</strong> {isZh ? p.gapZh : p.gapEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── KOL Table ─── */}
        <section className="br-section">
          <div className="br-section-header">
            <h2>{isZh ? '小红书KOL推荐' : 'Xiaohongshu KOL Recommendations'}</h2>
            <p>{isZh ? '精选15位达人，粉丝范围0.5万–12.6万，全部非报备合作' : 'Top 15 KOLs, 0.5K–126K followers, all non-paid collaborations'}</p>
            <div className="br-section-accent" />
          </div>

          <div className="br-table-wrap">
            <table className="br-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isZh ? '达人名称' : 'Name'}</th>
                  <th>{isZh ? '粉丝数' : 'Followers'}</th>
                  <th>{isZh ? '合作类型' : 'Collab Type'}</th>
                </tr>
              </thead>
              <tbody>
                {topKols.map((kol) => (
                  <tr key={kol.rank}>
                    <td className="br-table-rank">{kol.rank}</td>
                    <td className="br-table-name">{kol.name}</td>
                    <td className="br-table-followers">{kol.followers}</td>
                    <td>
                      <span className={`br-table-type ${kol.type.includes('视频') ? 'br-table-type-video' : 'br-table-type-image'}`}>
                        {kol.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Script ─── */}
        <section className="br-section">
          <div className="br-section-header">
            <h2>{isZh ? '脚本结构' : 'Script Structure'}</h2>
            <p>{isZh ? 'AI情绪短视频爆款脚本框架' : 'Viral AI emotional short-video script framework'}</p>
            <div className="br-section-accent" />
          </div>

          <div className="br-script-steps">
            {scriptSteps.map((step) => (
              <div key={step.phase} className="br-script-step">
                <div className="br-script-phase">{step.phase}</div>
                <div className="br-script-time">{step.time}</div>
                <div className="br-script-desc">{isZh ? step.zh : step.en}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Gallery ─── */}
        <section className="br-section">
          <div className="br-section-header">
            <h2>{isZh ? 'AI生成素材展示' : 'AI-Generated Image Gallery'}</h2>
            <p>{isZh ? '66+张AI生成图像，覆盖人物特写、表情变化、分镜测试、大女主IP' : '66+ AI-generated images across close-ups, expressions, storyboards, and female lead IP'}</p>
            <div className="br-section-accent" />
          </div>

          <GalleryGrid images={galleryImages} isZh={isZh} />
        </section>

        {/* ─── Footer ─── */}
        <footer className="br-footer">
          {isZh
            ? 'Burberry AI 情绪短视频全案 · 2026 · 仅供内部演示使用'
            : 'Burberry AI Emotional Short Video Project · 2026 · Internal Demo Only'}
        </footer>
      </div>
    </div>
  )
}

// ── Gallery with Lightbox ──

function GalleryGrid({ images, isZh }: { images: typeof galleryImages; isZh: boolean }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      <div className="br-gallery-grid">
        {images.map((img, i) => (
          <div key={i} className="br-gallery-item" onClick={() => setLightbox(img.src)}>
            <img
              src={img.src}
              alt={img.label}
              className="br-gallery-img"
              loading="lazy"
            />
            <div className="br-gallery-label">
              {isZh ? img.sublabel : img.label}
              <span>{isZh ? img.label : img.sublabel}</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="br-lightbox" onClick={() => setLightbox(null)}>
          <button className="br-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
