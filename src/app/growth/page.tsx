'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

type Tab = 'price' | 'seo' | 'strategy'

export default function GrowthPage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'
  const [tab, setTab] = useState<Tab>('price')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string>('')

  const callAPI = useCallback(async (endpoint: string, body: any) => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch(`/api/growth/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      setOutput(JSON.stringify(await res.json(), null, 2))
    } catch (e: any) {
      setOutput(`❌ ${isZh ? '错误' : 'Error'}: ${e.message}`)
    } finally { setLoading(false) }
  }, [isZh])

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-[#fb923c] to-[#f59e0b] grid place-items-center text-sm">🌱</div>
            <div>
              <h1 className="text-base font-bold">Growth OS</h1>
              <p className="text-[10px]" style={{color: '#8a8f98'}}>{isZh ? '增长操作系统' : 'Growth Operating System'}</p>
            </div>
          </div>
          <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
            style={{borderColor: 'rgba(255,255,255,0.08)', background: '#141518', color: '#8a8f98'}}>
            {isZh ? '🌐 EN' : '🌐 中文'}
          </button>
        </div>

        <div className="flex gap-1 mb-5">
          {([
            ['price', isZh ? '比价监控' : 'Price Watch'],
            ['seo', 'SEO Audit'],
            ['strategy', isZh ? '定价策略' : 'Strategy'],
          ] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{background: tab === key ? '#1a1d24' : 'transparent', color: tab === key ? '#f7f8f8' : '#8a8f98',
                border: tab === key ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent'}}>
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-xl p-4 mb-4 border" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0f1011'}}>
          {tab === 'price' && (
            <div className="space-y-3">
              <input defaultValue="通勤双肩包" id="g_product"
                className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                style={{background: '#141518', borderColor: 'rgba(255,255,255,0.08)', color: '#f7f8f8'}} />
              <button onClick={() => callAPI('price', { product: (document.getElementById('g_product') as HTMLInputElement)?.value })}
                disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
                style={{background: '#fb923c', color: '#08090a'}}>
                {loading ? '⏳' : isZh ? '💰 扫描比价' : '💰 Scan Prices'}
              </button>
            </div>
          )}
          {tab === 'seo' && (
            <button onClick={() => callAPI('seo', { url: 'agentclaw.sale' })}
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
              style={{background: '#fb923c', color: '#08090a'}}>
              {loading ? '⏳' : isZh ? '🔎 运行SEO审计' : '🔎 Run SEO Audit'}
            </button>
          )}
          {tab === 'strategy' && (
            <button onClick={() => callAPI('strategy', { brand: 'SAINT ANGELO', category: '轻奢女包' })}
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
              style={{background: '#fb923c', color: '#08090a'}}>
              {loading ? '⏳' : isZh ? '📊 生成定价策略' : '📊 Generate Strategy'}
            </button>
          )}
        </div>

        <div className="rounded-xl border overflow-hidden" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0c0d0f'}}>
          <div className="px-4 py-2 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
            <span className="text-[10px] font-mono" style={{color: '#5f636b'}}>{isZh ? '输出' : 'Output'}</span>
          </div>
          <pre className="p-4 text-xs leading-relaxed overflow-auto max-h-96 font-mono" style={{color: '#cfd2d8', whiteSpace: 'pre-wrap'}}>
            {loading ? '⏳ 加载中...' : (output || (isZh ? '选择上方功能开始' : 'Select a function above'))}
          </pre>
        </div>
      </div>
    </div>
  )
}
