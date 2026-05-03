import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'LENS v2' })
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
        mentions: {
          brand: string
          mentions: number
          sentiment: number
          sentiment_trend: { date: string; score: number }[]
          top_platform: string
          platform_distribution: { platform: string; percentage: number }[]
          growth: string
          estimated_ad_spend: string
          roi_estimate: string
          top_posts: { title: string; platform: string; engagement: string; url: string }[]
        }[]
        trends: { topic: string; growth: string; platform: string }[]
        alerts: string[]
      }>(
        '你是品牌监测分析专家，擅长社交媒体声量分析。请返回纯JSON。',
        `对以下竞品品牌进行社交媒体声量扫描，监测天数: ${days}天。
竞品: ${competitors.join(', ')}
要求:
1. 为每个品牌生成声量数据（mentions、sentiment评分1-5、top_platform、growth百分比）
2. 每个品牌给出3条热门帖子（title、platform、engagement率、url用#占位）
3. 【新增】每个品牌增加sentiment_trend（最近7天每天的情感评分数组，格式: [{date:"YYYY-MM-DD", score:数字}]）
4. 【新增】每个品牌增加platform_distribution（平台分布百分比数组，格式: [{platform:"小红书", percentage:数字}, ...]，各平台百分比之和为100）
5. 【新增】每个品牌增加estimated_ad_spend（预估媒体投放费用，如"¥50-80万"）
6. 【新增】每个品牌增加roi_estimate（粗略ROI估算，如"1:3.5"）
7. 整体行业趋势（3-5条，含topic、growth、platform）
8. 3-5条洞察警报
返回JSON结构必须严格如下:
{
  "scan_time": "ISO时间戳",
  "competitors": ["品牌列表"],
  "days": 7,
  "total_mentions": 数字,
  "mentions": [{
    "brand": "string",
    "mentions": 数字,
    "sentiment": 数字,
    "sentiment_trend": [{"date": "YYYY-MM-DD", "score": 数字}],
    "top_platform": "string",
    "platform_distribution": [{"platform": "string", "percentage": 数字}],
    "growth": "string",
    "estimated_ad_spend": "string",
    "roi_estimate": "string",
    "top_posts": [{"title": "string", "platform": "string", "engagement": "string", "url": "#"}]
  }],
  "trends": [{"topic": "string", "growth": "string", "platform": "string"}],
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
        kols: {
          name: string
          platform: string
          followers: string
          engagement: string
          match_score: number
          contact_priority: string
          recommended_action: string
          reason: string
        }[]
      }>(
        '你是KOL/KOC营销分析专家。请返回纯JSON。',
        `为品牌 "${brand}"（品类: ${category}）推荐10位合适的KOL/KOC。
要求:
1. 提供KOL昵称、平台（抖音/小红书/微博/B站）、粉丝数（如"12.3万"）、互动率（如"5.2%"）、匹配度评分（60-98）、推荐理由
2. 【新增】每个KOL增加contact_priority字段（"高优先"、"中优先"、"低优先"），基于匹配度+粉丝重合度判断
3. 【新增】每个KOL增加recommended_action字段（具体行动建议，如"合作邀约"、"样品寄送"、"内容共创"、"竞品拦截"）
4. 按匹配度从高到低排序
5. 返回avg_match为所有KOL match_score的平均值

返回JSON结构必须严格如下:
{
  "brand": "string",
  "category": "string",
  "total": 数字,
  "avg_match": 数字,
  "kols": [{
    "name": "string",
    "platform": "string",
    "followers": "string",
    "engagement": "string",
    "match_score": 数字,
    "contact_priority": "string",
    "recommended_action": "string",
    "reason": "string"
  }]
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

    // ── roi — ROI calculation ──
    if (action.length === 1 && action[0] === 'roi') {
      const body = await request.json()
      const brand: string = body.brand || 'Coach'
      const revenue: number = body.revenue || 1000000
      const contentCost: number = body.content_cost || 200000
      const adCost: number = body.ad_cost || 300000

      const totalCost = contentCost + adCost
      const roiValue = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0

      const result = await deepseekJSON<{
        brand: string
        roi_value: string
        cost_breakdown: {
          content_cost: number
          ad_cost: number
          total_cost: number
          revenue: number
          net_profit: number
        }
        recommendation: string
      }>(
        '你是品牌营销ROI分析专家，擅长计算内容营销和广告投放的投入产出比。请返回纯JSON。',
        `为品牌 "${brand}" 计算营销ROI。

输入数据:
- 销售额(revenue): ¥${revenue.toLocaleString()}
- 内容成本(content_cost): ¥${contentCost.toLocaleString()}
- 投放成本(ad_cost): ¥${adCost.toLocaleString()}
- 总成本: ¥${totalCost.toLocaleString()}
- 净利润: ¥${(revenue - totalCost).toLocaleString()}
- ROI: ${roiValue.toFixed(2)}%

要求:
1. 根据以上数据生成roi_value（格式如"150%"）
2. cost_breakdown包含各项成本和净利润
3. recommendation字段给出3-5句具体优化建议（中文），基于ROI值提供可操作的方向

返回JSON结构必须严格如下:
{
  "brand": "string",
  "roi_value": "string",
  "cost_breakdown": {
    "content_cost": 数字,
    "ad_cost": 数字,
    "total_cost": 数字,
    "revenue": 数字,
    "net_profit": 数字
  },
  "recommendation": "string"
}`
      )

      return NextResponse.json(result)
    }

    // ── ads — media投放 analysis ──
    if (action.length === 1 && action[0] === 'ads') {
      const body = await request.json()
      const competitor: string = body.competitor || 'Coach'
      const platform: string = body.platform || '抖音'

      const result = await deepseekJSON<{
        competitor: string
        platform: string
        estimated_spend: string
        ad_strategy: string
        creative_analysis: {
          strong_points: string[]
          weak_points: string[]
          recommended_direction: string
        }
      }>(
        '你是社交媒体广告投放分析专家，擅长竞品投放策略拆解和创意分析。请返回纯JSON。',
        `分析竞品 "${competitor}" 在平台 "${platform}" 上的媒体投放情况。

要求:
1. estimated_spend: 预估投放金额（如"¥80-120万/月"），结合品牌定位和行业均值给出合理范围
2. ad_strategy: 投放策略分析（200-300字），包括目标人群、投放节奏、内容形式等
3. creative_analysis: 创意分析
   - strong_points: 3条该竞品在该平台的投放优势
   - weak_points: 3条可攻破的弱点或机会点
   - recommended_direction: 针对性地给出优化建议方向（100-200字）

返回JSON结构必须严格如下:
{
  "competitor": "string",
  "platform": "string",
  "estimated_spend": "string",
  "ad_strategy": "string",
  "creative_analysis": {
    "strong_points": ["string"],
    "weak_points": ["string"],
    "recommended_direction": "string"
  }
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
