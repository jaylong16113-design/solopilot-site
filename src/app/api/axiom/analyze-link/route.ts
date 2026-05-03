import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url, product_name } = await request.json()
    
    // 模拟链接分析 - 用URL的关键词提取兴趣标签
    const keywords = ['时尚穿搭', '数码3C', '美妆护肤', '运动健身', '旅游度假']
    const matched: string[] = []
    
    const urlLower = url.toLowerCase()
    if (/fashion|穿搭|style|衣服|品牌/.test(urlLower)) matched.push('时尚穿搭')
    if (/tech|数码|手机|3c|apple|小米/.test(urlLower)) matched.push('数码3C')
    if (/beauty|美妆|护肤|化妆/.test(urlLower)) matched.push('美妆护肤')
    if (/sport|运动|健身|瑜伽/.test(urlLower)) matched.push('运动健身')
    if (/travel|旅游|酒店|度假/.test(urlLower)) matched.push('旅游度假')
    
    if (matched.length === 0) {
      matched.push(...keywords.slice(0, 3))
    }

    return NextResponse.json({
      url,
      product_name: product_name || '',
      keywords: matched,
      extracted: true,
    })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || '分析失败' }, { status: 500 })
  }
}
