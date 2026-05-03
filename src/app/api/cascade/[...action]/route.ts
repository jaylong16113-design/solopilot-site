import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ── plan — generate content plan ──
    if (action.length === 1 && action[0] === 'plan') {
      const body = await request.json()
      const topic: string = body.topic || '通勤穿搭'

      const result = await deepseekJSON<{
        topic: string
        plan: {
          day: string
          platform: string
          format: string
          angle: string[]
          estimated_reach: number
          best_posting_time: string
        }[]
      }>(
        '你是社交媒体内容策划专家。请返回纯JSON。',
        `为主题 "${topic}" 生成7天内容发布计划。
每天安排: day(Day 1到Day 7)、platform(抖音/小红书/B站/视频号/快手/微博)、format(短视频(15s)/图文笔记/短视频(60s)/直播预告/中视频(3min)/图文教程)、angle(内容角度数组，如["通勤穿搭入门指南","配色技巧"])、estimated_reach(预估曝光量，整数)、best_posting_time(最佳发布时间，如"12:00")

返回JSON结构必须严格如下:
{
  "topic": "string",
  "plan": [{ "day": "string", "platform": "string", "format": "string", "angle": ["string"], "estimated_reach": 0, "best_posting_time": "string" }]
}`
      )

      return NextResponse.json(result)
    }

    // ── track — content performance tracking ──
    if (action.length === 1 && action[0] === 'track') {
      const body = await request.json()
      const contentId: string = body.content_id || 'C001'

      const result = await deepseekJSON<{
        content_id: string
        views: number
        engagement: string
        shares: number
        saves: number
        click_rate: string
        conversion: string
        avg_watch_time: string
        completion_rate: string
        comment_sentiment: string
      }>(
        '你是内容运营数据分析师。请返回纯JSON。',
        `为内容ID "${contentId}" 生成内容效果追踪数据。
要求: views(播放量)、engagement(互动率如"5.2%")、shares(分享数)、saves(收藏数)、click_rate(点击率如"3.1%")、conversion(转化率如"1.8%")、avg_watch_time(平均观看时长如"45s")、completion_rate(完播率如"32.5%")、comment_sentiment(评论情感倾向如"正面"/"中性"/"负面")

返回JSON结构必须严格如下:
{
  "content_id": "string",
  "views": 数字,
  "engagement": "string",
  "shares": 数字,
  "saves": 数字,
  "click_rate": "string",
  "conversion": "string",
  "avg_watch_time": "string",
  "completion_rate": "string",
  "comment_sentiment": "string"
}`
      )

      return NextResponse.json(result)
    }

    // ── optimize — content optimization suggestions ──
    if (action.length === 1 && action[0] === 'optimize') {
      const body = await request.json()
      const contentId: string = body.content_id || 'C001'
      const performance: Record<string, number> = body.performance || {}

      const result = await deepseekJSON<{
        content_id: string
        suggestions: {
          dimension: string
          current_value: string
          suggestion: string
          expected_improvement: string
          priority: 'high' | 'medium' | 'low'
        }[]
      }>(
        '你是内容优化策略专家。请返回纯JSON。',
        `为内容ID "${contentId}" 生成优化建议。
当前性能指标: ${JSON.stringify(performance)}

请分析各维度表现，输出3-5条具体优化建议。
每条建议包括: dimension(优化维度如"标题"/"封面"/"开场"/"节奏"/"CTA")、current_value(当前表现简述)、suggestion(具体优化建议)、expected_improvement(预期提升效果如"预计完播率提升15%")、priority(优先级: high/medium/low)

返回JSON结构必须严格如下:
{
  "content_id": "string",
  "suggestions": [
    { "dimension": "string", "current_value": "string", "suggestion": "string", "expected_improvement": "string", "priority": "high|medium|low" }
  ]
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}
