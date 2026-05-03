import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest) {
  try {
    const { url, product_name } = await request.json()

    const result = await deepseekJSON<{
      keywords: string[]
      interest_tags: string[]
      target_audience: string
      content_type: string
      estimated_buzz: number
      matched_categories: string[]
    }>(
      '你是电商链接分析专家。分析URL和产品名称，提取兴趣标签和关键词。返回纯JSON。',
      `分析以下链接和产品，提取兴趣标签和关键词：
URL: ${url || '未知'}
产品名称: ${product_name || '未知'}

请分析：
1. keywords: 5个核心关键词
2. interest_tags: 相关兴趣标签（如：时尚穿搭、数码3C、美妆护肤、运动健身、旅游度假等）
3. target_audience: 目标受众描述
4. content_type: 内容类型
5. estimated_buzz: 预估热度（1-100）
6. matched_categories: 匹配的品类标签`,
      { temperature: 0.3 }
    )

    return NextResponse.json({
      url,
      product_name: product_name || '',
      keywords: result.keywords || [],
      interest_tags: result.interest_tags || [],
      target_audience: result.target_audience || '',
      content_type: result.content_type || '',
      estimated_buzz: result.estimated_buzz || 50,
      matched_categories: result.matched_categories || [],
      extracted: true,
    })
  } catch (e: any) {
    // Fallback to basic keyword extraction
    const keywords = ['时尚穿搭', '数码3C', '美妆护肤', '运动健身', '旅游度假']
    const matched: string[] = []
    const urlLower = (e.url || '').toLowerCase()
    if (/fashion|穿搭|style|衣服|品牌/.test(urlLower)) matched.push('时尚穿搭')
    if (/tech|数码|手机|3c|apple|小米/.test(urlLower)) matched.push('数码3C')
    if (/beauty|美妆|护肤|化妆/.test(urlLower)) matched.push('美妆护肤')
    if (/sport|运动|健身|瑜伽/.test(urlLower)) matched.push('运动健身')
    if (/travel|旅游|酒店|度假/.test(urlLower)) matched.push('旅游度假')
    if (matched.length === 0) matched.push(...keywords.slice(0, 3))

    return NextResponse.json({
      url: '',
      product_name: '',
      keywords: matched,
      extracted: true,
    })
  }
}
