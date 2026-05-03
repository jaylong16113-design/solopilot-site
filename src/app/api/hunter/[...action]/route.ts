import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON, apimartImageGeneration } from '@/lib/api-clients'

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

      const result = await deepseekJSON<{
        company: string
        total: number
        emails: { email: string; score: number; type: string; source?: string }[]
      }>(
        '你是企业邮箱挖掘专家。请返回纯JSON。',
        `为公司 "${companyName}" 寻找联系邮箱。
要求:
1. 返回3-5个与该公司相关的邮箱
2. 每个邮箱包含: email地址、可信度评分score(0-100)、type类型(如generic/personal/support)、source来源(如官网/领英/招聘页)
3. 按score从高到低排序

返回JSON结构严格如下:
{
  "company": "string",
  "total": 数字,
  "emails": [{ "email": "string", "score": 数字, "type": "string", "source": "string" }]
}`
      )

      return NextResponse.json(result)
    }

    // ─── price/search ───
    if (action.length === 2 && action[0] === 'price' && action[1] === 'search') {
      const body = await request.json()
      const product: string = body.product || ''
      const platforms: string[] = body.platforms || ['天猫', '京东', '拼多多']

      const result = await deepseekJSON<{
        product: string
        results: { platform: string; price: number; store: string; rating: number; sales: number }[]
        summary: { max_price: number; min_price: number; avg_price: number; best_platform: string }
      }>(
        '你是电商价格数据分析专家。请返回纯JSON。',
        `对产品 "${product}" 在各电商平台进行价格搜索对比。
平台: ${platforms.join(', ')}
每个平台返回一条结果: platform平台名、price价格、store店铺名、rating评分(4.0-5.0)、sales销量
summary: max_price最高价、min_price最低价、avg_price均价、best_platform最优平台(价格最低的平台)

返回JSON结构严格如下:
{
  "product": "string",
  "results": [{ "platform": "string", "price": 数字, "store": "string", "rating": 数字, "sales": 数字 }],
  "summary": { "max_price": 数字, "min_price": 数字, "avg_price": 数字, "best_platform": "string" }
}`
      )

      return NextResponse.json(result)
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

      const prompt = `${styles[imageType] || styles['product_display']}。产品: ${skuName}。卖点: ${sellingPoints.join('; ')}`

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
        engine_recommendation: 'stable-diffusion-xl (via APIMART)',
        image_url: imageUrl || null,
        face_consistency_required: false,
        note: imageUrl ? '图片已通过APIMART API生成。如需人物面部一致性，请提供参考图。' : 'AI生图请自行调用对应API。如需人物面部一致性，参考即梦解决方案飞书文档。',
      })
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
