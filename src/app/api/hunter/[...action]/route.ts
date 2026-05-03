import { NextRequest, NextResponse } from 'next/server'

// ── Seeded random (consistent with blaze pattern) ──

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

// ── Sample data (ported from Python backend) ──

const SAMPLE_EMAILS: Record<string, { email: string; score: number; type: string; source?: string }[]> = {
  '字节跳动': [
    { email: 'hr@bytedance.com', score: 95, type: 'generic', source: '官网' },
    { email: 'marketing@bytedance.com', score: 88, type: 'generic', source: '领英' },
    { email: 'zhaopin@bytedance.com', score: 82, type: 'generic', source: '招聘页' },
  ],
  '阿里巴巴': [
    { email: 'hr@alibaba-inc.com', score: 92, type: 'generic', source: '官网' },
    { email: 'recruit@alibaba.com', score: 85, type: 'generic', source: '领英' },
  ],
  '腾讯': [
    { email: 'hr@tencent.com', score: 90, type: 'generic', source: '官网' },
    { email: 'campus@tencent.com', score: 78, type: 'generic', source: '招聘页' },
  ],
}

// ── String hash ported from Python ──

function hashStr(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
  }
  return Math.abs(hash % 2147483647)
}

// ── Route handler: GET ──

export async function GET(_request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []
  if (action.length === 1 && action[0] === 'health') {
    return NextResponse.json({ status: 'ok', service: 'HUNTER v1', modules: 3 })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

// ── Route handler: POST ──

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ─── health ───
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'HUNTER v1', modules: 3 })
    }

    // ─── hunter/search ───
    if (action.length === 2 && action[0] === 'hunter' && action[1] === 'search') {
      const body = await request.json()
      const company: string = body.company || ''
      const domain: string = body.domain || ''
      const companyName = company || (domain ? domain.split('.')[0] : '')

      const results = SAMPLE_EMAILS[companyName]
      if (results) {
        return NextResponse.json({
          company: companyName,
          total: results.length,
          emails: results,
        })
      }

      // Generate sample results for unknown company
      const seed = hashStr(companyName || 'default')
      const rng = seededRandom(seed)
      const score1 = randint(rng, 60, 85)
      const score2 = randint(rng, 55, 75)
      const generatedResults = [
        { email: `contact@${companyName.toLowerCase()}.com`, score: score1, type: 'generic' },
        { email: `hr@${companyName.toLowerCase()}.com`, score: score2, type: 'generic' },
      ]

      return NextResponse.json({
        company: companyName,
        total: generatedResults.length,
        emails: generatedResults,
      })
    }

    // ─── price/search ───
    if (action.length === 2 && action[0] === 'price' && action[1] === 'search') {
      const body = await request.json()
      const product: string = body.product || ''
      const platforms: string[] = body.platforms || ['天猫', '京东', '拼多多']

      const seed = hashStr(product || 'default-product')
      const rng = seededRandom(seed)

      const results = platforms.map((plat: string) => {
        const basePrice = randint(rng, 100, 50000)
        const storeName = rng() > 0.3 ? `${product.slice(0, 4)}官方旗舰店` : `${plat}优选店`
        return {
          platform: plat,
          price: basePrice + randint(rng, -5000, 5000),
          store: storeName,
          rating: Math.round(uniform(rng, 4.0, 5.0) * 10) / 10,
          sales: randint(rng, 100, 50000),
        }
      })

      const prices = results.map((r) => r.price)
      return NextResponse.json({
        product,
        results,
        summary: {
          max_price: Math.max(...prices),
          min_price: Math.min(...prices),
          avg_price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
          best_platform: results.reduce((best, curr) => (curr.price < best.price ? curr : best)).platform,
        },
      })
    }

    // ─── sa-image/generate ───
    if (action.length === 2 && action[0] === 'sa-image' && action[1] === 'generate') {
      const body = await request.json()
      const skuName: string = body.sku_name || ''
      const sellingPoints: string[] = body.selling_points || []
      const imageType: string = body.image_type || 'product_display'

      const styles: Record<string, string> = {
        product_display: '纯白背景电商产品展示图，平铺视角，产品居中，高清商业产品摄影',
        scene: '意式优雅生活方式场景，自然光，室内空间，高级感配色',
        social_media: '小红书风格生活方式图，暖色调，产品融入日常场景，ins风滤镜',
      }

      const prompt = styles[imageType] || styles['product_display']

      return NextResponse.json({
        sku_name: skuName,
        image_type: imageType,
        prompt: `${prompt}。产品: ${skuName}。卖点: ${sellingPoints.join('; ')}`,
        engine_recommendation: '即梦(Jimeng)/ComfyUI(SDXL)/Midjourney v6',
        face_consistency_required: false,
        note: 'AI生图请自行调用对应API。如需人物面部一致性，参考即梦解决方案飞书文档。',
      })
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
