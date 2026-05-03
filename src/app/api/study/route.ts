import { NextRequest, NextResponse } from 'next/server'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const topics: string[] = body.topics || ['AI电商', '男装穿搭', '一人公司', '内容营销']
  const rng = seededRandom(Math.floor(Date.now() / 86400000))

  const lessons = topics.map((topic) => ({
    topic,
    title: `${topic}${['核心方法论', '实战案例', '最新趋势', '工具推荐', '避坑指南'][Math.floor(rng() * 5)]}`,
    summary: `${topic}领域今日精选内容，3分钟掌握一个关键认知。`,
    reading_time: `${Math.floor(rng() * 8 + 3)}分钟`,
    key_points: Array.from({ length: 3 }, () => 
      ['核心概念', '实操步骤', '数据洞察', '案例分析', '工具推荐'][Math.floor(rng() * 5)]
    ),
    difficulty: ['入门', '进阶', '高级'][Math.floor(rng() * 3)],
  }))

  return NextResponse.json({
    date: new Date().toISOString().split('T')[0],
    total_lessons: lessons.length,
    lessons,
    recommendation: `今日重点：${lessons[0].title}`,
  })
}
