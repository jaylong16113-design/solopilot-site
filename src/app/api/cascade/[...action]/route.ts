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
        plan: { day: string; platform: string; format: string; angle: string }[]
      }>(
        '你是社交媒体内容策划专家。请返回纯JSON。',
        `为主题 "${topic}" 生成7天内容发布计划。
每天安排: day(Day 1到Day 7)、platform(抖音/小红书/B站/视频号)、format(短视频(15s)/图文笔记/短视频(60s)/直播预告)、angle(内容角度，如"通勤穿搭入门指南")

返回JSON结构必须严格如下:
{
  "topic": "string",
  "plan": [{ "day": "string", "platform": "string", "format": "string", "angle": ["string"] }]
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
      }>(
        '你是内容运营数据分析师。请返回纯JSON。',
        `为内容ID "${contentId}" 生成内容效果追踪数据。
要求: views(播放量)、engagement(互动率如"5.2%")、shares(分享数)、saves(收藏数)、click_rate(点击率如"3.1%")、conversion(转化率如"1.8%")

返回JSON结构必须严格如下:
{
  "content_id": "string",
  "views": 数字,
  "engagement": "string",
  "shares": 数字,
  "saves": 数字,
  "click_rate": "string",
  "conversion": "string"
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}
