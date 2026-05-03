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
    // ── price — competitor price comparison ──
    if (action.length === 1 && action[0] === 'price') {
      const body = await request.json()
      const product: string = body.product || '通勤双肩包'
      const platforms: string[] = body.platforms || ['天猫', '京东', '拼多多', '抖音']
      const rng = seededRandom(Math.floor(Date.now() / 3600000))

      const results = platforms.map((p) => ({
        platform: p,
        price: randint(rng, 199, 3999),
        our_price: randint(rng, 199, 3999),
        competitor_lowest: randint(rng, 150, 3500),
        position: pick(rng, ['领先', '持平', '落后']),
      }))

      return NextResponse.json({
        product,
        scan_time: new Date().toISOString(),
        results,
        recommendation: '建议关注拼多多价位下探趋势，适当调整分销价格管控',
      })
    }

    // ── seo — SEO audit ──
    if (action.length === 1 && action[0] === 'seo') {
      const body = await request.json()
      const url: string = body.url || 'agentclaw.sale'
      const rng = seededRandom(Math.floor(Date.now() / 86400000))

      return NextResponse.json({
        url,
        score: randint(rng, 50, 85),
        checks: {
          meta_tags: { status: 'good', detail: '标题+描述完整' },
          headings: { status: randint(rng, 0, 1) ? 'good' : 'warn', detail: 'H1-H3层级完整' },
          images_alt: { status: randint(rng, 0, 1) ? 'good' : 'warn', detail: `缺失${randint(rng, 3, 12)}个alt` },
          load_speed: { status: randint(rng, 0, 1) ? 'good' : 'warn', detail: `${uniform(rng, 1, 4).toFixed(1)}s` },
          mobile: { status: 'good', detail: '响应式适配' },
          schema: { status: randint(rng, 0, 1) ? 'good' : 'warn', detail: '缺少Article Schema' },
          links: { status: 'good', detail: `${randint(rng, 5, 30)}内链` },
        },
        recommendations: [
          '添加Article JSON-LD结构化数据',
          '优化文章图片alt标签',
          '增加内链交叉引用',
        ],
      })
    }

    // ── strategy — pricing strategy recommendation ──
    if (action.length === 1 && action[0] === 'strategy') {
      const body = await request.json()
      const brand: string = body.brand || 'SAINT ANGELO'
      const category: string = body.category || '轻奢女包'
      const rng = seededRandom(Math.floor(Date.now() / 86400000))

      return NextResponse.json({
        brand,
        category,
        current_price_range: `¥${randint(rng, 199, 999)} - ¥${randint(rng, 1000, 4999)}`,
        recommended_price: `¥${randint(rng, 299, 3999)}`,
        competitor_benchmark: [
          { brand: 'Coach', avg_price: randint(rng, 1500, 4000), position: '高端' },
          { brand: 'Michael Kors', avg_price: randint(rng, 800, 3000), position: '中高端' },
          { brand: 'Furla', avg_price: randint(rng, 1000, 3500), position: '中端' },
        ],
        suggestions: [
          '建议主推价格带¥599-1299，避开Coach直竞争区',
          '推出入门款引流（¥299-399），吸引价格敏感用户',
          '高端款做品牌调性（¥1999+），限量发售拉升品牌价值',
        ],
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}
