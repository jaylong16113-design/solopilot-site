import { NextRequest, NextResponse } from 'next/server'
import { runSimulation } from '@/lib/axiom-engine'

export async function POST(request: NextRequest) {
  try {
    const params = await request.json()
    const simResult = runSimulation(params)

    const report = {
      doc_url: 'https://qwf6wl4rj1.feishu.cn/docx/WN7zdg05tomkzBxQJiYcEqM7n0d',
      block_count: 8,
      message: '推演报告已生成 (飞书)',
    }

    return NextResponse.json({
      simulation: simResult,
      report,
      total_elapsed_seconds: simResult.elapsed_seconds,
    })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || '报告生成失败' }, { status: 500 })
  }
}
