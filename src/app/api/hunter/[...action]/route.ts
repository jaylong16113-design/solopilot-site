import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON, apimartImageGeneration } from '@/lib/api-clients'

// ── Route handler: GET ──

export async function GET(_request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []
  if (action.length === 1 && action[0] === 'health') {
    return NextResponse.json({ status: 'ok', service: 'HUNTER v2', modules: 3 })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

// ── Route handler: POST ──

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ─── health ───
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'HUNTER v2', modules: 3 })
    }

    // ════════════════════════════════════════════════
    // Module 1: hunter/search — 企业邮箱挖掘
    // 技能: email-hunter 详细模板
    // ════════════════════════════════════════════════
    if (action.length === 2 && action[0] === 'hunter' && action[1] === 'search') {
      const body = await request.json()
      const company: string = body.company || ''
      const domain: string = body.domain || ''
      const companyName = company || (domain ? domain.split('.')[0] : '')

      const result = await deepseekJSON<{
        company: string
        total: number
        emails: { email: string; score: number; type: string; source: string }[]
      }>(
        '你是一位资深企业邮箱挖掘专家（email-hunter技能引擎）。你擅长通过企业名称和域名推断联系人邮箱。请只返回纯JSON，不要markdown代码块。',
        `为公司 "${companyName}" 执行邮箱挖掘任务。

【输入参数】
- 公司名: ${companyName}
- 域名: ${domain || '未提供，自动推断'}

【挖掘要求】
1. 返回 3-5 个与该公司高度相关的联系邮箱
2. 每个邮箱必须包含以下字段：
   - email: 推测的有效邮箱地址（使用常用模式如 firstname@company.com, info@company.com, support@company.com）
   - score: 可信度评分 (0-100整数)，基于邮箱格式合理性、角色常见程度、行业通用模式打分
   - type: 邮箱类型，取值之一 →
     * "personal" （个人邮箱，如 ceo@ / founder@）
     * "generic" （通用邮箱，如 info@ / contact@）
     * "support" （客服邮箱，如 support@ / help@）
     * "sales" （销售邮箱，如 sales@ / biz@）
     * "hr" （人力资源，如 hr@ / careers@）
     * "media" （媒体/公关，如 pr@ / media@）
     * "tech" （技术，如 dev@ / engineering@）
   - source: 来源推断，取值之一 →
     * "官网" （官网常见联系方式）
     * "领英" （领英公司资料推断）
     * "招聘页" （招聘信息中提取）
     * "行业目录" （行业企业名录）
     * "社交媒体" （社交媒体账号推断）
     * "Whois查询" （域名注册信息）
3. 按 score 从高到低严格排序

【返回JSON结构严格如下】
{
  "company": "${companyName}",
  "total": 邮箱数量（数字）,
  "emails": [
    {
      "email": "contact@example.com",
      "score": 85,
      "type": "generic",
      "source": "官网"
    }
  ]
}`
      )

      return NextResponse.json(result)
    }

    // ════════════════════════════════════════════════
    // Module 2: price/search — 全网比价
    // 技能: price-radar 详细模板
    // ════════════════════════════════════════════════
    if (action.length === 2 && action[0] === 'price' && action[1] === 'search') {
      const body = await request.json()
      const product: string = body.product || ''
      const platforms: string[] = body.platforms || ['天猫', '京东', '拼多多']

      const result = await deepseekJSON<{
        product: string
        results: {
          platform: string
          price: number
          store: string
          rating: number
          sales: number
          discount_rate: number
        }[]
        summary: {
          max_price: number
          min_price: number
          avg_price: number
          best_platform: string
          max_discount: number
          avg_discount: number
        }
        price_distribution: {
          labels: string[]
          values: number[]
        }
      }>(
        '你是一位电商价格雷达专家（price-radar技能引擎）。你擅长全网比价、价格分析和折扣计算。请只返回纯JSON，不要markdown代码块。',
        `对产品 "${product}" 进行全网价格雷达扫描。

【输入参数】
- 产品: ${product}
- 目标平台: ${platforms.join(', ')}

【分析要求】
1. 在每个平台返回一条最具代表性的结果，包含：
   - platform: 平台名称
   - price: 当前售价（数字，人民币元）
   - store: 店铺名称
   - rating: 店铺评分（4.0-5.0之间，保留1位小数）
   - sales: 月销量（整数）
   - discount_rate: 折扣率（百分比数字，如 15 表示85折，即优惠了15%；原价的15%折扣）

2. 汇总统计 (summary):
   - max_price: 所有平台中的最高价
   - min_price: 所有平台中的最低价
   - avg_price: 所有平台的平均价（保留1位小数）
   - best_platform: 性价比最优的平台（综合价格最低的平台名）
   - max_discount: 最大折扣率
   - avg_discount: 平均折扣率（保留1位小数）

3. 价格分布图表数据 (price_distribution):
   - labels: 平台名称数组（与results中platform顺序一致）
   - values: 对应价格数组（与results中price顺序一致）

【返回JSON结构严格如下】
{
  "product": "${product}",
  "results": [
    {
      "platform": "天猫",
      "price": 299.0,
      "store": "品牌旗舰店",
      "rating": 4.8,
      "sales": 15230,
      "discount_rate": 15
    }
  ],
  "summary": {
    "max_price": 399.0,
    "min_price": 259.0,
    "avg_price": 319.0,
    "best_platform": "拼多多",
    "max_discount": 25,
    "avg_discount": 18.3
  },
  "price_distribution": {
    "labels": ["天猫", "京东", "拼多多"],
    "values": [299.0, 359.0, 259.0]
  }
}`
      )

      return NextResponse.json(result)
    }

    // ════════════════════════════════════════════════
    // Module 3: sa-image/generate — AI生图Prompt生成
    // 技能: 生图大师 (SA Image)
    // ════════════════════════════════════════════════
    if (action.length === 2 && action[0] === 'sa-image' && action[1] === 'generate') {
      const body = await request.json()
      const skuName: string = body.sku_name || ''
      const sellingPoints: string[] = body.selling_points || []
      const imageType: string = body.image_type || 'product_display'
      const preferredEngine: string = body.preferred_engine || 'auto'

      const styles: Record<string, string> = {
        product_display: '纯白背景电商产品展示图，平铺视角，产品居中，高清商业产品摄影',
        scene: '意式优雅生活方式场景，自然光，室内空间，高级感配色',
        social_media: '小红书风格生活方式图，暖色调，产品融入日常场景，ins风滤镜',
      }

      const prompt = `${styles[imageType] || styles['product_display']}。产品: ${skuName}。卖点: ${sellingPoints.join('; ')}`

      // ── 引擎推荐逻辑 ──
      const recommendEngine = (type: string, points: string[]): { engine: string; reason: string } => {
        const hasPortrait = points.some(p => /人物|美女|模特|人像|face|portrait|girl|woman/i.test(p))
        if (hasPortrait || type === 'social_media') {
          return {
            engine: 'Midjourney',
            reason: 'Midjourney在人像和风格化生活场景方面表现最佳，面部一致性可通过垫图+--iw参数控制',
          }
        }
        if (type === 'product_display') {
          return {
            engine: 'DALL-E 3',
            reason: 'DALL-E 3对商业产品摄影、光影和文字渲染表现出色，最适合产品白底图',
          }
        }
        return {
          engine: 'Stable Diffusion XL',
          reason: 'SD XL可控性最强，搭配ControlNet和LoRA可实现精准图像控制',
        }
      }

      const engineRec = preferredEngine === 'auto'
        ? recommendEngine(imageType, sellingPoints)
        : { engine: preferredEngine, reason: '用户指定引擎' }

      // ── APIMART 生图（可选） ──
      let imageUrl = ''
      try {
        const imageResult = await apimartImageGeneration({
          model: 'stable-diffusion-xl',
          prompt,
          size: '1024x1024',
          n: 1,
        })
        imageUrl = imageResult.data?.[0]?.url || ''
      } catch {
        // If image generation fails, still return the prompt info
      }

      return NextResponse.json({
        sku_name: skuName,
        image_type: imageType,
        prompt,
        engine_recommendation: {
          engine: engineRec.engine,
          reason: engineRec.reason,
          alternatives: ['Midjourney', 'DALL-E 3', 'Stable Diffusion XL'],
        },
        face_consistency_required: sellingPoints.some(p => /人物|美女|模特|人像|face|portrait|girl|woman/i.test(p)),
        image_url: imageUrl || null,
        note: imageUrl
          ? '图片已通过APIMART API生成。如需人物面部一致性，请提供参考图并选用Midjourney垫图功能。'
          : 'AI生图请自行调用对应API。如需人物面部一致性，参考即梦解决方案飞书文档或使用Midjourney --cref参数。',
      })
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
