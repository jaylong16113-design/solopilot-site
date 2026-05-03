'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n/i18n'

export default function StudyPage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string>('')

  const callAPI = useCallback(async () => {
    setLoading(true); setOutput('')
    try {
      const r = await fetch('/api/study', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      setOutput(JSON.stringify(await r.json(), null, 2))
    } catch (e: any) { setOutput(`❌ ${e.message}`) }
    finally { setLoading(false) }
  }, [])

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] grid place-items-center text-2xl mx-auto mb-4">📚</div>
        <h1 className="text-xl font-bold mb-2">{isZh ? '每日学习' : 'Daily Learning'}</h1>
        <p className="text-sm mb-8" style={{color: '#8a8f98'}}>
          {isZh ? 'AI电商 · 男装穿搭 · 一人公司 · 内容营销 — 每天3分钟掌握一个关键认知' : 'AI E-commerce · Style · Solo Ops · Content — 3 min daily insight'}
        </p>

        <button onClick={callAPI} disabled={loading}
          className="px-8 py-3 rounded-xl text-sm font-semibold border-0 cursor-pointer disabled:opacity-40 transition-all hover:scale-105"
          style={{background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', color: '#fff'}}>
          {loading ? '⏳ 生成中...' : (isZh ? '📖 开始今日学习' : '📖 Start Today\'s Learning')}
        </button>

        {output && (
          <div className="mt-8 rounded-xl border overflow-hidden text-left" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0c0d0f'}}>
            <pre className="p-4 text-xs leading-relaxed overflow-auto max-h-[500px] font-mono" style={{color: '#cfd2d8', whiteSpace: 'pre-wrap'}}>{output}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
