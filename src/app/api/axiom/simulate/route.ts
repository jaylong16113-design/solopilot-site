import { NextRequest, NextResponse } from 'next/server'
import { runSimulation } from '@/lib/axiom-engine'

export async function POST(request: NextRequest) {
  try {
    const params = await request.json()
    const result = runSimulation(params)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || '模拟失败' }, { status: 500 })
  }
}
