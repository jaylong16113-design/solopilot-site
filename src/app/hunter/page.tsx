'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

// ── Types ──

interface EmailResult {
  company: string
  total: number
  emails: { email: string; score: number; type: string; source?: string }[]
}

interface PriceItem {
  platform: string
  price: number
  store: string
  rating: number
  sales: number
}

interface PriceResult {
  product: string
  results: PriceItem[]
  summary: {
    max_price: number
    min_price: number
    avg_price: number
    best_platform: string
  }
}

interface SAImageResult {
  sku_name: string
  image_type: string
  prompt: string
  engine_recommendation: string
  face_consistency_required: boolean
  note: string
}

type Result = EmailResult | PriceResult | SAImageResult | null

// ── Helpers ──

function formatPrice(n: number): string {
  return '¥' + n.toLocaleString()
}

function isEmailResult(r: any): r is EmailResult {
  return r && 'emails' in r
}

function isPriceResult(r: any): r is PriceResult {
  return r && 'summary' in r
}

function isSAImageResult(r: any): r is SAImageResult {
  return r && 'prompt' in r
}

// ── Page Component ──

export default function HunterPage() {
  const { locale, t } = useI18n()
  const isZh = locale === 'zh'

  type Module = 'hunter' | 'price' | 'sa'
  const [activeModule, setActiveModule] = useState<Module>('hunter')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [error, setError] = useState('')

  // Email Hunter form
  const [company, setCompany] = useState('字节跳动')
  const [domain, setDomain] = useState('')

  // Price Radar form
  const [productName, setProductName] = useState('iPhone 16 Pro Max')
  const [platformsStr, setPlatformsStr] = useState('天猫,京东,拼多多')

  // SA Image form
  const [skuName, setSkuName] = useState('圣安杰罗·米兰系列双肩包')
  const [sellingPointsStr, setSellingPointsStr] = useState('头层意大利进口牛皮,纯手工缝制,防水涂层')
  const [imageType, setImageType] = useState('product_display')

  const callApi = useCallback(
    async (endpoint: string, body: any) => {
      setLoading(true)
      setError('')
      setResult(null)
      try {
        const res = await fetch(`/api/hunter/${endpoint}`, {
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

  const handleEmailSearch = () => {
    callApi('hunter/search', { company, domain })
  }

  const handlePriceSearch = () => {
    const platforms = platformsStr.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    callApi('price/search', { product: productName, platforms })
  }

  const handleImageGenerate = () => {
    const sellingPoints = sellingPointsStr.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    callApi('sa-image/generate', { sku_name: skuName, selling_points: sellingPoints, image_type: imageType })
  }

  const modules: { key: Module; icon: string; label: string }[] = [
    { key: 'hunter', icon: '📧', label: t('hunter_email') },
    { key: 'price', icon: '💰', label: t('hunter_price') },
    { key: 'sa', icon: '🖼️', label: t('hunter_sa_image') },
  ]

  return (
    <div>
      <style>{`
        :root {
          --void:#08090a; --abyss:#0c0d0f; --deep:#0f1011; --panel:#141518; --panel-hover:#191a1d;
          --border:rgba(255,255,255,0.06); --border-s:rgba(255,255,255,0.08);
          --t1:#f7f8f8; --t2:#cfd2d8; --t3:#8a8f98; --t4:#5f636b;
          --accent:#06b6d4; --accent-hover:#0891b2; --accent-glow:rgba(6,182,212,0.15);
          --green:#27a644;
          --font:'Inter',system-ui,-apple-system,sans-serif; --mono:'JetBrains Mono',monospace;
          --rad-sm:4px; --rad-md:6px; --rad-lg:8px; --rad-xl:12px; --rad-pill:9999px;
        }
        .hunter-wrap {
          max-width:1440px; margin:0 auto; padding:0 32px;
          font-family:var(--font); background:var(--void); color:var(--t1);
          min-height:100vh; position:relative; z-index:1;
        }
        @media(max-width:640px){ .hunter-wrap{ padding:0 16px; } }
        .hunter-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 0; border-bottom:1px solid var(--border);
        }
        .hunter-logo { display:flex; align-items:center; gap:12px; }
        .hunter-logo-icon {
          width:38px; height:38px; border-radius:var(--rad-lg);
          background:linear-gradient(135deg,var(--accent),var(--accent-hover));
          display:grid; place-items:center; font-size:18px; color:#fff;
        }
        .hunter-logo-name { font-size:18px; font-weight:600; letter-spacing:-0.03em; }
        .hunter-logo-sub {
          font-size:10px; font-weight:500; color:var(--t4);
          text-transform:uppercase; letter-spacing:0.08em; font-family:var(--mono);
        }
        .hunter-status {
          display:flex; align-items:center; gap:7px; padding:4px 12px;
          border-radius:var(--rad-pill); background:var(--deep); border:1px solid var(--border);
          font-size:12px; font-weight:500; color:var(--t3);
        }
        .hunter-status-dot {
          width:6px; height:6px; border-radius:50%; background:var(--green);
          box-shadow:0 0 6px rgba(39,166,68,0.4);
        }
        .hunter-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; padding:20px 0 64px; }
        @media(max-width:1024px){ .hunter-grid{ grid-template-columns:1fr; } }
        .hunter-card {
          background:var(--deep); border:1px solid var(--border);
          border-radius:var(--rad-xl); overflow:hidden;
          transition:border-color .15s;
        }
        .hunter-card.active { border-color:var(--accent); }
        .hunter-card-header {
          display:flex; align-items:center; gap:10px;
          padding:16px 20px; border-bottom:1px solid var(--border);
          font-size:15px; font-weight:600; color:var(--t1); cursor:pointer;
          transition:background .15s;
        }
        .hunter-card-header:hover { background:var(--panel); }
        .hunter-card-body { padding:18px; }
        .hunter-form-group { margin-bottom:14px; }
        .hunter-form-group:last-child { margin-bottom:0; }
        .hunter-form-label {
          display:block; font-size:11px; font-weight:600; color:var(--t4);
          text-transform:uppercase; letter-spacing:0.05em; margin-bottom:5px;
        }
        .hunter-input {
          width:100%; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:9px 12px; color:var(--t1);
          font-size:13px; font-family:var(--font); outline:none;
          transition:border-color .15s;
        }
        .hunter-input:focus { border-color:var(--accent); }
        .hunter-select {
          width:100%; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:9px 12px; color:var(--t1);
          font-size:13px; font-family:var(--font); outline:none; cursor:pointer;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8f98' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 10px center; padding-right:28px;
        }
        .hunter-select:focus { border-color:var(--accent); }
        .hunter-btn {
          width:100%; padding:10px 18px; border:none;
          border-radius:var(--rad-md); font-size:13px; font-weight:600;
          font-family:var(--font); cursor:pointer; transition:all .15s;
          background:var(--accent); color:#fff;
        }
        .hunter-btn:hover { background:var(--accent-hover); box-shadow:0 0 20px var(--accent-glow); transform:translateY(-1px); }
        .hunter-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }

        /* Result Panel */
        .hunter-result {
          background:var(--deep); border:1px solid var(--border);
          border-radius:var(--rad-xl); padding:20px; margin-top:20px;
          min-height:200px; overflow-x:auto;
        }
        .hunter-result-header {
          font-size:13px; font-weight:600; color:var(--t2);
          margin-bottom:12px; padding-bottom:10px;
          border-bottom:1px solid var(--border);
        }
        .hunter-result pre {
          font-family:var(--mono); font-size:12px; color:var(--t2);
          white-space:pre-wrap; word-break:break-word; line-height:1.6;
        }
        .hunter-empty {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          min-height:200px; text-align:center; color:var(--t4); font-size:14px; gap:12px;
        }
        .hunter-empty-icon { font-size:40px; opacity:0.4; }
        .hunter-error {
          padding:12px 16px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
          border-radius:var(--rad-md); color:#ef4444; font-size:13px;
        }
        .hunter-loading { display:flex; align-items:center; justify-content:center; min-height:200px; gap:8px; color:var(--t3); font-size:14px; }
        .hunter-spinner { width:16px; height:16px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin .6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Structured Result Display */
        .hunter-email-table { width:100%; font-size:12px; margin-top:8px; }
        .hunter-email-table th, .hunter-email-table td { padding:8px 12px; text-align:left; border-bottom:1px solid var(--border); }
        .hunter-email-table th { font-size:11px; font-weight:600; color:var(--t4); text-transform:uppercase; letter-spacing:0.05em; background:var(--abyss); }
        .hunter-email-table td { color:var(--t2); }
        .hunter-score { font-weight:600; font-family:var(--mono); }
        .hunter-score-high { color:var(--green); }
        .hunter-score-mid { color:#f59e0b; }
        .hunter-score-low { color:var(--t4); }
        .hunter-summary { display:flex; gap:16px; margin-bottom:14px; flex-wrap:wrap; }
        .hunter-summary-item { font-size:13px; color:var(--t2); }
        .hunter-summary-item strong { color:var(--t1); }
        .hunter-price-list { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
        .hunter-price-card {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md);
        }
        .hunter-price-card.best { border-color:var(--accent); }
        .hunter-price-platform { font-size:13px; font-weight:600; color:var(--t1); min-width:60px; }
        .hunter-price-info { flex:1; min-width:0; }
        .hunter-price-value { font-size:16px; font-weight:700; color:var(--accent); font-family:var(--mono); }
        .hunter-price-meta { font-size:11px; color:var(--t3); margin-top:2px; }
        .hunter-prompt-box {
          background:var(--abyss); border:1px solid var(--border);
          border-radius:var(--rad-md); padding:14px; margin-top:8px;
        }
        .hunter-prompt-text {
          font-size:14px; color:var(--t1); line-height:1.6;
        }
        .hunter-prompt-meta {
          font-size:11px; color:var(--t3); margin-top:8px;
        }
        .hunter-tag {
          display:inline-block; padding:2px 6px; border-radius:var(--rad-sm);
          background:var(--panel); border:1px solid var(--border);
          font-size:10px; color:var(--t3); margin:2px;
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="hunter-wrap">
        {/* Header */}
        <header className="hunter-header">
          <div className="hunter-logo">
            <div className="hunter-logo-icon">⌁</div>
            <div>
              <div className="hunter-logo-name">HUNTER</div>
              <div className="hunter-logo-sub">
                {isZh ? '邮箱查找 · 全网比价 · SA生图' : 'Email Hunter · Price Radar · SA Image'}
              </div>
            </div>
          </div>
          <div className="hunter-status">
            <span className="hunter-status-dot"></span>
            {isZh ? '3个模块已就绪' : '3 Modules Active'}
          </div>
        </header>

        {/* Module Cards Grid */}
        <div className="hunter-grid">
          {/* Email Hunter Card */}
          <div className={`hunter-card ${activeModule === 'hunter' ? 'active' : ''}`}>
            <div className="hunter-card-header" onClick={() => setActiveModule('hunter')}>
              📧 {t('hunter_email')}
            </div>
            <div className="hunter-card-body">
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '公司名' : 'Company'}</label>
                <input className="hunter-input" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '域名（可选）' : 'Domain (optional)'}</label>
                <input className="hunter-input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="bytedance.com" />
              </div>
              <button className="hunter-btn" onClick={handleEmailSearch} disabled={loading}>
                {loading && activeModule === 'hunter' ? '⏳...' : isZh ? '查找' : 'Search'}
              </button>
            </div>
          </div>

          {/* Price Radar Card */}
          <div className={`hunter-card ${activeModule === 'price' ? 'active' : ''}`}>
            <div className="hunter-card-header" onClick={() => setActiveModule('price')}>
              💰 {t('hunter_price')}
            </div>
            <div className="hunter-card-body">
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '商品名' : 'Product'}</label>
                <input className="hunter-input" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '平台（逗号分隔）' : 'Platforms (comma-separated)'}</label>
                <input className="hunter-input" value={platformsStr} onChange={(e) => setPlatformsStr(e.target.value)} />
              </div>
              <button className="hunter-btn" onClick={handlePriceSearch} disabled={loading}>
                {loading && activeModule === 'price' ? '⏳...' : isZh ? '比价' : 'Compare'}
              </button>
            </div>
          </div>

          {/* SA Image Generator Card */}
          <div className={`hunter-card ${activeModule === 'sa' ? 'active' : ''}`}>
            <div className="hunter-card-header" onClick={() => setActiveModule('sa')}>
              🖼️ {t('hunter_sa_image')}
            </div>
            <div className="hunter-card-body">
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? 'SKU名称' : 'SKU Name'}</label>
                <input className="hunter-input" value={skuName} onChange={(e) => setSkuName(e.target.value)} />
              </div>
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '卖点（逗号分隔）' : 'Selling Points (comma-separated)'}</label>
                <input className="hunter-input" value={sellingPointsStr} onChange={(e) => setSellingPointsStr(e.target.value)} />
              </div>
              <div className="hunter-form-group">
                <label className="hunter-form-label">{isZh ? '图片类型' : 'Image Type'}</label>
                <select className="hunter-select" value={imageType} onChange={(e) => setImageType(e.target.value)}>
                  <option value="product_display">{isZh ? '产品展示' : 'Product Display'}</option>
                  <option value="scene">{isZh ? '场景图' : 'Scene'}</option>
                  <option value="social_media">{isZh ? '社交媒体' : 'Social Media'}</option>
                </select>
              </div>
              <button className="hunter-btn" onClick={handleImageGenerate} disabled={loading}>
                {loading && activeModule === 'sa' ? '⏳...' : isZh ? '生成Prompt' : 'Generate Prompt'}
              </button>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="hunter-result">
          {loading && (
            <div className="hunter-loading">
              <div className="hunter-spinner"></div>
              {isZh ? '请求中...' : 'Loading...'}
            </div>
          )}

          {error && <div className="hunter-error">❌ {error}</div>}

          {!loading && !error && !result && (
            <div className="hunter-empty">
              <div className="hunter-empty-icon">⌁</div>
              <div>
                {isZh ? '选择一个模块开始操作...' : 'Select a module above to start...'}
              </div>
            </div>
          )}

          {!loading && !error && result && isEmailResult(result) && (
            <div>
              <div className="hunter-result-header">
                📧 {t('hunter_email')}
              </div>
              <div className="hunter-summary">
                <div className="hunter-summary-item">
                  <strong>{result.company}</strong>
                  {' · '}
                  {isZh ? '找到' : 'Found'} <strong>{result.total}</strong> {isZh ? '个邮箱' : 'emails'}
                </div>
              </div>
              <table className="hunter-email-table">
                <thead>
                  <tr>
                    <th>{isZh ? '邮箱' : 'Email'}</th>
                    <th>{isZh ? '可信度' : 'Score'}</th>
                    <th>{isZh ? '类型' : 'Type'}</th>
                    {result.emails[0]?.source && <th>{isZh ? '来源' : 'Source'}</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.emails.map((e, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--t1)' }}>{e.email}</td>
                      <td>
                        <span className={`hunter-score ${e.score >= 85 ? 'hunter-score-high' : e.score >= 70 ? 'hunter-score-mid' : 'hunter-score-low'}`}>
                          {e.score}
                        </span>
                      </td>
                      <td style={{ color: 'var(--t3)' }}>{e.type}</td>
                      {e.source && <td style={{ color: 'var(--t3)' }}>{e.source}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && result && isPriceResult(result) && (
            <div>
              <div className="hunter-result-header">
                💰 {t('hunter_price')} — {result.product}
              </div>
              <div className="hunter-summary">
                <div className="hunter-summary-item">
                  {isZh ? '最低' : 'Min'} <strong>{formatPrice(result.summary.min_price)}</strong> · {result.summary.best_platform}
                </div>
                <div className="hunter-summary-item">
                  {isZh ? '平均' : 'Avg'} <strong>{formatPrice(result.summary.avg_price)}</strong>
                </div>
                <div className="hunter-summary-item">
                  {isZh ? '最高' : 'Max'} <strong>{formatPrice(result.summary.max_price)}</strong>
                </div>
              </div>
              <div className="hunter-price-list">
                {result.results.map((item, i) => {
                  const isBest = item.platform === result.summary.best_platform
                  return (
                    <div key={i} className={`hunter-price-card ${isBest ? 'best' : ''}`}>
                      <div className="hunter-price-platform">{item.platform}</div>
                      <div className="hunter-price-info">
                        <div className="hunter-price-value">{formatPrice(item.price)}</div>
                        <div className="hunter-price-meta">
                          {item.store} · ⭐ {item.rating} · {isZh ? '销量' : 'Sales'} {item.sales.toLocaleString()}
                        </div>
                      </div>
                      {isBest && <span style={{ fontSize: '10px', color: 'var(--green)', fontWeight: 600 }}>BEST</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!loading && !error && result && isSAImageResult(result) && (
            <div>
              <div className="hunter-result-header">
                🖼️ {t('hunter_sa_image')} — {result.sku_name}
              </div>
              <div className="hunter-prompt-box">
                <div className="hunter-prompt-text">{result.prompt}</div>
              </div>
              <div className="hunter-prompt-meta">
                <span className="hunter-tag">{result.engine_recommendation}</span>
                <span className="hunter-tag">{result.image_type}</span>
                {result.face_consistency_required && <span className="hunter-tag" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>Face Consistency</span>}
              </div>
              {result.note && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--t3)', padding: '8px 12px', background: 'var(--abyss)', borderRadius: 'var(--rad-md)', border: '1px solid var(--border)' }}>
                  📌 {result.note}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
