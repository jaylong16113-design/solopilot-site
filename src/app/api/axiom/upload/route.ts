import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ detail: '未上传文件' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const text = new TextDecoder('utf-8').decode(bytes)
    const size = bytes.byteLength

    // 简单关键词提取
    const keywordBank: Record<string, string[]> = {
      '时尚穿搭': ['穿搭', '衣服', '西装', '裙子', '裤子', '时尚', '风格', '搭配'],
      '美妆护肤': ['美妆', '护肤', '化妆', '口红', '粉底', '面膜', '精华'],
      '数码3C': ['手机', '数码', '电脑', '耳机', '相机', '智能', '科技'],
      '运动健身': ['运动', '健身', '瑜伽', '跑步', '训练', '健康', '肌肉'],
      '旅游度假': ['旅游', '酒店', '旅行', '度假', '机票', '景点', '攻略'],
      '家居生活': ['家居', '家装', '家具', '收纳', '装修', '家电', '装饰'],
      '美食餐饮': ['美食', '餐饮', '食材', '烹饪', '菜谱', '餐厅', '零食'],
      '宠物': ['猫', '狗', '宠物', '喵', '汪', '宠物用品', '猫粮'],
    }

    const textLower = text.toLowerCase()
    const matched = new Set<string>()
    for (const [category, keywords] of Object.entries(keywordBank)) {
      if (keywords.some(kw => textLower.includes(kw))) {
        matched.add(category)
      }
    }

    const keywords = matched.size > 0 ? [...matched] : ['时尚穿搭', '数码3C', '运动健身']

    return NextResponse.json({
      filename: file.name,
      size,
      keywords,
      preview: text.slice(0, 500),
    })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || '文件分析失败' }, { status: 500 })
  }
}
