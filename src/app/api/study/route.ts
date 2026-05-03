import { NextRequest, NextResponse } from 'next/server'
import { deepseekChat } from '@/lib/api-clients'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const topics: string[] = body.topics || ['AI电商', '男装穿搭', '一人公司', '内容营销']

  try {
    const lessons = await Promise.all(topics.map(async (topic) => {
      const content = await deepseekChat([
        { role: 'system', content: '你是一个每日学习内容生成器。为每个话题生成当日学习内容，包括：核心知识点（1-2个）、实操建议、今日行动项。语言简洁、干货为主，200字以内。' },
        { role: 'user', content: `话题：${topic}。生成今日学习内容。` }
      ], { temperature: 0.5, max_tokens: 500 })

      return { topic, content: content.trim() }
    }))

    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      lessons,
      topics,
      total: lessons.length
    })
  } catch (e: any) {
    // Fallback to mock on error
    const rng = seededRandom(Math.floor(Date.now() / 86400000))
    const fallbackLessons = topics.map((topic: string) => ({
      topic,
      content: `【${topic}】今日学习要点：\n1. 关注行业最新动态\n2. 实操关键方法论\n3. 今日行动项：整理笔记并实践`
    }))
    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      lessons: fallbackLessons,
      topics,
      total: fallbackLessons.length
    })
  }
}
