'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

type Tab = 'scan' | 'kols' | 'report'

export default function LensPage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'
  const [tab, setTab] = useState<Tab>('scan')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [competitors, setCompetitors] = useState('Coach, Michael Kors, Furla')

  const callAPI = useCallback(async (endpoint: string, body: any) => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch(`/api/lens/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setOutput(`❌ ${isZh ? '错误' : 'Error'}: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [isZh])

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-[#34d399] to-[#a78bfa] grid place-items-center text-sm">🔍</div>
            <div>
              <h1 className="text-base font-bold">LENS</h1>
              <p className="text-[10px]" style={{color: '#8a8f98'}}>{isZh ? '品牌情报雷达' : 'Brand Intelligence Radar'}</p>
            </div>
          </div>
          <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
            style={{borderColor: 'rgba(255,255,255,0.08)', background: '#141518', color: '#8a8f98'}}>
            {isZh ? '🌐 EN' : '🌐 中文'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5">
          {([
            ['scan', isZh ? '竞品扫描' : 'Scan'],
            ['kols', isZh ? '达人发现' : 'KOLs'],
            ['report', isZh ? '情报报告' : 'Report'],
          ] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{
                background: tab === key ? '#1a1d24' : 'transparent',
                color: tab === key ? '#f7f8f8' : '#8a8f98',
                border: tab === key ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="rounded-xl p-4 mb-4 border" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0f1011'}}>
          {tab === 'scan' && (
            <div className="space-y-3">
              <label className="text-xs font-medium" style={{color: '#cfd2d8'}}>
                {isZh ? '竞品品牌（逗号分隔）' : 'Competitor Brands (comma-separated)'}
              </label>
              <input value={competitors} onChange={e => setCompetitors(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                style={{background: '#141518', borderColor: 'rgba(255,255,255,0.08)', color: '#f7f8f8'}} />
              <button onClick={() => callAPI('scan', { competitors: competitors.split(',').map(s => s.trim()), days: 7 })}
                disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
                style={{background: '#34d399', color: '#08090a'}}>
                {loading ? '⏳' : isZh ? '🔍 扫描竞品' : '🔍 Scan'}
              </button>
            </div>
          )}

          {tab === 'kols' && (
            <div className="space-y-3">
              <label className="text-xs font-medium" style={{color: '#cfd2d8'}}>
                {isZh ? '品牌/品类' : 'Brand / Category'}
              </label>
              <input defaultValue="Coach" id="kol_brand"
                className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                style={{background: '#141518', borderColor: 'rgba(255,255,255,0.08)', color: '#f7f8f8'}} />
              <button onClick={() => {
                const brand = (document.getElementById('kol_brand') as HTMLInputElement)?.value || 'Coach'
                callAPI('kols', { brand, category: '轻奢女包' })
              }} disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
                style={{background: '#34d399', color: '#08090a'}}>
                {loading ? '⏳' : isZh ? '🔍 发现达人' : '🔍 Find KOLs'}
              </button>
            </div>
          )}

          {tab === 'report' && (
            <div className="space-y-3">
              <p className="text-xs" style={{color: '#8a8f98'}}>
                {isZh ? '生成今日品牌情报摘要报告' : 'Generate today\'s brand intelligence summary'}
              </p>
              <button onClick={() => callAPI('report', { brands: competitors.split(',').map(s => s.trim()) })}
                disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-40"
                style={{background: '#34d399', color: '#08090a'}}>
                {loading ? '⏳' : isZh ? '📊 生成报告' : '📊 Generate Report'}
              </button>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="rounded-xl border overflow-hidden" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0c0d0f'}}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
            <span className="text-[10px] font-mono" style={{color: '#5f636b'}}>
              {isZh ? '输出结果' : 'Output'}
            </span>
            {output && (
              <button onClick={() => setOutput('')}
                className="text-[10px] px-2 py-0.5 rounded cursor-pointer"
                style={{background: '#141518', color: '#8a8f98', border: '1px solid rgba(255,255,255,0.06)'}}>
                ✕
              </button>
            )}
          </div>
          <pre className="p-4 text-xs leading-relaxed overflow-auto max-h-96 font-mono"
               style={{color: '#cfd2d8', whiteSpace: 'pre-wrap'}}>
            {output || (isZh ? '选择上方功能开始使用' : 'Select a function above to start')}
          </pre>
        </div>
      </div>
    </div>
  )
}
