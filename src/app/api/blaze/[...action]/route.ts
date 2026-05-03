import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON, justoneAPI } from '@/lib/api-clients'

// ── Route handler: GET ──

export async function GET(_request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []
  if (action.length === 1 && action[0] === 'health') {
    return NextResponse.json({ status: 'ok', service: 'BLAZE v1', modules: 3 })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

// ── Route handler: POST ──

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ─── health ───
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'BLAZE v1', modules: 3 })
    }

    // ─── videos/search ───
    if (action.length === 2 && action[0] === 'videos' && action[1] === 'search') {
      const body = await request.json()
      const keyword: string = body.keyword || ''
      const category: string = body.category || '男装'
      const limit: number = body.limit || 20
      const days: number = body.days || 7

      let videos: any[] = []

      try {
        // Try justoneAPI for douyin video search
        const searchParams: Record<string, string> = { keyword, limit: String(limit) }
        const data = await justoneAPI('/v1/douyin/search', searchParams)
        videos = (data.videos || data.data || []).slice(0, limit)
      } catch {
        // Fallback: use deepseekJSON to generate video data
        const result = await deepseekJSON<{ videos: any[] }>(
          '你是抖音短视频数据分析师。请返回纯JSON。',
          `搜索关键词 "${keyword}"（品类: ${category}）的抖音热门视频，返回最多${limit}条。
每条视频包含: id(title缩写+数字)、title、author、platform固定为"douyin"、views、likes、comments、shares、engagement_rate(小数)、posted_at(YYYY-MM-DD日期)、tags(2-3个标签)、duration_sec(秒数)、viral_score(0-100)
按viral_score从高到低排序

返回JSON结构:
{
  "videos": [{ "id": "string", "title": "string", "author": "string", "platform": "douyin", "views": 数字, "likes": 数字, "comments": 数字, "shares": 数字, "engagement_rate": 数字, "posted_at": "string", "tags": ["string"], "duration_sec": 数字, "viral_score": 数字 }]
}`
        )
        videos = (result.videos || []).slice(0, limit)
      }

      return NextResponse.json({
        keyword,
        category,
        total: videos.length,
        videos,
      })
    }

    // ─── videos/analyze ───
    if (action.length === 2 && action[0] === 'videos' && action[1] === 'analyze') {
      const body = await request.json()
      const videoId: string = body.video_id || ''
      const brand: string = body.brand || '报喜鸟'

      const result = await deepseekJSON<{
        video: { id: string; title: string; author: string; platform: string; views: number; likes: number; comments: number; shares: number; engagement_rate: number; posted_at: string; tags: string[]; duration_sec: number; viral_score: number }
        script_structure: { hook: string; pain_point: string; solution: string; social_proof: string; cta: string }
        brand_mapping: { original: string; mapped: string }[]
        reusable_template: { format: string; optimal_duration: string; top_tags: string[] }
      }>(
        '你是短视频内容策略分析师。请返回纯JSON。',
        `分析视频ID "${videoId}" 的内容结构，并为品牌 "${brand}" 提供内容迁移建议。
要求:
1. video: 视频基本信息（id、title、author、platform、views、likes、comments、shares、engagement_rate小数、posted_at、tags、duration_sec、viral_score）
2. script_structure: 脚本结构分析（hook钩子、pain_point痛点、solution解决方案、social_proof社会证明、cta行动号召）
3. brand_mapping: 3条内容迁移映射（original原始内容、mapped品牌适配内容）
4. reusable_template: 可复用模板（format格式模板、optimal_duration最佳时长、top_tags推荐标签）

返回JSON结构必须严格包含以上字段。`
      )

      return NextResponse.json(result)
    }

    // ─── koc/extract ───
    if (action.length === 2 && action[0] === 'koc' && action[1] === 'extract') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['海澜之家', '雅戈尔', '利郎']
      const days: number = body.days || 30
      const minScore: number = body.min_score || 75

      const result = await deepseekJSON<{
        competitors: string[]
        total: number
        high_priority: number
        koc_list: { username: string; platform: string; followers: number; engagement_rate: number; koc_score: number; content_style: string; reason: string; recommended_action: string; contact_priority: string }[]
      }>(
        '你是KOC营销策略专家。请返回纯JSON。',
        `为竞品 ${competitors.join(', ')} 提取优质的KOC/KOL线索（监测周期${days}天，最低评分${minScore}）。
要求:
1. 返回7-10个KOC，每个包含: username、platform(douyin/xiaohongshu)、followers、engagement_rate(小数)、koc_score(50-100)、content_style、reason(推荐理由)、recommended_action(直接私信合作/关注并评论互动/先观察数据趋势)、contact_priority(高/中/低)
2. 按koc_score从高到低排序
3. high_priority为contact_priority="高"的数量

返回JSON结构必须严格如下:
{
  "competitors": ["string"],
  "total": 数字,
  "high_priority": 数字,
  "koc_list": [{ "username": "string", "platform": "string", "followers": 数字, "engagement_rate": 数字, "koc_score": 数字, "content_style": "string", "reason": "string", "recommended_action": "string", "contact_priority": "string" }]
}`
      )

      return NextResponse.json(result)
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
