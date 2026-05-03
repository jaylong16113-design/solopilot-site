'use client'

import { useI18n } from '@/lib/i18n/i18n'
import Link from 'next/link'

const tools = [
  {
    id: 'axiom',
    name: 'AXIOM',
    descZh: '社会推演引擎 — 300万人级数字孪生，模拟消费行为、情绪传染、口碑裂变',
    descEn: 'Social Simulation Engine — 3M digital twins for consumer behavior simulation',
    icon: '🧠',
    color: '#6ee7b7',
    status: 'ready' as const,
  },
  {
    id: 'forge',
    name: 'FORGE',
    descZh: '内容中台 — SKU→脚本→审核→分发→分析，9大模块全链路',
    descEn: 'Content Hub — 9 modules from SKU to distribution & analytics',
    icon: '⚒️',
    color: '#a78bfa',
    status: 'ready' as const,
  },
  {
    id: 'blaze',
    name: 'BLAZE',
    descZh: '爆款复刻 — 抖音爆款搜索→结构拆解→KOC提取→复刻模板',
    descEn: 'Viral Replication — Search, analyze, extract KOCs, replicate templates',
    icon: '🔥',
    color: '#f59e0b',
    status: 'ready' as const,
  },
  {
    id: 'hunter',
    name: 'HUNTER',
    descZh: '工具箱 — 邮箱查找+全网比价+AI生图Prompt',
    descEn: 'Toolkit — Email hunter, price radar, AI image prompts',
    icon: '🎯',
    color: '#60a5fa',
    status: 'ready' as const,
  },
  {
    id: 'mist',
    name: 'MIST',
    descZh: '情绪短视频 — Burberry级AI虚拟人设×情绪内容矩阵方案',
    descEn: 'Emotional Short Video — AI persona & emotional content strategy',
    icon: '🌧️',
    color: '#38bdf8',
    status: 'ready' as const,
  },
  {
    id: 'lens',
    name: 'LENS',
    descZh: '品牌情报雷达 — 竞品监控、声量追踪、KOL发现、趋势预警',
    descEn: 'Brand Intelligence — Competitor monitoring, trend alerts, KOL discovery',
    icon: '🔍',
    color: '#34d399',
    status: 'new' as const,
  },
  {
    id: 'pulse',
    name: 'PULSE',
    descZh: '数据脉冲 — 全平台销售/流量/转化实时看板',
    descEn: 'Data Pulse — Real-time dashboard for sales, traffic & conversion',
    icon: '📡',
    color: '#f472b6',
    status: 'new' as const,
  },
  {
    id: 'growth',
    name: 'Growth OS',
    descZh: '增长系统 — 定价策略+SEO审计+竞品定价监控+自动调价',
    descEn: 'Growth System — Pricing strategy, SEO audit, competitor price tracking',
    icon: '🌱',
    color: '#fb923c',
    status: 'new' as const,
  },
  {
    id: 'cascade',
    name: 'CASCADE',
    descZh: '内容管线 — AI生成→多平台分发→效果追踪→自动优化',
    descEn: 'Content Pipeline — Generate, distribute, track, optimize',
    icon: '⚡',
    color: '#e879f9',
    status: 'new' as const,
  },
]

export default function CompassPage() {
  const { locale, setLocale } = useI18n()
  const isZh = locale === 'zh'

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#6ee7b7] grid place-items-center text-lg font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-lg font-bold">COMPASS</h1>
              <p className="text-xs" style={{color: '#8a8f98'}}>
                {isZh ? 'AI 工具导航台' : 'AI Tool Navigation Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{borderColor: 'rgba(255,255,255,0.08)', background: '#141518', color: '#8a8f98', cursor: 'pointer'}}
          >
            {isZh ? '🌐 EN' : '🌐 中文'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            [tools.filter(t => t.status === 'ready').length, isZh ? '已上线' : 'Active', '#6ee7b7'],
            [tools.filter(t => t.status === 'new').length, isZh ? '新建' : 'New', '#a78bfa'],
            [tools.length, isZh ? '总计' : 'Total', '#f7f8f8'],
            [0, isZh ? '待修复' : 'Issues', '#f59e0b'],
          ].map(([val, label, color]) => (
            <div key={label as string} className="rounded-xl p-4 border" style={{borderColor: 'rgba(255,255,255,0.06)', background: '#0f1011'}}>
              <div className="text-2xl font-bold font-mono" style={{color: color as string}}>{val}</div>
              <div className="text-xs mt-1" style={{color: '#8a8f98'}}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="block rounded-xl p-5 border transition-all duration-200 no-underline"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: '#141518',
                color: '#f7f8f8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${tool.color}33`
                e.currentTarget.style.background = '#191a1d'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = '#141518'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{tool.name}</span>
                    {tool.status === 'new' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{background: `${tool.color}20`, color: tool.color}}>
                        {isZh ? '新' : 'NEW'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{color: '#8a8f98'}}>
                    {isZh ? tool.descZh : tool.descEn}
                  </p>
                </div>
                <span className="text-xs" style={{color: '#5f636b'}}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-xs" style={{borderColor: 'rgba(255,255,255,0.06)', color: '#5f636b'}}>
          {isZh
            ? 'AgentClaw 工具矩阵 · 2026 · 仅供内部演示使用'
            : 'AgentClaw Tool Matrix · 2026 · Internal Demo Only'}
        </div>
      </div>
    </div>
  )
}
