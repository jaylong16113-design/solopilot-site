'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

export default function AxiomPage() {
  const { locale, t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Inject Google Fonts link
    const fontLink = document.createElement('link')
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    // Build translations object for the SPA
    const __T = {
      unnamed: t('axiom_unnamed') === 'axiom_unnamed' ? (locale === 'zh' ? '未命名' : 'Unnamed') : t('axiom_unnamed'),
      running: t('axiom_running'),
      start: t('axiom_start'),
      generating: t('axiom_generating'),
      report: t('axiom_report'),
      kpi_aware: t('axiom_kpi_aware'),
      kpi_interested: t('axiom_kpi_interested'),
      kpi_purchased: t('axiom_kpi_purchased'),
      kpi_revenue: t('axiom_kpi_revenue'),
      no_data: t('axiom_no_data'),
      request_failed: locale === 'zh' ? '请求失败' : 'Request failed',
      sim_complete: locale === 'zh' ? '推演完成' : 'Simulation Complete',
      report_ready: locale === 'zh' ? '报告已生成' : 'Report Generated',
      enter_link: locale === 'zh' ? '请输入链接' : 'Please enter a URL',
      link_failed: locale === 'zh' ? '链接分析失败' : 'Link Analysis Failed',
      keywords_applied: locale === 'zh' ? '关键词已应用' : 'Keywords Applied',
      file_failed: locale === 'zh' ? '文件分析失败' : 'File Analysis Failed',
      apply_keywords: locale === 'zh' ? '→ 应用关键词' : '→ Apply Keywords',
      generating_report: locale === 'zh' ? '📄 报告生成中…' : '📄 Generating Report…',
      view_report: t('axiom_view_report'),
      blocks_suffix: locale === 'zh' ? '个板块' : 'sections',
      elapsed: locale === 'zh' ? '耗时' : 'elapsed',
      proj_scale: locale === 'zh' ? '推演规模' : 'Scale',
      proj_purchased: locale === 'zh' ? '预计购买' : 'Est. Purchased',
      proj_revenue: locale === 'zh' ? '预计营收' : 'Est. Revenue',
      proj_time: locale === 'zh' ? '预估耗时' : 'Est. Time',
    }

    // Inject the SPA script with bilingual support
    const script = document.createElement('script')
    script.textContent = `
const API = '/api/axiom';
const __LANG = ${JSON.stringify(locale)};
const __T = ${JSON.stringify(__T)};
const interestsAll = ['数码3C','美妆护肤','运动健身','母婴育儿','家居生活','汽车出行','美食餐饮','时尚穿搭','教育培训','旅游度假','健康养生','宠物','游戏电竞','财经理财','影视娱乐'];
let selectedInterests = ['时尚穿搭','运动健身','数码3C'];
let lastSimResult = null;
let reportUrl = null;

window.__LANG__ = __LANG;

window.addEventListener('DOMContentLoaded', () => {
  renderInterests();
  fetchPresets();
  document.getElementById('buzz').addEventListener('input', e => document.getElementById('buzzVal').textContent = parseFloat(e.target.value).toFixed(2));
  ['target_age_min','target_age_max'].forEach(id => document.getElementById(id).addEventListener('change', () => {
    document.getElementById('ageLabel').textContent = document.getElementById('target_age_min').value + ' - ' + document.getElementById('target_age_max').value;
  }));
});

function switchTab(tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
}

function renderInterests(){
  document.getElementById('interests').innerHTML = interestsAll.map(i =>
    '<span class="interest-tag' + (selectedInterests.includes(i)?' selected':'') + '" onclick="toggleInterest(\\'' + i + '\\')">' + i + '</span>'
  ).join('');
}
function toggleInterest(i){
  selectedInterests.includes(i) ? selectedInterests = selectedInterests.filter(x=>x!==i) : selectedInterests.push(i);
  renderInterests();
}

async function fetchPresets(){
  try{
    const res = await fetch(API+'/presets');
    const presets = await res.json();
    document.getElementById('presets').innerHTML = presets.map((p,i) =>
      '<span class="preset-chip" data-idx="' + i + '" onclick="applyPreset(' + i + ')">' + p.name + '</span>'
    ).join('');
  }catch(e){}
}
function applyPreset(idx){
  fetch(API+'/presets').then(r=>r.json()).then(presets=>{
    const p=presets[idx];
    document.getElementById('name').value=p.name;
    document.getElementById('category').value=p.category;
    document.getElementById('price').value=p.price;
    document.getElementById('target_gender').value=p.target_gender;
    document.getElementById('target_income_min').value=p.target_income_min;
    document.getElementById('target_age_min').value=p.target_age_min;
    document.getElementById('target_age_max').value=p.target_age_max;
    document.getElementById('buzz').value=p.buzz;
    document.getElementById('buzzVal').textContent=p.buzz.toFixed(2);
    selectedInterests=p.interests;
    renderInterests();
    document.getElementById('ageLabel').textContent=p.target_age_min + ' - ' + p.target_age_max;
    document.querySelectorAll('.preset-chip').forEach(c=>c.classList.remove('active'));
    document.querySelector('.preset-chip[data-idx="' + idx + '"]')?.classList.add('active');
  });
}

function getProductData(){
  return {
    name: document.getElementById('name').value||__T.unnamed,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value)||0,
    target_gender: document.getElementById('target_gender').value,
    target_income_min: parseInt(document.getElementById('target_income_min').value)||0,
    target_age_min: parseInt(document.getElementById('target_age_min').value)||18,
    target_age_max: parseInt(document.getElementById('target_age_max').value)||55,
    interests: selectedInterests,
    buzz: parseFloat(document.getElementById('buzz').value)||0.7,
    population: parseInt(document.getElementById('population').value)||10000,
    seed_users: parseInt(document.getElementById('seed_users').value)||50,
    max_rounds: parseInt(document.getElementById('max_rounds').value)||10,
    mode: document.getElementById('mode').value||'auto',
  };
}

async function runSim(){
  const btn = document.getElementById('btnSim');
  btn.disabled=true; btn.style.opacity='0.7'; btn.textContent=__T.running;
  try{
    const res = await fetch(API+'/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(getProductData())});
    if(!res.ok) throw new Error((await res.json()).detail||__T.request_failed);
    lastSimResult = await res.json();
    renderResults(lastSimResult);
    document.getElementById('btnReport').disabled = false;
    toast('✅ ' + __T.sim_complete, 'success');
  }catch(e){ toast('❌ '+e.message); }
  finally{ btn.disabled=false; btn.style.opacity='1'; btn.textContent=__T.start; }
}

async function runFullAnalysis(){
  const btn = document.getElementById('btnReport');
  btn.disabled=true; btn.textContent=__T.generating;
  document.getElementById('reportSection').style.display='block';
  document.getElementById('reportSection').innerHTML = '<div class="detail-panel"><div class="detail-title">' + __T.generating_report + '</div><div class="progress-bar"><div class="progress-fill"></div></div></div>';
  try{
    const res = await fetch(API+'/run-full-analysis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(getProductData())});
    if(!res.ok) throw new Error((await res.json()).detail||__T.request_failed);
    const data = await res.json();
    lastSimResult = data.simulation;
    renderResults(lastSimResult);
    reportUrl = data.report.doc_url;
    document.getElementById('reportSection').innerHTML = '<a class="report-link" href="' + reportUrl + '" target="_blank"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>📄 ' + __T.view_report + ' (' + data.report.block_count + __T.blocks_suffix + ')</a><div style="font-size:11px;color:var(--text-quaternary);margin-top:6px">' + data.report.message + ' · ' + __T.elapsed + data.total_elapsed_seconds.toFixed(1) + 's</div>';
    toast('✅ ' + __T.report_ready, 'success');
  }catch(e){ toast('❌ '+e.message); }
  finally{ btn.disabled=false; btn.textContent=__T.report; }
}

function renderResults(data){
  document.getElementById('emptyState').style.display='none';
  document.getElementById('resultsContainer').style.display='block';
  const cr = (data.conversion_rate*100).toFixed(2);
  document.getElementById('kpiGrid').innerHTML = [
    {l:__T.kpi_aware,v:fmt(data.aware_count),s:(data.aware_count/data.population*100).toFixed(1) + '% ' + (__LANG==='zh'?'触达率':'Reach Rate')},
    {l:__T.kpi_interested,v:fmt(data.interested_count),s:(__LANG==='zh'?'兴趣转化 ':'Interest Conv. ') + (data.interested_count/Math.max(data.aware_count,1)*100).toFixed(1) + '%'},
    {l:__T.kpi_purchased,v:fmt(data.purchased_count),s:(__LANG==='zh'?'转化率 ':'Conv. Rate ') + cr + '% · ' + (data.mode_used||'auto') + (__LANG==='zh'?'模式':' mode') + ' · ' + data.elapsed_seconds + 's',c:'accent'},
    {l:__T.kpi_revenue,v:fmtMoney(data.revenue),s:fmt(data.population) + (__LANG==='zh'?'人 · ':' · ') + data.rounds + (__LANG==='zh'?'轮':' rounds')},
  ].map((k,i)=>'<div class="kpi-card fade-up"><div class="kpi-label">' + k.l + '</div><div class="kpi-value ' + (k.c||'') + '">' + k.v + '</div><div class="kpi-sub">' + k.s + '</div></div>').join('');

  const p = data.buyer_profile||{};
  const cities = p.top_cities||[];
  const maxC = cities.length ? cities[0][1] : 1;
  document.getElementById('cityChart').innerHTML = cities.map(([c,n])=>'<div class="bar-row"><span class="bar-label">' + c + '</span><div class="bar-track"><div class="bar-fill" style="width:' + (n/maxC*100) + '%"></div></div><span class="bar-value">' + n + '</span></div>').join('')||'<div style="color:var(--text-quaternary);font-size:13px;padding:8px">' + __T.no_data + '</div>';

  const g = p.gender||{男:0,女:0};
  const tG = Math.max((g['男']||0)+(g['女']||0),1);
  const mP = Math.round((g['男']||0)/tG*100);
  document.getElementById('genderChart').innerHTML = '<div class="gender-item"><div class="gender-ring" style="background:conic-gradient(#5e6ad2 ' + (mP*3.6) + 'deg,rgba(255,255,255,0.06) ' + (mP*3.6) + 'deg)"><div class="gender-ring-inner">' + mP + '%</div></div><span class="gender-value">👨 ' + (g['男']||0) + '</span></div><div class="gender-item"><div class="gender-ring" style="background:conic-gradient(#a78bfa ' + ((100-mP)*3.6) + 'deg,rgba(255,255,255,0.06) ' + ((100-mP)*3.6) + 'deg)"><div class="gender-ring-inner">' + (100-mP) + '%</div></div><span class="gender-value">👩 ' + (g['女']||0) + '</span></div>';

  const inc = p.income_bands||{};
  document.getElementById('incomeChart').innerHTML = Object.keys(inc).length ? '<div style="margin-top:14px">' + Object.entries(inc).map(([b,n])=>'<div class="bar-row"><span class="bar-label">' + b + '</span><div class="bar-track"><div class="bar-fill" style="width:' + (n/Math.max(...Object.values(inc))*100) + '%;background:linear-gradient(90deg,#a78bfa,#c4b5fd)"></div></div><span class="bar-value">' + n + '</span></div>').join('') + '</div>' : '';

  const projs = data.projections||{};
  document.getElementById('projectionsTable').innerHTML = '<thead><tr><th>' + __T.proj_scale + '</th><th>' + __T.proj_purchased + '</th><th>' + __T.proj_revenue + '</th><th>' + __T.proj_time + '</th></tr></thead><tbody>' + Object.entries(projs).map(([s,p])=>'<tr><td style="color:var(--text-primary);font-weight:500">' + s + '</td><td>' + fmt(p.purchased) + '</td><td style="color:var(--accent-hover)">' + fmtMoney(p.revenue) + '</td><td>' + fmtTime(p.estimated_seconds) + '</td></tr>').join('') + '</tbody>';
}

async function analyzeLink(){
  const url = document.getElementById('linkUrl').value.trim();
  if(!url) return toast(__T.enter_link);
  try{
    const res = await fetch(API+'/analyze-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,product_name:document.getElementById('name').value})});
    const data = await res.json();
    document.getElementById('linkResult').style.display='block';
    document.getElementById('linkKeywords').innerHTML = data.keywords.map(k => '<span class="interest-tag" onclick="addLinkKeyword(\\'' + k + '\\')">' + k + '</span>').join('');
    window._linkKw = data.keywords;
  }catch(e){ toast('❌ ' + __T.link_failed); }
}

function addLinkKeyword(kw){
  if(!selectedInterests.includes(kw)){ selectedInterests.push(kw); renderInterests(); }
}

function applyLinkKeywords(){
  if(window._linkKw) window._linkKw.forEach(k => { if(!selectedInterests.includes(k)) selectedInterests.push(k); });
  renderInterests();
  toast('✅ ' + __T.keywords_applied);
}

async function handleFile(e){
  const file = e.target.files[0];
  if(!file) return;
  const form = new FormData();
  form.append('file', file);
  try{
    const res = await fetch(API+'/upload',{method:'POST',body:form});
    const data = await res.json();
    document.getElementById('fileResult').style.display='block';
    document.getElementById('fileResult').innerHTML = '<div class="form-label">📄 ' + data.filename + ' (' + (data.size/1024).toFixed(1) + 'KB)</div><div class="interest-tags" style="margin-top:6px">' + data.keywords.map(k=>'<span class="interest-tag" onclick="addLinkKeyword(\\'' + k + '\\')">' + k + '</span>').join('') + '</div><button class="btn btn-report" onclick="applyLinkKeywords()" style="width:100%;margin-top:8px">' + __T.apply_keywords + '</button>';
    window._linkKw = data.keywords;
  }catch(e){ toast('❌ ' + __T.file_failed); }
}

function fmt(n){
  if(__LANG==='zh'){
    return n>=100000000?(n/100000000).toFixed(2)+'亿':n>=10000?(n/10000).toFixed(1)+'万':n.toLocaleString('zh-CN');
  } else {
    return n>=1000000000?(n/1000000000).toFixed(2)+'B':n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(1)+'K':n.toLocaleString('en-US');
  }
}
function fmtMoney(n){
  if(__LANG==='zh'){
    return n>=100000000?'¥'+(n/100000000).toFixed(2)+'亿':n>=10000?'¥'+(n/10000).toFixed(1)+'万':'¥'+n.toLocaleString('zh-CN');
  } else {
    return n>=1000000000?'$'+(n/1000000000).toFixed(2)+'B':n>=1000000?'$'+(n/1000000).toFixed(1)+'M':n>=1000?'$'+(n/1000).toFixed(1)+'K':'$'+n.toLocaleString('en-US');
  }
}
function fmtTime(s){
  if(__LANG==='zh'){
    return s<1?'<1秒':s<60?s.toFixed(1)+'秒':s<3600?(s/60).toFixed(1)+'分':(s/3600).toFixed(1)+'小时';
  } else {
    return s<1?'<1s':s<60?s.toFixed(1)+'s':s<3600?(s/60).toFixed(1)+'min':(s/3600).toFixed(1)+'hr';
  }
}
function toast(msg, t){ const el=document.createElement('div'); el.className='toast'+(t?' '+t:''); el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),3000); }
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.metaKey){ e.preventDefault(); runSim(); } });
`
    containerRef.current.appendChild(script)

    // Dispatch DOMContentLoaded so the listeners fire
    document.dispatchEvent(new Event('DOMContentLoaded'))

    return () => {
      fontLink.remove()
      script.remove()
    }
  }, [locale, t])

  const isZh = locale === 'zh'

  return (
    <div ref={containerRef}>
      <style>{`
:root {
  --void:#08090a;--abyss:#0c0d0f;--deep:#0f1011;--panel:#141518;--panel-hover:#191a1d;
  --border-subtle:rgba(255,255,255,0.04);--border-default:rgba(255,255,255,0.06);
  --border-strong:rgba(255,255,255,0.08);--border-active:rgba(255,255,255,0.12);
  --text-primary:#f7f8f8;--text-secondary:#cfd2d8;--text-tertiary:#8a8f98;--text-quaternary:#5f636b;
  --accent:#5e6ad2;--accent-hover:#7170ff;--accent-glow:rgba(94,106,210,0.15);
  --green:#27a644;--amber:#f59e0b;--red:#ef4444;
  --font:'Inter',system-ui,-apple-system,sans-serif;--font-mono:'JetBrains Mono',monospace;
  --radius-sm:4px;--radius-md:6px;--radius-lg:8px;--radius-xl:12px;--radius-pill:9999px;
  --shadow-inset:inset 0 1px 0 rgba(255,255,255,0.04);
}
*{margin:0;padding:0;box-sizing:border-box}
html{font-size:16px;-webkit-font-smoothing:antialiased}
body{background:var(--void);color:var(--text-primary);font-family:var(--font);min-height:100vh;}
body::before{content:'';position:fixed;inset:0;background-image:radial-gradient(circle,rgba(94,106,210,0.04) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;z-index:0}
.container{max-width:1440px;margin:0 auto;padding:0 32px;position:relative;z-index:1}
.header{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid var(--border-subtle);margin-bottom:24px;position:sticky;top:0;background:rgba(8,9,10,0.85);backdrop-filter:blur(12px);z-index:10}
.header-left{display:flex;align-items:center;gap:14px}
.logo{width:38px;height:38px;border-radius:var(--radius-lg);background:linear-gradient(135deg,var(--accent),var(--accent-hover));display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;overflow:hidden}
.logo-name{font-size:18px;font-weight:600;letter-spacing:-0.03em;line-height:1}
.logo-tagline{font-size:10px;font-weight:500;color:var(--text-quaternary);text-transform:uppercase;letter-spacing:0.08em;font-family:var(--font-mono)}
.status-badge{display:flex;align-items:center;gap:7px;padding:4px 12px;border-radius:var(--radius-pill);background:var(--deep);border:1px solid var(--border-default);font-size:12px;font-weight:500;color:var(--text-tertiary)}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px rgba(39,166,68,0.4)}
.main-grid{display:grid;grid-template-columns:400px 1fr;gap:20px;align-items:start;padding-bottom:64px}
.tabs{display:flex;gap:4px;margin-bottom:16px}
.tab{padding:6px 14px;border-radius:var(--radius-md);background:transparent;border:none;color:var(--text-tertiary);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;font-family:var(--font)}
.tab.active{background:var(--panel);color:var(--text-primary)}
.tab:hover:not(.active){color:var(--text-secondary)}
.tab-content{display:none}.tab-content.active{display:block}
.panel{background:var(--deep);border:1px solid var(--border-default);border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-inset)}
.panel-header{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--border-subtle);font-size:13px;font-weight:600;color:var(--text-secondary)}
.panel-body{padding:18px}
.form-section{margin-bottom:14px}
.form-section:last-child{margin-bottom:0}
.form-label{display:block;font-size:11px;font-weight:600;color:var(--text-quaternary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.form-input,.form-select,.form-textarea{width:100%;background:var(--abyss);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:9px 12px;color:var(--text-primary);font-size:13px;font-family:var(--font);outline:none;transition:border-color .15s,box-shadow .15s}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
.form-select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8f98' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
.file-drop{border:1px dashed var(--border-strong);border-radius:var(--radius-lg);padding:24px;text-align:center;color:var(--text-tertiary);font-size:13px;cursor:pointer;transition:all .2s;background:var(--abyss)}
.file-drop:hover{border-color:var(--accent);background:var(--accent-glow);color:var(--text-secondary)}
.file-drop input[type=file]{display:none}
.interest-tags{display:flex;flex-wrap:wrap;gap:5px}
.interest-tag{padding:3px 8px;border-radius:var(--radius-sm);background:var(--panel);border:1px solid var(--border-default);font-size:11px;color:var(--text-quaternary);cursor:pointer;transition:all .15s;user-select:none}
.interest-tag.selected{background:rgba(94,106,210,0.08);border-color:rgba(94,106,210,0.3);color:var(--accent-hover)}
.presets{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
.preset-chip{padding:4px 10px;border-radius:var(--radius-pill);background:var(--panel);border:1px solid var(--border-default);font-size:11px;font-weight:500;color:var(--text-tertiary);cursor:pointer;transition:all .15s;white-space:nowrap}
.preset-chip:hover{background:var(--panel-hover);border-color:var(--border-strong);color:var(--text-secondary)}
.preset-chip.active{background:rgba(94,106,210,0.08);border-color:var(--accent);color:var(--accent-hover)}
.btn-group{display:flex;gap:8px;margin-top:16px}
.btn{padding:10px 18px;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;font-family:var(--font);cursor:pointer;transition:all .15s;letter-spacing:-0.01em}
.btn-primary{background:var(--accent);color:#fff;flex:1}
.btn-primary:hover{background:var(--accent-hover);box-shadow:0 0 20px var(--accent-glow);transform:translateY(-1px)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
.btn-report{background:var(--panel);color:var(--text-primary);border:1px solid var(--border-strong)}
.btn-report:hover{background:var(--panel-hover);border-color:var(--accent)}
.btn-report:disabled{opacity:.5;cursor:not-allowed}
.results-area{display:flex;flex-direction:column;gap:16px}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;text-align:center;padding:48px}
.empty-icon{width:72px;height:72px;border-radius:16px;background:linear-gradient(135deg,rgba(94,106,210,0.08),transparent);border:1px solid var(--border-default);display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px}
.empty-title{font-size:20px;font-weight:600;letter-spacing:-0.03em;margin-bottom:6px}
.empty-desc{font-size:13px;color:var(--text-tertiary);max-width:360px;line-height:1.6}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.kpi-card{background:var(--deep);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:14px 16px;box-shadow:var(--shadow-inset)}
.kpi-label{font-size:11px;font-weight:600;color:var(--text-quaternary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px}
.kpi-value{font-size:26px;font-weight:600;letter-spacing:-0.04em;color:var(--text-primary);font-family:var(--font-mono);line-height:1}.kpi-value.accent{color:var(--accent-hover)}
.kpi-sub{font-size:11px;color:var(--text-tertiary);margin-top:3px}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.detail-panel{background:var(--deep);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:16px;box-shadow:var(--shadow-inset)}
.detail-title{font-size:12px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px}
.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:7px}
.bar-label{width:56px;font-size:12px;color:var(--text-tertiary);text-align:right;flex-shrink:0}
.bar-track{flex:1;height:5px;background:var(--abyss);border-radius:var(--radius-pill);overflow:hidden}
.bar-fill{height:100%;border-radius:var(--radius-pill);background:linear-gradient(90deg,var(--accent),var(--accent-hover));transition:width .6s ease}
.bar-value{width:40px;font-size:12px;font-weight:500;color:var(--text-secondary);font-family:var(--font-mono);text-align:left}
.gender-donuts{display:flex;justify-content:center;gap:36px;padding:6px 0}
.gender-item{display:flex;flex-direction:column;align-items:center;gap:5px}
.gender-ring{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.gender-ring-inner{width:28px;height:28px;border-radius:50%;background:var(--deep);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--text-primary)}
.gender-value{font-size:12px;font-weight:500;color:var(--text-secondary)}
.report-link{display:flex;align-items:center;gap:10px;padding:14px 18px;background:var(--deep);border:1px solid var(--border-default);border-radius:var(--radius-lg);text-decoration:none;color:var(--accent-hover);font-size:14px;font-weight:500;transition:all .2s}
.report-link:hover{border-color:var(--accent);background:var(--accent-glow)}
.report-link svg{flex-shrink:0}
.projections-panel{background:var(--deep);border:1px solid var(--border-default);border-radius:var(--radius-lg);overflow:hidden}
.projections-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid var(--border-subtle)}
.projections-title{font-size:12px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em}
.projections-note{font-size:11px;color:var(--text-quaternary);font-style:italic}
.projections-table{width:100%;font-size:12px}
.projections-table th,.projections-table td{padding:9px 16px;text-align:left;border-bottom:1px solid var(--border-subtle)}
.projections-table th{font-size:11px;font-weight:600;color:var(--text-quaternary);text-transform:uppercase;letter-spacing:0.05em;background:var(--abyss)}
.projections-table td{color:var(--text-secondary);font-family:var(--font-mono);font-size:12px}
.projections-table tr:hover td{background:var(--panel-hover)}
.progress-bar{margin-top:12px;height:4px;background:var(--abyss);border-radius:var(--radius-pill);overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-hover));border-radius:var(--radius-pill);animation:progressPulse 1.5s ease infinite;width:60%}
@keyframes progressPulse{0%,100%{opacity:1}50%{opacity:0.6}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s ease forwards}
.toast{position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:var(--radius-md);background:var(--panel);border:1px solid var(--border-strong);color:var(--text-primary);font-size:13px;font-weight:500;z-index:100;animation:fadeUp .3s ease;box-shadow:0 8px 24px rgba(0,0,0,0.5)}
.toast.success{border-color:rgba(39,166,68,0.3);background:rgba(39,166,68,0.08);color:var(--green)}
@media(max-width:1024px){.main-grid{grid-template-columns:1fr}.kpi-grid{grid-template-columns:repeat(2,1fr)}.detail-grid{grid-template-columns:1fr}}
@media(max-width:640px){.container{padding:0 16px}.header{padding:14px 0}.kpi-grid{grid-template-columns:1fr 1fr;gap:6px}.kpi-value{font-size:22px}.form-row{grid-template-columns:1fr}.btn-group{flex-direction:column}}
      `}</style>

      <div className="container">
        <header className="header">
          <div className="header-left">
            <div className="logo">◇</div>
            <div>
              <div className="logo-name">AXIOM</div>
              <div className="logo-tagline">{t('axiom_tagline')}</div>
            </div>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <span className="status-dot"></span>{t('axiom_engine_ready')} · 10M Max
            </div>
          </div>
        </header>

        <div className="main-grid">
          {/* Left: Control Panel */}
          <div>
            <div className="tabs">
              <button className="tab active" onClick={() => { const e = window as any; e.switchTab && e.switchTab('product') }}>{t('axiom_product_tab')}</button>
              <button className="tab" onClick={() => { const e = window as any; e.switchTab && e.switchTab('link') }}>{t('axiom_link_tab')}</button>
            </div>

            {/* Tab: Product Params */}
            <div className="tab-content active" id="tab-product">
              <div className="panel">
                <div className="panel-header">⚙ {t('axiom_sim_params')}</div>
                <div className="panel-body">
                  <div className="form-section">
                    <div className="form-label">{t('axiom_presets')}</div>
                    <div className="presets" id="presets"></div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">{t('axiom_product_name')}</div>
                    <input type="text" className="form-input" id="name" defaultValue="可运动西服" />
                  </div>
                  <div className="form-row">
                    <div className="form-section">
                      <div className="form-label">{t('axiom_category')}</div>
                      <select className="form-select" id="category" defaultValue="时尚穿搭">
                        <option>汽车出行</option><option>数码3C</option><option>美妆护肤</option>
                        <option>运动健身</option><option>时尚穿搭</option><option>美食餐饮</option>
                        <option>家居生活</option><option>母婴育儿</option><option>教育培训</option>
                        <option>旅游度假</option><option>健康养生</option><option>宠物</option>
                        <option>游戏电竞</option><option>财经理财</option><option>影视娱乐</option>
                      </select>
                    </div>
                    <div className="form-section">
                      <div className="form-label">{t('axiom_price')}</div>
                      <input type="number" className="form-input" id="price" defaultValue="999" min="1" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-section">
                      <div className="form-label">{t('axiom_target_gender')}</div>
                      <select className="form-select" id="target_gender" defaultValue="男">
                        <option value="通用">{isZh ? '通用' : 'Unisex'}</option>
                        <option value="男">{isZh ? '男' : 'Male'}</option>
                        <option value="女">{isZh ? '女' : 'Female'}</option>
                      </select>
                    </div>
                    <div className="form-section">
                      <div className="form-label">{t('axiom_target_income')}</div>
                      <select className="form-select" id="target_income_min" defaultValue="2">
                        <option value="0">&lt;5K</option><option value="1">5-8K</option>
                        <option value="2">8-12K</option><option value="3">12-20K</option>
                        <option value="4">20-35K</option><option value="5">35-50K</option>
                        <option value="6">&gt;50K</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">{t('axiom_target_interests')}</div>
                    <div className="interest-tags" id="interests"></div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">{t('axiom_target_age')}: <span id="ageLabel">25 - 45</span></div>
                    <div className="form-row">
                      <input type="number" className="form-input" id="target_age_min" defaultValue="25" min="18" max="80" />
                      <input type="number" className="form-input" id="target_age_max" defaultValue="45" min="18" max="80" />
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-label">{t('axiom_buzz')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="range" id="buzz" defaultValue="0.7" min="0.1" max="1" step="0.05"
                        style={{ flex: 1, accentColor: 'var(--accent)', background: 'var(--abyss)', height: '4px', borderRadius: '2px' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', width: '36px', textAlign: 'right' }} id="buzzVal">0.70</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-section">
                      <div className="form-label">{t('axiom_population')}</div>
                      <select className="form-select" id="population" defaultValue="10000">
                        <option value="1000">1,000</option><option value="5000">5,000</option>
                        <option value="10000">10,000</option><option value="50000">50,000</option>
                        <option value="100000">100,000</option><option value="500000">500,000</option>
                        <option value="1000000">1,000,000</option><option value="3000000">🔥 3,000,000</option>
                        <option value="5000000">5,000,000</option><option value="10000000">10,000,000</option>
                      </select>
                    </div>
                    <div className="form-section">
                      <div className="form-label">{t('axiom_seed_users')}</div>
                      <input type="number" className="form-input" id="seed_users" defaultValue="50" min="1" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-section">
                      <div className="form-label">{t('axiom_rounds')}</div>
                      <input type="number" className="form-input" id="max_rounds" defaultValue="10" min="1" max="50" />
                    </div>
                    <div className="form-section">
                      <div className="form-label">{t('axiom_mode')}</div>
                      <select className="form-select" id="mode" defaultValue="auto">
                        <option value="auto">{t('axiom_mode_auto')}</option>
                        <option value="fast">{t('axiom_mode_fast')}</option>
                        <option value="full">{t('axiom_mode_full')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-primary" id="btnSim" onClick={() => { const w = window as any; w.runSim && w.runSim() }}>{t('axiom_start')}</button>
                    <button className="btn btn-report" id="btnReport" disabled>{t('axiom_report')}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: Link/File */}
            <div className="tab-content" id="tab-link">
              <div className="panel">
                <div className="panel-header">🔗 {isZh ? '链接分析' : 'Link Analysis'}</div>
                <div className="panel-body">
                  <div className="form-section">
                    <div className="form-label">{t('axiom_link_url')}</div>
                    <input type="url" className="form-input" id="linkUrl" placeholder={isZh ? 'https://... 粘贴小红书/抖音/商品链接' : 'https://... Paste Xiaohongshu/Douyin/product link'} />
                  </div>
                  <button className="btn btn-primary" onClick={() => { const w = window as any; w.analyzeLink && w.analyzeLink() }}
                    style={{ width: '100%', marginBottom: '14px' }}>{t('axiom_extract')}</button>
                  <div id="linkResult" style={{ display: 'none' }}>
                    <div className="form-label">{isZh ? '提取到的关键词' : 'Extracted Keywords'}</div>
                    <div className="interest-tags" id="linkKeywords"></div>
                    <button className="btn btn-report" onClick={() => { const w = window as any; w.applyLinkKeywords && w.applyLinkKeywords() }}
                      style={{ width: '100%', marginTop: '10px' }}>{isZh ? '→ 应用到产品参数' : '→ Apply to Product'}</button>
                  </div>
                </div>
              </div>

              <div className="panel" style={{ marginTop: '16px' }}>
                <div className="panel-header">📎 {t('axiom_upload')}</div>
                <div className="panel-body">
                  <div className="file-drop" onClick={() => document.getElementById('fileInput')?.click()}>
                    <input type="file" id="fileInput" onChange={(e) => { const w = window as any; w.handleFile && w.handleFile(e) }}
                      accept=".txt,.md,.pdf,.docx,.doc" style={{ display: 'none' }} />
                    <div>📂 {isZh ? '点击上传文件' : 'Click to Upload'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-quaternary)', marginTop: '4px' }}>{isZh ? '支持 .txt .md .pdf .docx' : 'Supports .txt .md .pdf .docx'}</div>
                  </div>
                  <div id="fileResult" style={{ display: 'none', marginTop: '12px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="results-area" id="resultsArea">
            <div className="empty-state" id="emptyState">
              <div className="empty-icon">◈</div>
              <div className="empty-title">{t('axiom_empty_title')}</div>
              <div className="empty-desc">{t('axiom_empty_desc')}</div>
            </div>
            <div id="resultsContainer" style={{ display: 'none' }}>
              <div className="kpi-grid" id="kpiGrid"></div>
              <div className="detail-grid">
                <div className="detail-panel">
                  <div className="detail-title">{t('axiom_city_dist')}</div>
                  <div id="cityChart"></div>
                </div>
                <div className="detail-panel">
                  <div className="detail-title">{t('axiom_gender_income')}</div>
                  <div className="gender-donuts" id="genderChart"></div>
                  <div id="incomeChart"></div>
                </div>
              </div>
              <div className="projections-panel">
                <div className="projections-header">
                  <span className="projections-title">{t('axiom_scale_projection')}</span>
                  <span className="projections-note">{t('axiom_projection_note')}</span>
                </div>
                <table className="projections-table" id="projectionsTable"></table>
              </div>
              <div id="reportSection" style={{ display: 'none' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
