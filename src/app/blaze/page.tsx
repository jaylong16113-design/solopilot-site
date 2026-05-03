'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

// ── Types ──

interface Video {
  id: string
  title: string
  author: string
  platform: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
  posted_at: string
  tags: string[]
  duration_sec: number
  viral_score: number
}

interface SearchResult {
  keyword: string
  category: string
  total: number
  videos: Video[]
}

interface AnalyzeResult {
  video: Video
  script_structure: Record<string, string>
  brand_mapping: { original: string; mapped: string }[]
  reusable_template: { format: string; optimal_duration: string; top_tags: string[] }
}

interface KocItem {
  username: string
  platform: string
  followers: number
  engagement_rate: number
  koc_score: number
  content_style: string
  reason: string
  recommended_action: string
  contact_priority: string
}

interface KocResult {
  competitors: string[]
  total: number
  high_priority: number
  koc_list: KocItem[]
}

type Tab = 'search' | 'analyze' | 'koc'
type Result = SearchResult | AnalyzeResult | KocResult | null

// ── Helpers ──

function formatViews(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}

function formatLikes(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}

function isSearchResult(r: any): r is SearchResult {
  return r && 'videos' in r
}

function isAnalyzeResult(r: any): r is AnalyzeResult {
  return r && 'script_structure' in r
}

function isKocResult(r: any): r is KocResult {
  return r && 'koc_list' in r
}

// ── Page Component ──

