'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

export default function PulsePage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string>('')

  const callAPI = useCallback(async (endpoint: string, body: any) => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch(`/api/pulse/${endpoint}`, {
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
            <div className="size-9 rounded-lg bg-gradient-to-br from-[#f472b6] to-[#fb923c] grid place-items-center text-sm">📡</div>
            <div>
              <h1 className="text-base font-bold">PULSE</h1>
              <p className="text-[10px]" style={{color: '#8a8f98'}}>{isZh ? '数据脉冲看板' : 'Data Pulse Dashboard'}</p>
            </div>
          </div>
          <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
            style={{borderColor: 'rgba(255,255,255,0.08)', background: '#141518', color: '#8a8f98'}}>
            {isZh ? '🌐 EN' : '🌐 中文'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <button onClick={() => callAPI('dashboard', { platforms: ['抖音', '小红书', '天猫', '京东'] })}
            disabled={loading}
            className="rounded-xl p-5 border text-left transition-all cursor-pointer disabled:opacity-40"
            style={{borderColor: 'rgba(255,255,255,0.06)', background: '#141518'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f472b644'; e.currentTarget.style.background = '#191a1d' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#141518' }}>
            <span className="text-2xl mb-2 block">📊</span>
            <h3 className="text-sm font-semibold mb-1">{isZh ? '实时总览' : 'Live Dashboard'}</h3>
            <p className="text-xs" style={{color: '#8a8f98'}}>{isZh ? '四平台今日GMV+订单+流量' : '4-platform daily GMV, orders & traffic'}</p>
          </button>

          <button onClick={() => callAPI('weekly', {})}
            disabled={loading}
            className="rounded-xl p-5 border text-left transition-all cursor-pointer disabled:opacity-40"
            style={{borderColor: 'rgba(255,255,255,0.06)', background: '#141518'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fb923c44'; e.currentTarget.style.background = '#191a1d' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#141518' }}>
            <span className="text-2xl mb-2 block">📈</span>
            <h3 className="text-sm font-semibold mb-1">{isZh ? '周趋势' : 'Weekly Trend'}</h3>
            <p className="text-xs" style={{color: '#8a8f98'}}>{isZh ? '本周每日GMV与订单趋势' : 'Daily GMV & order trend this week'}</p>
          </button>
        </div>

        {/* Output */}
        <div className="rounded-xl border overflow-hidden" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0c0d0f'}}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
            <span className="text-[10px] font-mono" style={{color: '#5f636b'}}>
              {isZh ? '数据输出' : 'Data Output'}
            </span>
          </div>
          <pre className="p-4 text-xs leading-relaxed overflow-auto max-h-96 font-mono"
               style={{color: '#cfd2d8', whiteSpace: 'pre-wrap'}}>
            {loading ? '⏳ 加载中...' : (output || (isZh ? '点击上方按钮获取数据' : 'Click a button above to get data'))}
          </pre>
        </div>
      </div>
    </div>
  )
}
