import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ── price — competitor price comparison ──
    if (action.length === 1 && action[0] === 'price') {
      const body = await request.json()
      const product: string = body.product || '通勤双肩包'
      const platforms: string[] = body.platforms || ['天猫', '京东', '拼多多', '抖音']

      const result = await deepseekJSON<{
        product: string
        scan_time: string
        results: { platform: string; price: number; our_price: number; competitor_lowest: number; position: string }[]
        recommendation: string
      }>(
        '你是电商价格策略分析师。请返回纯JSON。',
        `对产品 "${product}" 在各平台进行竞品价格对比。
平台: ${platforms.join(', ')}
每个平台需要: 平台名、竞品价格(price)、我方价格(our_price)、竞品最低价(competitor_lowest)、价格定位(position: "领先"/"持平"/"落后")
给出一个总体recommendation建议。

返回JSON结构必须严格如下:
{
  "product": "string",
  "scan_time": "ISO时间戳",
  "results": [{ "platform": "string", "price": 数字, "our_price": 数字, "competitor_lowest": 数字, "position": "string" }],
  "recommendation": "string"
}`
      )

      result.scan_time = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ── seo — SEO audit ──
    if (action.length === 1 && action[0] === 'seo') {
      const body = await request.json()
      const url: string = body.url || 'agentclaw.sale'

      const result = await deepseekJSON<{
        url: string
        score: number
        checks: {
          meta_tags: { status: string; detail: string }
          headings: { status: string; detail: string }
          images_alt: { status: string; detail: string }
          load_speed: { status: string; detail: string }
          mobile: { status: string; detail: string }
          schema: { status: string; detail: string }
          links: { status: string; detail: string }
        }
        recommendations: string[]
      }>(
        '你是SEO技术审计专家。请返回纯JSON。',
        `对网站 ${url} 进行SEO审计评分。
评估维度: meta_tags(标题+描述)、headings(H1-H3层级)、images_alt(图片alt标签)、load_speed(加载速度)、mobile(移动端适配)、schema(结构化数据)、links(内链)
每个维度状态: "good"(通过)或"warn"(需优化)，并附detail说明
给出3条优化建议recommendations
score为整体评分(0-100)

返回JSON结构必须严格如下:
{
  "url": "string",
  "score": 数字,
  "checks": {
    "meta_tags": { "status": "string", "detail": "string" },
    "headings": { "status": "string", "detail": "string" },
    "images_alt": { "status": "string", "detail": "string" },
    "load_speed": { "status": "string", "detail": "string" },
    "mobile": { "status": "string", "detail": "string" },
    "schema": { "status": "string", "detail": "string" },
    "links": { "status": "string", "detail": "string" }
  },
  "recommendations": ["string"]
}`
      )

      return NextResponse.json(result)
    }

    // ── strategy — pricing strategy recommendation ──
    if (action.length === 1 && action[0] === 'strategy') {
      const body = await request.json()
      const brand: string = body.brand || 'SAINT ANGELO'
      const category: string = body.category || '轻奢女包'

      const result = await deepseekJSON<{
        brand: string
        category: string
        current_price_range: string
        recommended_price: string
        competitor_benchmark: { brand: string; avg_price: number; position: string }[]
        suggestions: string[]
      }>(
        '你是品牌定价策略专家。请返回纯JSON。',
        `为品牌 "${brand}"（品类: ${category}）制定定价策略。
要求:
1. 当前价格区间 current_price_range (如"¥299 - ¥1299")
2. 推荐定价 recommended_price (如"¥699")
3. 竞品对标 competitor_benchmark (3个竞品, each with brand, avg_price, position)
4. 3条策略建议 suggestions

返回JSON结构必须严格如下:
{
  "brand": "string",
  "category": "string",
  "current_price_range": "string",
  "recommended_price": "string",
  "competitor_benchmark": [{ "brand": "string", "avg_price": 数字, "position": "string" }],
  "suggestions": ["string"]
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}
