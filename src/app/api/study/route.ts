import { NextRequest, NextResponse } from 'next/server'
import { deepseekChat, deepseekJSON } from '@/lib/api-clients'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

export async function GET() {
  // Simple GET: fallback with basic daily learning (same structure as POST output)
  const topics = ['AI电商', '男装穿搭', '一人公司', '内容营销']
  const rng = seededRandom(Math.floor(Date.now() / 86400000))
  const lessons = topics.map((topic) => ({
    title: `${topic}学习笔记`,
    category: '综合',
    key_insight: `【${topic}】今日核心要点：关注行业最新动态，实操关键方法论。`,
    source: '每日学习',
    difficulty: '入门',
    related_concepts: ['基础概念', '实操方法'],
  }))
  return NextResponse.json({
    date: new Date().toISOString().split('T')[0],
    lessons,
    total: lessons.length,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const topics: string[] = body.topics || ['AI电商', '男装穿搭', '一人公司', '内容营销']
  const category: string | undefined = body.category // optional filter
  const difficulty: string | undefined = body.difficulty // optional filter

  try {
    // Build filter description for the prompt
    const filterParts: string[] = []
    if (category) filterParts.push(`分类: ${category}`)
    if (difficulty) filterParts.push(`难度: ${difficulty}`)
    const filterDesc = filterParts.length > 0 ? `\n过滤条件: ${filterParts.join(', ')}` : ''

    const result = await deepseekJSON<{
      date: string
      lessons: {
        title: string
        category: string
        key_insight: string
        source: string
        difficulty: string
        related_concepts: string[]
      }[]
      topics: string[]
      total: number
      filters?: { category?: string; difficulty?: string }
    }>(
      '你是每日学习内容生成器。为每个话题生成结构化学习内容。请返回纯JSON。',
      `话题: ${topics.join(', ')}${filterDesc}

为每个话题生成一条学习内容，包含:
- title: 学习标题
- category: 分类（AI电商/男装穿搭/一人公司/内容营销 或其它）
- key_insight: 核心知识点摘要（1-2个，100字以内）
- source: 来源建议（如"深度好文推荐"）
- difficulty: 难度级别（入门/进阶/高级）
- related_concepts: 相关概念数组（2-3个）

返回JSON结构必须严格如下:
{
  "date": "YYYY-MM-DD",
  "lessons": [
    { "title": "string", "category": "string", "key_insight": "string", "source": "string", "difficulty": "string", "related_concepts": ["string"] }
  ],
  "topics": ["string"],
  "total": 数字
}`
    )

    result.date = new Date().toISOString().split('T')[0]
    const response: any = {
      date: result.date,
      lessons: result.lessons,
      topics: result.topics,
      total: result.total,
    }
    if (category || difficulty) {
      response.filters = {}
      if (category) response.filters.category = category
      if (difficulty) response.filters.difficulty = difficulty
    }
    return NextResponse.json(response)
  } catch (e: any) {
    // Fallback to mock on error
    const rng = seededRandom(Math.floor(Date.now() / 86400000))
    const fallbackLessons = topics.map((topic: string) => ({
      title: `${topic}学习笔记`,
      category: category || '综合',
      key_insight: `【${topic}】今日学习要点：\n1. 关注行业最新动态\n2. 实操关键方法论\n3. 今日行动项：整理笔记并实践`,
      source: '每日学习',
      difficulty: difficulty || '入门',
      related_concepts: ['基础概念', '实操方法'],
    }))
    const response: any = {
      date: new Date().toISOString().split('T')[0],
      lessons: fallbackLessons,
      topics,
      total: fallbackLessons.length,
    }
    if (category || difficulty) {
      response.filters = {}
      if (category) response.filters.category = category
      if (difficulty) response.filters.difficulty = difficulty
    }
    return NextResponse.json(response)
  }
}