export default function BlazePage() {
  const { locale, t } = useI18n()
  const isZh = locale === 'zh'

  const [activeTab, setActiveTab] = useState<Tab>('search')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [error, setError] = useState('')

  // Search form
  const [searchKw, setSearchKw] = useState('可运动西服')
  const [searchCat, setSearchCat] = useState('男装')
  const [searchDays, setSearchDays] = useState(7)

  // Analyze form
  const [analyzeVid, setAnalyzeVid] = useState('DY001')
  const [analyzeBrand, setAnalyzeBrand] = useState('报喜鸟')

  // KOC form
  const [kocCompetitors, setKocCompetitors] = useState('海澜之家,雅戈尔,利郎')

  const callApi = useCallback(
    async (endpoint: string, body: any) => {
      setLoading(true)
      setError('')
      setResult(null)
      try {
        const res = await fetch(`/api/blaze/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.detail || errData.error || 'Request failed')
        }
        const data = await res.json()
        setResult(data)
      } catch (e: any) {
        setError(e.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleSearch = () => {
    callApi('videos/search', {
      keyword: searchKw,
      category: searchCat,
      days: searchDays,
      limit: 20,
    })
  }

  const handleAnalyze = () => {
    callApi('videos/analyze', {
      video_id: analyzeVid,
      brand: analyzeBrand,
    })
  }

  const handleKoc = () => {
    callApi('koc/extract', {
      competitors: kocCompetitors.split(',').map((s) => s.trim()),
      days: 30,
      min_score: 75,
    })
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'search', label: t('blaze_search'), icon: '🔍' },
    { key: 'analyze', label: t('blaze_analyze'), icon: '📐' },
    { key: 'koc', label: t('blaze_koc'), icon: '👥' },
  ]

  return (
    <div>
      <style>{`
        :root {
          --void:#08090a; --abyss:#0c0d0f; --deep:#0f1011; --panel:#141518; --panel-hover:#191a1d;
          --border:rgba(255,255,255,0.06); --border-s:rgba(255,255,255,0.08);
          --t1:#f7f8f8; --t2:#cfd2d8; --t3:#8a8f98; --t4:#5f636b;
          --accent:#f97316; --accent-hover:#ea580c; --accent-glow:rgba(249,115,22,0.15);
          --green:#27a644;
          --font:'Inter',system-ui,-apple-system,sans-serif; --mono:'JetBrains Mono',monospace;
          --rad-sm:4px; --rad-md:6px; --rad-lg:8px; --rad-xl:12px; --rad-pill:9999px;
        }
        .blaze-wrap {
          max-width:1440px; margin:0 auto; padding:0 32px;
          font-family:var(--font); background:var(--void); color:var(--t1);
          min-height:100vh; position:relative; z-index:1;
        }
        @media(max-width:640px){ .blaze-wrap{ padding:0 16px; } }
        .blaze-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 0; border-bottom:1px solid var(--border);
        }
        .blaze-logo { display:flex; align-items:center; gap:12px; }
        .blaze-logo-icon {
          width:38px; height:38px; border-radius:var(--rad-lg);
          background:linear-gradient(135deg,var(--accent),var(--accent-hover));
          display:grid; place-items:center; font-size:18px; color:#fff;
        }
        .blaze-logo-name { font-size:18px; font-weight:600; letter-spacing:-0.03em; }
        .blaze-logo-sub {
          font-size:10px; font-weight:500; color:var(--t4);
          text-transform:uppercase; letter-spacing:0.08em; font-family:var(--mono);
        }
        .blaze-status {
          display:flex; align-items:center; gap:7px; padding:4px 12px;
          border-radius:var(--rad-pill); background:var(--deep); border:1px solid var(--border);
          font-size:12px; font-weight:500; color:var(--t3);
        }
        .blaze-status-dot {
          width:6px; height:6px; border-radius:50%; background:var(--green);
          box-shadow:0 0 6px rgba(39,166,68,0.4);
        }
        .blaze-grid { display:grid; grid-template-columns:400px 1fr; gap:20px; padding:20px 0 64px; align-items:start; }
        @media(max-width:1024px){ .blaze-grid{ grid-template-columns:1fr; } }
        .blaze-tabs { display:flex; gap:4px; margin-bottom:16px; }
        .blaze-tab {
          padding:8px 16px; border-radius:var(--rad-md); background:transparent;
          border:none; color:var(--t3); font-size:13px; font-weight:500;
          cursor:pointer; transition:all .15s; font-family:var(--font);
        }
        .blaze-tab.active { background:var(--deep); color:var(--t1); }
        .blaze-tab:hover:not(.active) { color:var(--t2); }
        .blaze-card {
          background:var(--deep); border:1px solid var(--border);
          border-radius:var(--rad-xl); overflow:hidden;
        }
        .blaze-card-header {
          display:flex; align-items:center; gap:10px;
          padding:16px 20px; border-bottom:1px solid var(--border);
          font-size:15px; font-weight:600; color:var(--t1);
        }
        .blaze-card-body { padding:18px; }
        .blaze-form-group { margin-bottom:14px; }
        .blaze-form-label {
          display:block; font-size:11px; font-weight:600; color:var(--t4);
          text-transform:uppercase; letter-spacing:0.05em; margin-bottom:5px;
        }
        .blaze-input {
          width:100%; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:9px 12px; color:var(--t1);
          font-size:13px; font-family:var(--font); outline:none;
          transition:border-color .15s;
        }
        .blaze-input:focus { border-color:var(--accent); }
        .blaze-select {
          width:100%; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:9px 12px; color:var(--t1);
          font-size:13px; font-family:var(--font); outline:none; cursor:pointer;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8f98' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 10px center; padding-right:28px;
        }
        .blaze-select:focus { border-color:var(--accent); }
        .blaze-btn {
          width:100%; padding:10px 18px; border:none;
          border-radius:var(--rad-md); font-size:13px; font-weight:600;
          font-family:var(--font); cursor:pointer; transition:all .15s;
          background:var(--accent); color:#fff;
        }
        .blaze-btn:hover { background:var(--accent-hover); box-shadow:0 0 20px var(--accent-glow); transform:translateY(-1px); }
        .blaze-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
        .blaze-result {
          background:var(--deep); border:1px solid var(--border);
          border-radius:var(--rad-xl); padding:20px; min-height:300px;
          overflow-x:auto;
        }
        .blaze-result pre {
          font-family:var(--mono); font-size:12px; color:var(--t2);
          white-space:pre-wrap; word-break:break-word; line-height:1.6;
        }
        .blaze-empty {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          min-height:300px; text-align:center; color:var(--t4); font-size:14px; gap:12px;
        }
        .blaze-empty-icon { font-size:40px; opacity:0.4; }
        .blaze-error {
          padding:12px 16px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
          border-radius:var(--rad-md); color:#ef4444; font-size:13px;
        }
        .blaze-video-list { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
        .blaze-video-card {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); transition:all .15s;
        }
        .blaze-video-card:hover { border-color:var(--border-s); background:var(--panel); }
        .blaze-video-rank {
          width:24px; height:24px; border-radius:var(--rad-sm);
          background:var(--panel); display:grid; place-items:center;
          font-size:11px; font-weight:600; color:var(--t3); flex-shrink:0;
        }
        .blaze-video-info { flex:1; min-width:0; }
        .blaze-video-title { font-size:13px; font-weight:500; color:var(--t1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .blaze-video-meta { font-size:11px; color:var(--t3); margin-top:2px; }
        .blaze-video-score {
          font-size:16px; font-weight:700; color:var(--accent);
          font-family:var(--mono); flex-shrink:0;
        }
        .blaze-structure-card {
          background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:14px; margin-bottom:10px;
        }
        .blaze-structure-label { font-size:11px; font-weight:600; color:var(--t4); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; }
        .blaze-structure-value { font-size:13px; color:var(--t2); line-height:1.5; }
        .blaze-koc-table { width:100%; font-size:12px; margin-top:12px; }
        .blaze-koc-table th, .blaze-koc-table td { padding:8px 12px; text-align:left; border-bottom:1px solid var(--border); }
        .blaze-koc-table th { font-size:11px; font-weight:600; color:var(--t4); text-transform:uppercase; letter-spacing:0.05em; background:var(--abyss); }
        .blaze-koc-table td { color:var(--t2); }
        .blaze-priority-high { color:var(--accent); font-weight:600; }
        .blaze-priority-mid { color:#f59e0b; font-weight:600; }
        .blaze-priority-low { color:var(--t4); }
        .blaze-koc-score { font-weight:700; font-family:var(--mono); }
        .blaze-brand-map { display:flex; flex-direction:column; gap:6px; margin:8px 0; }
        .blaze-brand-row { display:flex; align-items:center; gap:10px; font-size:12px; color:var(--t2); }
        .blaze-brand-arrow { color:var(--accent); }
        .blaze-tag { display:inline-block; padding:2px 6px; border-radius:var(--rad-sm); background:var(--panel); border:1px solid var(--border); font-size:10px; color:var(--t3); margin:2px; }
        .blaze-summary { display:flex; gap:16px; margin-bottom:14px; }
        .blaze-summary-item { font-size:13px; color:var(--t2); }
        .blaze-summary-item strong { color:var(--t1); }
        .blaze-loading { display:flex; align-items:center; justify-content:center; min-height:200px; gap:8px; color:var(--t3); font-size:14px; }
        .blaze-spinner { width:16px; height:16px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin .6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="blaze-wrap">
        {/* Header */}
        <header className="blaze-header">
          <div className="blaze-logo">
            <div className="blaze-logo-icon">▸</div>
            <div>
              <div className="blaze-logo-name">BLAZE</div>
              <div className="blaze-logo-sub">
                {isZh ? '爆款复刻系统' : 'Viral Video Replication System'}
              </div>
            </div>
          </div>
          <div className="blaze-status">
            <span className="blaze-status-dot"></span>
            {isZh ? '3个模块已就绪' : '3 Modules Active'}
          </div>
        </header>

        <div className="blaze-grid">
          {/* Left: Control Panel */}
          <div>
            <div className="blaze-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`blaze-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="blaze-card">
                <div className="blaze-card-header">🔍 {t('blaze_search')}</div>
                <div className="blaze-card-body">
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">{isZh ? '关键词' : 'Keyword'}</label>
                    <input
                      className="blaze-input"
                      value={searchKw}
                      onChange={(e) => setSearchKw(e.target.value)}
                    />
                  </div>
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">{isZh ? '品类' : 'Category'}</label>
                    <input
                      className="blaze-input"
                      value={searchCat}
                      onChange={(e) => setSearchCat(e.target.value)}
                    />
                  </div>
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">{isZh ? '时间范围' : 'Days'}</label>
                    <select
                      className="blaze-select"
                      value={searchDays}
                      onChange={(e) => setSearchDays(Number(e.target.value))}
                    >
                      <option value={7}>7 {isZh ? '天' : 'days'}</option>
                      <option value={14}>14 {isZh ? '天' : 'days'}</option>
                      <option value={30}>30 {isZh ? '天' : 'days'}</option>
                    </select>
                  </div>
                  <button className="blaze-btn" onClick={handleSearch} disabled={loading}>
                    {loading ? '⏳...' : isZh ? '搜索' : 'Search'}
                  </button>
                </div>
              </div>
            )}

            {/* Analyze Tab */}
            {activeTab === 'analyze' && (
              <div className="blaze-card">
                <div className="blaze-card-header">📐 {t('blaze_analyze')}</div>
                <div className="blaze-card-body">
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">{isZh ? '视频ID' : 'Video ID'}</label>
                    <input
                      className="blaze-input"
                      value={analyzeVid}
                      onChange={(e) => setAnalyzeVid(e.target.value)}
                    />
                  </div>
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">{isZh ? '品牌' : 'Brand'}</label>
                    <input
                      className="blaze-input"
                      value={analyzeBrand}
                      onChange={(e) => setAnalyzeBrand(e.target.value)}
                    />
                  </div>
                  <button className="blaze-btn" onClick={handleAnalyze} disabled={loading}>
                    {loading ? '⏳...' : isZh ? '分析' : 'Analyze'}
                  </button>
                </div>
              </div>
            )}

            {/* KOC Tab */}
            {activeTab === 'koc' && (
              <div className="blaze-card">
                <div className="blaze-card-header">👥 {t('blaze_koc')}</div>
                <div className="blaze-card-body">
                  <div className="blaze-form-group">
                    <label className="blaze-form-label">
                      {isZh ? '竞品(逗号分隔)' : 'Competitors (comma-separated)'}
                    </label>
                    <input
                      className="blaze-input"
                      value={kocCompetitors}
                      onChange={(e) => setKocCompetitors(e.target.value)}
                    />
                  </div>
                  <button className="blaze-btn" onClick={handleKoc} disabled={loading}>
                    {loading ? '⏳...' : isZh ? '提取KOC' : 'Extract KOC'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Result Panel */}
          <div className="blaze-result">
            {loading && (
              <div className="blaze-loading">
                <div className="blaze-spinner"></div>
                {isZh ? '请求中...' : 'Loading...'}
              </div>
            )}

            {error && <div className="blaze-error">❌ {error}</div>}

            {!loading && !error && !result && (
              <div className="blaze-empty">
                <div className="blaze-empty-icon">▸</div>
                <div>
                  {isZh
                    ? '选择左侧模块开始操作...'
                    : 'Select a module on the left to start...'}
                </div>
              </div>
            )}

            {!loading && !error && result && isSearchResult(result) && (
              <div>
                <div className="blaze-summary">
                  <div className="blaze-summary-item">
                    <strong>{result.keyword || result.category}</strong>
                    {' · '}
                    {isZh ? '找到' : 'Found'} <strong>{result.total}</strong>{' '}
                    {isZh ? '个视频' : 'videos'}
                  </div>
                </div>
                <div className="blaze-video-list">
                  {result.videos.map((v, i) => (
                    <div key={v.id} className="blaze-video-card">
                      <div className="blaze-video-rank">{i + 1}</div>
                      <div className="blaze-video-info">
                        <div className="blaze-video-title">{v.title}</div>
                        <div className="blaze-video-meta">
                          {v.author} · {formatViews(v.views)}{isZh ? '播放' : ' views'} ·{' '}
                          {isZh ? '点赞' : 'likes'} {formatLikes(v.likes)} ·{' '}
                          {isZh ? '评分' : 'score'} {v.viral_score}
                        </div>
                      </div>
                      <div className="blaze-video-score">{v.viral_score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && result && isAnalyzeResult(result) && (
              <div>
                <div className="blaze-video-card" style={{ marginBottom: 14 }}>
                  <div className="blaze-video-info">
                    <div className="blaze-video-title">{result.video.title}</div>
                    <div className="blaze-video-meta">
                      {result.video.author} · {formatViews(result.video.views)}{' '}
                      {isZh ? '播放' : ' views'} · {isZh ? '评分' : 'score'}{' '}
                      {result.video.viral_score}
                    </div>
                  </div>
                </div>

                <div className="blaze-structure-card">
                  <div className="blaze-structure-label">
                    {isZh ? '脚本结构' : 'Script Structure'}
                  </div>
                  {Object.entries(result.script_structure).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                        {key}
                      </span>
                      <div className="blaze-structure-value" style={{ fontSize: 12 }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="blaze-structure-card">
                  <div className="blaze-structure-label">
                    {isZh ? '品牌映射' : 'Brand Mapping'}
                  </div>
                  <div className="blaze-brand-map">
                    {result.brand_mapping.map((m, i) => (
                      <div key={i} className="blaze-brand-row">
                        <span>{m.original}</span>
                        <span className="blaze-brand-arrow">→</span>
                        <span>{m.mapped}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="blaze-structure-card">
                  <div className="blaze-structure-label">
                    {isZh ? '可复用模板' : 'Reusable Template'}
                  </div>
                  <div className="blaze-structure-value" style={{ fontSize: 12 }}>
                    <div style={{ marginBottom: 4 }}>
                      <strong>{isZh ? '格式' : 'Format'}:</strong>{' '}
                      {result.reusable_template.format}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>{isZh ? '最佳时长' : 'Optimal Duration'}:</strong>{' '}
                      {result.reusable_template.optimal_duration}
                    </div>
                    <div>
                      <strong>{isZh ? '标签' : 'Tags'}:</strong>{' '}
                      {result.reusable_template.top_tags.map((t) => (
                        <span key={t} className="blaze-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && result && isKocResult(result) && (
              <div>
                <div className="blaze-summary">
                  <div className="blaze-summary-item">
                    {isZh ? '共找到' : 'Found'} <strong>{result.total}</strong>{' '}
                    {isZh ? '个KOC' : 'KOCs'} · {isZh ? '高优先级' : 'High priority'}:{' '}
                    <strong>{result.high_priority}</strong>
                  </div>
                </div>
                <table className="blaze-koc-table">
                  <thead>
                    <tr>
                      <th>{isZh ? '账号' : 'Username'}</th>
                      <th>{isZh ? '平台' : 'Platform'}</th>
                      <th>{isZh ? '粉丝' : 'Followers'}</th>
                      <th>{isZh ? '评分' : 'Score'}</th>
                      <th>{isZh ? '优先级' : 'Priority'}</th>
                      <th>{isZh ? '建议' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.koc_list.map((koc) => (
                      <tr key={koc.username}>
                        <td style={{ fontWeight: 500 }}>{koc.username}</td>
                        <td>{koc.platform === 'douyin' ? '抖音' : '小红书'}</td>
                        <td>{formatViews(koc.followers)}</td>
                        <td className="blaze-koc-score" style={{ color: 'var(--accent)' }}>
                          {koc.koc_score}
                        </td>
                        <td>
                          <span
                            className={
                              koc.contact_priority === '高'
                                ? 'blaze-priority-high'
                                : koc.contact_priority === '中'
                                  ? 'blaze-priority-mid'
                                  : 'blaze-priority-low'
                            }
                          >
                            {koc.contact_priority}
                          </span>
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--t3)' }}>
                          {koc.recommended_action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
