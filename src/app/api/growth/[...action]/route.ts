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
      const our_price: number = body.our_price ?? 199

      const result = await deepseekJSON<{
        product: string
        scan_time: string
        results: { platform: string; price: number; our_price: number; competitor_lowest: number; position: string }[]
        price_positioning: string
        price_history_trend: string
        recommendation: string
      }>(
        '你是电商价格策略分析师。请返回纯JSON。',
        `对产品 "${product}" 在各平台进行竞品价格对比。
平台: ${platforms.join(', ')}
我方定价: ¥${our_price}
每个平台需要: 平台名、竞品价格(price)、我方价格(our_price)、竞品最低价(competitor_lowest)、价格定位(position: "领先"/"持平"/"落后")
额外输出:
- price_positioning: 总体价格定位分析(领先/持平/落后及其原因)
- price_history_trend: 该品类近期价格走势分析
给出一个总体recommendation建议。

返回JSON结构必须严格如下:
{
  "product": "string",
  "scan_time": "ISO时间戳",
  "results": [{ "platform": "string", "price": 数字, "our_price": 数字, "competitor_lowest": 数字, "position": "string" }],
  "price_positioning": "string",
  "price_history_trend": "string",
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
          meta_tags: { status: string; detail: string; suggestion: string }
          headings: { status: string; detail: string; suggestion: string }
          images_alt: { status: string; detail: string; suggestion: string }
          load_speed: { status: string; detail: string; suggestion: string }
          mobile: { status: string; detail: string; suggestion: string }
          schema: { status: string; detail: string; suggestion: string }
          links: { status: string; detail: string; suggestion: string }
          content_quality: { status: string; detail: string; suggestion: string }
          keyword_density: { status: string; detail: string; suggestion: string }
        }
        recommendations: string[]
        actionable_recommendations: string[]
      }>(
        '你是SEO技术审计专家。请返回纯JSON。',
        `对网站 ${url} 进行SEO审计评分。
评估维度:
- meta_tags(标题+描述): status("good"/"warn"/"fail") + detail + suggestion
- headings(H1-H3层级): status("good"/"warn"/"fail") + detail + suggestion
- images_alt(图片alt标签): status("good"/"warn"/"fail") + detail + suggestion
- load_speed(加载速度): status("good"/"warn"/"fail") + detail + suggestion
- mobile(移动端适配): status("good"/"warn"/"fail") + detail + suggestion
- schema(结构化数据): status("good"/"warn"/"fail") + detail + suggestion
- links(内链): status("good"/"warn"/"fail") + detail + suggestion
- content_quality(内容质量): status("good"/"warn"/"fail") + detail + suggestion
- keyword_density(关键词密度): status("good"/"warn"/"fail") + detail + suggestion
score为整体评分(0-100)
给出3条优化建议recommendations
额外给出3-5条可直接执行的可操作建议actionable_recommendations

返回JSON结构必须严格如下:
{
  "url": "string",
  "score": 数字,
  "checks": {
    "meta_tags": { "status": "string", "detail": "string", "suggestion": "string" },
    "headings": { "status": "string", "detail": "string", "suggestion": "string" },
    "images_alt": { "status": "string", "detail": "string", "suggestion": "string" },
    "load_speed": { "status": "string", "detail": "string", "suggestion": "string" },
    "mobile": { "status": "string", "detail": "string", "suggestion": "string" },
    "schema": { "status": "string", "detail": "string", "suggestion": "string" },
    "links": { "status": "string", "detail": "string", "suggestion": "string" },
    "content_quality": { "status": "string", "detail": "string", "suggestion": "string" },
    "keyword_density": { "status": "string", "detail": "string", "suggestion": "string" }
  },
  "recommendations": ["string"],
  "actionable_recommendations": ["string"]
}`
      )

      return NextResponse.json(result)
    }

    // ── strategy — pricing strategy recommendation ──
    if (action.length === 1 && action[0] === 'strategy') {
      const body = await request.json()
      const product: string = body.product || '通勤双肩包'
      const cost_price: number = body.cost_price ?? 100
      const market_position: string = body.market_position || '中端'
      const competitors: { name: string; price: number }[] = body.competitors || [
        { name: '竞品A', price: 199 },
        { name: '竞品B', price: 259 },
        { name: '竞品C', price: 169 },
      ]

      const result = await deepseekJSON<{
        product: string
        recommended_price: number
        strategy_type: string
        price_range: { min: number; max: number }
        reasoning: string
      }>(
        '你是定价策略专家。请返回纯JSON。',
        `为产品 "${product}" 制定定价策略。
成本价: ¥${cost_price}
市场定位: ${market_position}
竞品信息:
${competitors.map((c) => `  - ${c.name}: ¥${c.price}`).join('\n')}

要求:
1. 推荐定价 recommended_price (数字)
2. 策略类型 strategy_type: "渗透定价" / "撇脂定价" / "动态定价"
3. 价格区间 price_range: { min: 数字, max: 数字 }
4. 推理 reasoning: 说明选择该策略的原因

返回JSON结构必须严格如下:
{
  "product": "string",
  "recommended_price": 数字,
  "strategy_type": "string",
  "price_range": { "min": 数字, "max": 数字 },
  "reasoning": "string"
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}
