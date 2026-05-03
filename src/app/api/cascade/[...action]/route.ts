import { NextRequest, NextResponse } from 'next/server'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function randint(r: () => number, a: number, b: number) { return Math.floor(r() * (b - a + 1)) + a }

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ── plan — generate content plan ──
    if (action.length === 1 && action[0] === 'plan') {
      const body = await request.json()
      const topic: string = body.topic || '通勤穿搭'
      const rng = seededRandom(Math.floor(Date.now() / 86400000))
      return NextResponse.json({
        topic,
        plan: Array.from({ length: 7 }, (_, i) => ({
          day: `Day ${i + 1}`,
          platform: ['抖音', '小红书', 'B站', '视频号'][randint(rng, 0, 3)],
          format: ['短视频(15s)', '图文笔记', '短视频(60s)', '直播预告'][randint(rng, 0, 3)],
          angle: [`${topic}${['入门指南', '误区解析', '进阶技巧', '场景搭配', '性价比对比', '季节推荐', '品牌推荐'][randint(rng, 0, 6)]}`],
        })),
      })
    }

    // ── track — content performance tracking ──
    if (action.length === 1 && action[0] === 'track') {
      const body = await request.json()
      const contentId: string = body.content_id || 'C001'
      const rng = seededRandom(hashStr(contentId))
      return NextResponse.json({
        content_id: contentId,
        views: randint(rng, 5000, 200000),
        engagement: `${(rng() * 12 + 2).toFixed(1)}%`,
        shares: randint(rng, 50, 5000),
        saves: randint(rng, 100, 8000),
        click_rate: `${(rng() * 8 + 1).toFixed(1)}%`,
        conversion: `${(rng() * 3 + 0.5).toFixed(1)}%`,
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}

function hashStr(s: string): number {
  let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h % 2147483647)
}
