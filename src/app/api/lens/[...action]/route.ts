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

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

const BRANDS = ['Coach', 'Michael Kors', 'Furla', 'Tory Burch', 'Longchamp', 'Pinko', 'APC', 'Polene']

const PLATFORMS = ['抖音', '小红书', '微博', 'B站']

const PERSONAS = ['白领通勤', '时尚博主', '学生党', '职场精英', '精致妈妈', '潮流青年']

const TRENDS = [
  { topic: '通勤大包回归', growth: '+43%', platform: '小红书' },
  { topic: '轻奢平替', growth: '+38%', platform: '抖音' },
  { topic: '皮质手工包', growth: '+52%', platform: '小红书' },
  { topic: 'Mini包叠背', growth: '+27%', platform: 'B站' },
  { topic: '老花复兴', growth: '+35%', platform: '微博' },
]

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'LENS v1' })
    }

    // ── scan — brand monitoring scan ──
    if (action.length === 1 && action[0] === 'scan') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['Coach', 'Michael Kors']
      const days: number = body.days || 7
      const seedStr = JSON.stringify(competitors) + days
      let hash = 0
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
      }
      const rng = seededRandom(Math.abs(hash))

      const mentions = competitors.map((brand) => ({
        brand,
        mentions: randint(rng, 50, 500),
        sentiment: Math.round(uniform(rng, 3.0, 5.0) * 10) / 10,
        top_platform: pick(rng, PLATFORMS),
        growth: `${randint(rng, -5, 30) > 0 ? '+' : ''}${randint(rng, -15, 40)}%`,
        top_posts: Array.from({ length: 3 }, (_, i) => ({
          title: `${brand}${pick(rng, ['新款测评', '穿搭合集', '性价比分析', '种草日记', '开箱视频'])}`,
          platform: pick(rng, PLATFORMS),
          engagement: `${uniform(rng, 2, 15).toFixed(1)}%`,
          url: '#',
        })),
      }))

      return NextResponse.json({
        scan_time: new Date().toISOString(),
        competitors,
        days,
        total_mentions: mentions.reduce((a, b) => a + b.mentions, 0),
        mentions,
        trends: TRENDS,
        alerts: [
          'Coach 小红书声量上升28%，主要依靠通勤包测评内容',
          'Michael Kors 抖音投放减少，需关注是否策略调整',
          `话题「轻奢平替」增长38%，建议跟进内容策略`,
        ],
      })
    }

    // ── kols — discover KOLs for brand ──
    if (action.length === 1 && action[0] === 'kols') {
      const body = await request.json()
      const brand: string = body.brand || 'Coach'
      const category: string = body.category || '轻奢女包'
      const seedStr = brand + category
      let hash = 0
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
      }
      const rng = seededRandom(Math.abs(hash))

      const kols = Array.from({ length: 10 }, (_, i) => ({
        name: `${['时尚', '穿搭', '品质', '精致', '都市'][randint(rng, 0, 4)]}${['小A', '的日常', '日记', '范', '说', '控', '指南', '笔记', '分享', '推荐'][randint(rng, 0, 9)]}`,
        platform: pick(rng, PLATFORMS),
        followers: `${randint(rng, 1, 50)}万`,
        engagement: `${uniform(rng, 3, 18).toFixed(1)}%`,
        match_score: randint(rng, 60, 98),
        reason: pick(rng, ['内容高度垂直', '互动率高', '粉丝画像匹配', '近期增长快', '品牌合作经验丰富']),
      })).sort((a, b) => b.match_score - a.match_score)

      return NextResponse.json({
        brand,
        category,
        total: kols.length,
        avg_match: Math.round(kols.reduce((a, b) => a + b.match_score, 0) / kols.length),
        kols,
      })
    }

    // ── report — generate daily intelligence report ──
    if (action.length === 1 && action[0] === 'report') {
      const body = await request.json()
      const brands: string[] = body.brands || ['Coach', 'Michael Kors', 'Furla']
      const rng = seededRandom(Math.floor(Date.now() / 3600000))

      return NextResponse.json({
        date: new Date().toISOString().split('T')[0],
        summary: {
          total_mentions: randint(rng, 300, 2000),
          avg_sentiment: `${uniform(rng, 3.5, 4.5).toFixed(1)}/5`,
          hot_topic: pick(rng, TRENDS).topic,
          alert_count: randint(rng, 1, 4),
        },
        brand_comparison: brands.map((b) => ({
          brand: b,
          share_of_voice: `${uniform(rng, 10, 40).toFixed(0)}%`,
          sentiment: `${uniform(rng, 3.0, 5.0).toFixed(1)}`,
          trend: pick(rng, ['上升', '平稳', '下降']),
        })),
        recommendations: [
          '建议增加小红书「通勤穿搭」类内容投放',
          '竞品Coach在抖音的KOL合作频繁，可考虑定向挖角',
          '「皮质手工包」话题增长52%，建议抢占内容先机',
        ],
      })
    }

    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
