import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'LENS v1' })
    }

    // ── scan — brand monitoring scan ──
    if (action.length === 1 && action[0] === 'scan') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['Coach', 'Michael Kors']
      const days: number = body.days || 7

      const result = await deepseekJSON<{
        scan_time: string
        competitors: string[]
        days: number
        total_mentions: number
        mentions: { brand: string; mentions: number; sentiment: number; top_platform: string; growth: string; top_posts: { title: string; platform: string; engagement: string; url: string }[] }[]
        trends: { topic: string; growth: string; platform: string }[]
        alerts: string[]
      }>(
        '你是品牌监测分析专家，擅长社交媒体声量分析。请返回纯JSON。',
        `对以下竞品品牌进行社交媒体声量扫描，监测天数: ${days}天。
竞品: ${competitors.join(', ')}
要求:
1. 为每个品牌生成声量数据（mentions、sentiment评分1-5、top_platform、growth百分比）
2. 每个品牌给出3条热门帖子（title、platform、engagement率、url用#占位）
3. 整体行业趋势（3-5条，含topic、growth、platform）
4. 3-5条洞察警报
返回JSON结构必须严格如下:
{
  "scan_time": "ISO时间戳",
  "competitors": ["品牌列表"],
  "days": 7,
  "total_mentions": 数字,
  "mentions": [{ "brand": "string", "mentions": 数字, "sentiment": 数字, "top_platform": "string", "growth": "string", "top_posts": [{ "title": "string", "platform": "string", "engagement": "string", "url": "#" }] }],
  "trends": [{ "topic": "string", "growth": "string", "platform": "string" }],
  "alerts": ["string"]
}`
      )

      result.scan_time = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ── kols — discover KOLs for brand ──
    if (action.length === 1 && action[0] === 'kols') {
      const body = await request.json()
      const brand: string = body.brand || 'Coach'
      const category: string = body.category || '轻奢女包'

      const result = await deepseekJSON<{
        brand: string
        category: string
        total: number
        avg_match: number
        kols: { name: string; platform: string; followers: string; engagement: string; match_score: number; reason: string }[]
      }>(
        '你是KOL/KOC营销分析专家。请返回纯JSON。',
        `为品牌 "${brand}"（品类: ${category}）推荐10位合适的KOL/KOC。
要求:
1. 提供KOL昵称、平台（抖音/小红书/微博/B站）、粉丝数（如"12.3万"）、互动率（如"5.2%"）、匹配度评分（60-98）、推荐理由
2. 按匹配度从高到低排序
3. 返回avg_match为所有KOL match_score的平均值

返回JSON结构必须严格如下:
{
  "brand": "string",
  "category": "string",
  "total": 数字,
  "avg_match": 数字,
  "kols": [{ "name": "string", "platform": "string", "followers": "string", "engagement": "string", "match_score": 数字, "reason": "string" }]
}`
      )

      return NextResponse.json(result)
    }

    // ── report — generate daily intelligence report ──
    if (action.length === 1 && action[0] === 'report') {
      const body = await request.json()
      const brands: string[] = body.brands || ['Coach', 'Michael Kors', 'Furla']

      const result = await deepseekJSON<{
        date: string
        summary: { total_mentions: number; avg_sentiment: string; hot_topic: string; alert_count: number }
        brand_comparison: { brand: string; share_of_voice: string; sentiment: string; trend: string }[]
        recommendations: string[]
      }>(
        '你是品牌竞品情报分析师。请返回纯JSON。',
        `生成一份每日品牌情报报告，分析以下品牌: ${brands.join(', ')}
要求:
1. summary: 总声量、平均情感评分(如"4.2/5")、热门话题、警报数
2. brand_comparison: 每个品牌的声量占比(如"25%")、情感评分、趋势(上升/平稳/下降)
3. recommendations: 3条具体建议

返回JSON结构必须严格如下:
{
  "date": "YYYY-MM-DD",
  "summary": { "total_mentions": 数字, "avg_sentiment": "string", "hot_topic": "string", "alert_count": 数字 },
  "brand_comparison": [{ "brand": "string", "share_of_voice": "string", "sentiment": "string", "trend": "string" }],
  "recommendations": ["string"]
}`
      )

      result.date = new Date().toISOString().split('T')[0]
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
