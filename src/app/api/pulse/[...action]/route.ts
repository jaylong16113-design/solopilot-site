import { NextRequest, NextResponse } from 'next/server'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function randint(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function uniform(rng: () => number, min: number, max: number) {
  return rng() * (max - min) + min
}

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'PULSE v1' })
    }

    // ── dashboard — summary metrics ──
    if (action.length === 1 && action[0] === 'dashboard') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['抖音', '小红书', '天猫', '京东']
      const rng = seededRandom(Math.floor(Date.now() / 1800000)) // changes every 30min

      const metrics = platforms.map((p) => ({
        platform: p,
        gmv: randint(rng, 50000, 5000000),
        orders: randint(rng, 100, 5000),
        visitors: randint(rng, 5000, 200000),
        conversion: `${uniform(rng, 2, 8).toFixed(1)}%`,
        avg_order_value: randint(rng, 200, 2000),
        growth: `${randint(rng, -10, 40) > 0 ? '+' : ''}${randint(rng, -15, 45)}%`,
      }))

      return NextResponse.json({
        date: new Date().toISOString().split('T')[0],
        total_gmv: metrics.reduce((a, b) => a + b.gmv, 0),
        total_orders: metrics.reduce((a, b) => a + b.orders, 0),
        total_visitors: metrics.reduce((a, b) => a + b.visitors, 0),
        avg_conversion: `${(metrics.reduce((a, b) => a + parseFloat(b.conversion), 0) / metrics.length).toFixed(1)}%`,
        platforms: metrics,
        alerts: metrics
          .filter((m) => parseFloat(m.growth) < 0)
          .map((m) => `${m.platform} 数据下滑 ${m.growth}`),
      })
    }

    // ── weekly — weekly trend ──
    if (action.length === 1 && action[0] === 'weekly') {
      const rng = seededRandom(Math.floor(Date.now() / 86400000))
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const trend = days.map((day) => ({
        day,
        gmv: randint(rng, 100000, 800000),
        orders: randint(rng, 200, 3000),
      }))
      return NextResponse.json({ days: trend, total_gmv: trend.reduce((a, b) => a + b.gmv, 0) })
    }

    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
