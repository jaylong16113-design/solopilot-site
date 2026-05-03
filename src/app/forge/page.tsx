'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

export default function ForgePage() {
  const { locale, t, setLocale } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const fontLink = document.createElement('link')
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    const modules = [
      { id: 'factory', desc: t('forge_factory'), color: 'var(--accent)' },
      { id: 'auditor', desc: t('forge_auditor'), color: '#27a644' },
      { id: 'board', desc: t('forge_board'), color: '#60a5fa' },
      { id: 'radar', desc: t('forge_radar'), color: '#f59e0b' },
      { id: 'planner', desc: t('forge_planner'), color: '#34d399' },
      { id: 'daily', desc: t('forge_daily'), color: '#f472b6' },
      { id: 'intel', desc: t('forge_intel'), color: '#fb923c' },
      { id: 'translator', desc: t('forge_translator'), color: '#818cf8' },
      { id: 'video', desc: t('forge_video'), color: '#e879f9' },
    ]

    const isZh = locale === 'zh'

    const script = document.createElement('script')
    script.textContent = `
const API = '/api/forge';
const MODULES = ${JSON.stringify(modules)};
const __LANG = ${JSON.stringify(locale)};

const HINT_SELECT = ${JSON.stringify(isZh ? '选择上方模块开始使用' : 'Select a module above')};
const HINT_WAITING = ${JSON.stringify(isZh ? '等待输入...' : 'Waiting for input...')};
const HINT_LOADING = ${JSON.stringify(isZh ? '⏳ 请求中...' : '⏳ Requesting...')};
const HINT_OUTPUT = ${JSON.stringify(isZh ? '输出结果' : 'Output')};

const FORMS = {
  factory: \`<div class="form-group"><label>SKU名称</label><input id="f_name" value="${isZh ? '圣安杰罗·米兰系列双肩包' : 'SAINT ANGELO Milano Backpack'}"></div>
<div class="form-group"><label>${isZh ? '卖点(每行一个)' : 'Selling Points (one per line)'}</label><textarea id="f_points" rows="4">${isZh ? '头层意大利进口牛皮，质感细腻\\n纯手工缝制，每只耗时8小时\\n防水涂层处理，雨天无忧\\n仅重0.8kg，超轻便携带' : 'Genuine Italian cowhide, refined texture\\nHand-stitched, 8 hours per bag\\nWaterproof coating\\nOnly 0.8kg, ultra-light'}</textarea></div>
<div class="form-group"><label>${isZh ? '平台' : 'Platform'}</label><select id="f_plat"><option>douyin</option><option>xiaohongshu</option><option>live_stream</option><option>jd</option></select></div>
<div class="form-group"><label>${isZh ? '格式' : 'Format'}</label><select id="f_format"><option>short_video</option><option>${isZh ? '种草_post' : 'social_post'}</option><option>live_script</option></select></div>
<button class="btn" onclick="callAPI('factory/generate',{sku_name:g('f_name'),selling_points:g('f_points').split('\\\\n').filter(Boolean),target_platform:gv('f_plat'),content_format:gv('f_format')})">${isZh ? '生成内容' : 'Generate'}</button>\`,

  auditor: \`<div class="form-group"><label>${isZh ? '内容原文' : 'Content'}</label><textarea id="a_content" rows="6">${isZh ? '全新圣安杰罗轻奢系列包包，采用头层牛皮手工缝制，优雅大方。限时特惠仅需2999元！赶快下单吧！' : 'Brand new SAINT ANGELO luxury bag, hand-stitched Italian leather. Limited time offer at just $299! Order now!'}</textarea></div>
<div class="form-group"><label>${isZh ? '品牌词' : 'Brand Keywords'}</label><input id="a_kw" value="${isZh ? '圣安杰罗, SAINT ANGELO, 轻奢' : 'SAINT ANGELO, luxury'}'></div>
<div class="form-group"><label>${isZh ? '平台' : 'Platform'}</label><select id="a_plat"><option>douyin</option><option>xiaohongshu</option><option>jd</option></select></div>
<button class="btn" onclick="callAPI('auditor/score',{content:g('a_content'),brand_keywords:g('a_kw'),platform:gv('a_plat')})">${isZh ? '评分' : 'Score'}</button>\`,

  board: \`<div class="form-group"><label>${isZh ? '平台(逗号分隔)' : 'Platforms (comma-separated)'}</label><input id="b_plat" value="douyin,xiaohongshu,jd"></div>
<button class="btn" onclick="callAPI('board/report',{date_range:{start:'2026-04-01',end:'2026-04-30'},platforms:g('b_plat').split(','),group_by:'platform'})">${isZh ? '生成看板' : 'Generate Board'}</button>\`,

  radar: \`<div class="form-group"><label>${isZh ? '竞品(逗号分隔)' : 'Competitors (comma-separated)'}</label><input id="r_comp" value="Coach,Michael Kors,Furla,Tory Burch"></div>
<div class="form-group"><label>${isZh ? '品类' : 'Category'}</label><input id="r_cat" value="${isZh ? '轻奢通勤包' : 'Premium Commuter Bags'}'></div>
<button class="btn" onclick="callAPI('radar/scan',{competitors:g('r_comp').split(','),platforms:['douyin','xiaohongshu'],category:g('r_cat'),time_range:'last_30d'})">${isZh ? '扫描' : 'Scan'}</button>\`,

  planner: \`<button class="btn" onclick="callAPI('planner/generate',{date_range:{start:'2026-04-01',end:'2026-04-07'},platforms:['douyin','xiaohongshu','jd'],group_by:'platform'})">${isZh ? '生成排期' : 'Generate Schedule'}</button>\`,

  daily: \`<button class="btn" onclick="callAPI('daily-report',{date:'today'})">${isZh ? '生成日报' : 'Generate Report'}</button>\`,

  intel: \`<button class="btn" onclick="callAPI('intel-report',{})">${isZh ? '生成情报' : 'Generate Intel'}</button>\`,

  translator: \`<div class="form-group"><label>${isZh ? 'SKU名称' : 'SKU Name'}</label><input id="t_name" value="${isZh ? '圣安杰罗·米兰系列双肩包' : 'SAINT ANGELO Milano Backpack'}"></div>
<div class="form-group"><label>${isZh ? '卖点(每行一个)' : 'Selling Points (one per line)'}</label><textarea id="t_points" rows="4">${isZh ? '头层意大利进口牛皮，质感细腻\\n纯手工缝制，每只耗时8小时\\n防水涂层处理，雨天无忧' : 'Italian cowhide, refined texture\\nHand-stitched, 8 hours\\nWaterproof coating'}</textarea></div>
<div class="form-group"><label>${isZh ? '平台' : 'Platform'}</label><select id="t_plat"><option>xiaohongshu</option><option>douyin</option><option>jd</option></select></div>
<button class="btn" onclick="callAPI('translator/translate',{sku_name:g('t_name'),selling_points:g('t_points').split('\\\\n').filter(Boolean),target_tiers:['en_ecom','cn_optimized','en_native'],target_platform:gv('t_plat')})">${isZh ? '翻译' : 'Translate'}</button>\`,

  video: \`<div class="form-group"><label>${isZh ? '脚本' : 'Script'}</label><textarea id="v_script" rows="6">${isZh ? '你还在背PU革通勤包吗？圣安杰罗意大利头层牛皮，防水涂层处理，下雨也不怕！纯手工缝制，8小时只做这一只。经典三色可选，点击下方购买。' : 'Still carrying a synthetic commuter bag? SAINT ANGELO Italian top-grain leather, waterproof coated. Hand-stitched, 8 hours for each piece. Three classic colors. Buy now.'}</textarea></div>
<button class="btn" onclick="callAPI('video/generate',{script:g('v_script'),engine:'veo',voiceover_style:'female_elegant',aspect_ratio:'9:16'})">${isZh ? '生成分镜' : 'Generate Storyboard'}</button>\`,
};

const MODULE_META = {
  factory: { name: \`${isZh ? '内容工厂' : 'Content Factory'}\`, sub: \`${isZh ? 'SKU卖点→脚本/Prompt' : 'SKU → Script/Prompt'}\` },
  auditor: { name: \`${isZh ? '内容审核' : 'Content Auditor'}\`, sub: \`${isZh ? '五维评分+违禁词检测' : '5D Scoring+Banned Word Check'}\` },
  board: { name: \`${isZh ? '数据看板' : 'Content Board'}\`, sub: \`${isZh ? '数据归一+飞书报表' : 'Data + Reports'}\` },
  radar: { name: \`${isZh ? '内容雷达' : 'Content Radar'}\`, sub: \`${isZh ? '竞品内容雷达' : 'Competitor Radar'}\` },
  planner: { name: \`${isZh ? '分发计划' : 'Planner'}\`, sub: \`${isZh ? '分发计划编排' : 'Distribution Plan'}\` },
  daily: { name: \`${isZh ? '每日日报' : 'Daily Report'}\`, sub: \`${isZh ? '内容中台日报' : 'Content Dashboard'}\` },
  intel: { name: \`${isZh ? '竞品情报' : 'Intel Report'}\`, sub: \`${isZh ? '每日竞品情报' : 'Daily Intel'}\` },
  translator: { name: \`${isZh ? 'SKU翻译' : 'SKU Translator'}\`, sub: \`${isZh ? '三层翻译' : '3-Tier Translation'}\` },
  video: { name: \`${isZh ? 'Veo视频' : 'Veo Video'}\`, sub: \`${isZh ? '脚本→视频生成' : 'Script→Video'}\` },
};

function g(id){return document.getElementById(id)?.value||''}
function gv(id){return document.getElementById(id)?.value||''}

function renderModules(){
  const grid = document.getElementById('moduleGrid');
  grid.innerHTML = MODULES.map(m => \`<div class="module" onclick="selectModule('\${m.id}')"><div class="module-icon" style="color:\${m.color}">◆</div><div class="module-title">\${m.desc}</div><div class="module-sub">\${MODULE_META[m.id]?.sub || ''}</div><div class="module-status" style="color:\${m.color}">● ${isZh ? '就绪' : 'Ready'}</div></div>\`).join('');
}

function selectModule(id){
  document.querySelectorAll('.module').forEach(m=>m.classList.remove('active'));
  const el = document.querySelector(\`.module[onclick*="'\${id}'"]\`);
  if(el) el.classList.add('active');
  document.getElementById('panelTitle').textContent = MODULE_META[id]?.name || id;
  document.getElementById('panelBody').innerHTML = FORMS[id] || '<p style="color:var(--t3)">...</p>';
  document.getElementById('outputArea').textContent = HINT_WAITING;
}

async function callAPI(endpoint, body){
  const output = document.getElementById('outputArea');
  output.textContent = HINT_LOADING;
  try{
    const r = await fetch(\`\${API}/\${endpoint}\`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d = await r.json();
    output.textContent = JSON.stringify(d, null, 2);
  }catch(e){
    output.textContent = \`❌ ${isZh ? '错误' : 'Error'}: \${e.message}\`;
  }
}

renderModules();
`
    containerRef.current.appendChild(script)

    return () => {
      fontLink.remove()
      script.remove()
    }
  }, [locale, t])

  return (
    <div ref={containerRef}>
      <style>{`
:root {
  --void: #08090a;
  --abyss: #0c0d0f;
  --deep: #0f1011;
  --border: rgba(255,255,255,0.06);
  --border-s: rgba(255,255,255,0.08);
  --t1: #f7f8f8;
  --t2: #cfd2d8;
  --t3: #8a8f98;
  --t4: #5f636b;
  --accent: #a78bfa;
  --green: #27a644;
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --rad: 8px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--void);color:var(--t1);font-family:var(--font);min-height:100vh}
body::before{content:'';position:fixed;inset:0;background-image:radial-gradient(circle,rgba(167,139,250,0.03) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;z-index:0}
.container{max-width:1440px;margin:0 auto;padding:0 32px;position:relative;z-index:1}
.header{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(8,9,10,0.85);backdrop-filter:blur(12px);z-index:10}
.header-left{display:flex;align-items:center;gap:14px}
.logo-icon{width:38px;height:38px;border-radius:var(--rad);background:linear-gradient(135deg,#a78bfa,#8b5cf6);display:grid;place-items:center;font-size:18px;color:#fff}
.logo-name{font-size:18px;font-weight:600;letter-spacing:-0.03em;line-height:1}
.logo-sub{font-size:10px;font-weight:500;color:var(--t4);text-transform:uppercase;letter-spacing:0.08em;font-family:var(--mono)}
.status-badge{display:flex;align-items:center;gap:7px;padding:4px 12px;border-radius:999px;background:var(--deep);border:1px solid var(--border);font-size:12px;font-weight:500;color:var(--t3)}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;box-shadow:0 0 6px rgba(39,166,68,0.4)}
.modules{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:24px 0}
.module{background:var(--deep);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04)}
.module:hover{border-color:var(--border-s);background:rgba(167,139,250,0.04)}
.module.active{border-color:var(--accent);background:rgba(167,139,250,0.08)}
.module-icon{font-size:16px;margin-bottom:6px}
.module-title{font-size:14px;font-weight:600;color:var(--t1);margin-bottom:3px}
.module-sub{font-size:11px;color:var(--t3);margin-bottom:6px}
.module-status{font-size:11px;font-family:var(--mono)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding-bottom:64px}
.panel{background:var(--deep);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04)}
.panel h3{font-size:15px;font-weight:600;margin-bottom:14px;color:var(--t1)}
.form-group{margin-bottom:12px}
.form-group label{display:block;font-size:11px;font-weight:600;color:var(--t4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px}
.form-group textarea,.form-group input,.form-group select{width:100%;background:var(--abyss);border:1px solid var(--border);border-radius:var(--rad);padding:9px 12px;color:var(--t1);font-size:13px;font-family:var(--font);outline:none;transition:border-color .15s}
.form-group textarea:focus,.form-group input:focus,.form-group select:focus{border-color:var(--accent)}
.form-group textarea{resize:vertical;min-height:64px}
.form-group select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8f98' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
.btn{padding:10px 20px;border:none;border-radius:var(--rad);font-size:13px;font-weight:600;font-family:var(--font);cursor:pointer;transition:all .15s;background:var(--accent);color:#fff;width:100%;margin-top:4px}
.btn:hover{background:#9d71f5;box-shadow:0 0 16px rgba(167,139,250,0.2)}
.btn:active{transform:scale(0.98)}
.output{background:var(--abyss);border:1px solid var(--border);border-radius:var(--rad);padding:14px;font-family:var(--mono);font-size:12px;color:var(--t2);white-space:pre-wrap;word-break:break-word;min-height:200px;max-height:500px;overflow:auto;line-height:1.6}
@media(max-width:1024px){.modules{grid-template-columns:repeat(2,1fr)}.grid-2{grid-template-columns:1fr}}
@media(max-width:640px){.modules{grid-template-columns:1fr}.container{padding:0 16px}.header{padding:14px 0}}
      `}</style>

      <div className="container">
        <header className="header">
          <div className="header-left">
            <div className="logo-icon">Δ</div>
            <div>
              <div className="logo-name">FORGE</div>
              <div className="logo-sub">
                {locale === 'zh' ? 'SAINT ANGELO 内容中台' : 'SAINT ANGELO Content Platform'}
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              style={{padding:'4px 10px',borderRadius:'999px',background:'var(--deep)',
                border:'1px solid var(--border)',fontSize:'11px',fontWeight:500,
                color:'var(--t3)',cursor:'pointer',fontFamily:'var(--font)'}}>
              {locale === 'zh' ? '🌐 EN' : '🌐 中文'}
            </button>
            <div className="status-badge">
              <span className="status-dot"></span>
              {locale === 'zh' ? '9模块就绪' : '9 Modules Ready'}
            </div>
          </div>
        </header>

        <div className="modules" id="moduleGrid"></div>

        <div className="grid-2">
          <div className="panel">
            <h3 id="panelTitle">
              {locale === 'zh' ? '选择模块' : 'Select Module'}
            </h3>
            <div id="panelBody">
              <p style={{ color: 'var(--t3)', fontSize: '14px' }}>
                {locale === 'zh' ? '点击上方模块开始使用' : 'Click a module above to start'}
              </p>
            </div>
          </div>
          <div className="panel">
            <h3>{locale === 'zh' ? '输出结果' : 'Output'}</h3>
            <div className="output" id="outputArea">
              {locale === 'zh' ? '等待操作...' : 'Waiting...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
