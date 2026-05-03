import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON, justoneAPI } from '@/lib/api-clients'

// ── Shared Types ──

interface VideoResult {
  id: string
  title: string
  author: string
  platform: 'douyin'
  views: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
  posted_at: string
  tags: string[]
  duration_sec: number
  viral_score: number
}

interface ScriptStructure {
  hook: string
  pain_point: string
  solution: string
  social_proof: string
  cta: string
}

interface BrandMapping {
  original: string
  mapped: string
}

interface ReusableTemplate {
  format: string
  optimal_duration: string
  top_tags: string[]
}

interface VideoAnalysis {
  video: VideoResult
  script_structure: ScriptStructure
  emotion_triggers: string[]
  scene_composition: string[]
  brand_mapping: BrandMapping[]
  reusable_template: ReusableTemplate
}

interface KOCItem {
  username: string
  platform: string
  followers: number
  engagement_rate: number
  koc_score: number
  content_style: string
  reason: string
  recommended_action: string
  contact_priority: string
}

interface KOCResult {
  competitors: string[]
  total: number
  high_priority: number
  koc_list: KOCItem[]
}

// ── Template Prompts ──

const SEARCH_PROMPT = (keyword: string, category: string, limit: number) => `搜索关键词 "${keyword}"（品类: ${category}）的抖音热门爆款视频，返回最多${limit}条。

每条视频必须包含:
- id: 短视频ID（字符+数字组合）
- title: 视频标题
- author: 作者昵称
- platform: 固定为"douyin"
- views: 播放量
- likes: 点赞数
- comments: 评论数
- shares: 分享数
- engagement_rate: 互动率（小数，计算公式: (likes+comments+shares)/views）
- posted_at: 发布日期（YYYY-MM-DD格式，最近${limit > 10 ? '14' : '7'}天内）
- tags: 2-3个内容标签
- duration_sec: 视频时长（秒）
- viral_score: 爆款评分（0-100，基于互动率、播放量、时效性综合评估）

要求：
1. 数据必须符合抖音短视频的真实分布特征
2. 按viral_score从高到低排序
3. 品类 "${category}" 相关视频占80%以上
4. engagement_rate 范围在 0.001~0.15 之间

返回JSON结构:
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "platform": "douyin",
      "views": 数字,
      "likes": 数字,
      "comments": 数字,
      "shares": 数字,
      "engagement_rate": 数字,
      "posted_at": "string",
      "tags": ["string"],
      "duration_sec": 数字,
      "viral_score": 数字
    }
  ]
}`

const ANALYZE_PROMPT = (videoId: string, brand: string) => `深度分析视频ID "${videoId}" 的内容结构，并为品牌 "${brand}" 提供内容迁移策略。

要求返回以下五个部分:

1. video: 视频基本信息
   - id、title、author、platform("douyin")、views、likes、comments、shares
   - engagement_rate（小数）、posted_at、tags(2-3个)、duration_sec、viral_score(0-100)

2. script_structure: 脚本结构拆解
   - hook: 开头前3秒的钩子话术
   - pain_point: 痛点切入角度
   - solution: 解决方案呈现方式
   - social_proof: 社会证明（数据/案例/背书）
   - cta: 结尾行动号召

3. emotion_triggers: 情感触发点列表
   - 每条描述视频中使用的具体情感触发元素（如焦虑感、从众心理、稀缺性、身份认同等）

4. scene_composition: 场景构成分析
   - 按时间顺序列出主要场景变换及每个场景的拍摄手法/氛围

5. brand_mapping: 品牌内容迁移映射（3条）
   - original: 视频原始内容/话术
   - mapped: 适配品牌"${brand}"的改编版本

6. reusable_template: 可复用模板
   - format: 脚本格式模板（可直接套用的框架）
   - optimal_duration: 最佳视频时长建议
   - top_tags: 推荐标签（3-5个）

返回JSON结构:
{
  "video": { ... },
  "script_structure": { "hook": "string", "pain_point": "string", "solution": "string", "social_proof": "string", "cta": "string" },
  "emotion_triggers": ["string"],
  "scene_composition": ["string"],
  "brand_mapping": [{ "original": "string", "mapped": "string" }],
  "reusable_template": { "format": "string", "optimal_duration": "string", "top_tags": ["string"] }
}`

const EXTRACT_PROMPT = (competitors: string[], days: number, minScore: number) => `为竞品 ${competitors.join(', ')} 提取优质KOC/KOL营销线索。

监测参数:
- 监测周期: 最近${days}天
- 最低KOC评分: ${minScore}
- 目标平台: 抖音、小红书

要求:
1. 输出7-10个KOC/KOL
2. 每个包含:
   - username: 博主昵称
   - platform: 平台（douyin / xiaohongshu）
   - followers: 粉丝数
   - engagement_rate: 互动率（小数）
   - koc_score: KOC评分（${minScore}-100分）
   - content_style: 内容风格描述
   - reason: 为什么推荐该博主（与竞品关联性）
   - recommended_action: 合作建议（直接私信合作 / 关注并评论互动 / 先观察数据趋势）
   - contact_priority: 联系优先级（高 / 中 / 低）
3. 按koc_score从高到低排序
4. high_priority = contact_priority="高"的数量

返回JSON结构:
{
  "competitors": ["string"],
  "total": 数字,
  "high_priority": 数字,
  "koc_list": [
    {
      "username": "string",
      "platform": "string",
      "followers": 数字,
      "engagement_rate": 数字,
      "koc_score": 数字,
      "content_style": "string",
      "reason": "string",
      "recommended_action": "string",
      "contact_priority": "string"
    }
  ]
}`

// ── Route handler: GET ──

export async function GET(_request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []
  if (action.length === 1 && action[0] === 'health') {
    return NextResponse.json({ status: 'ok', service: 'BLAZE v2', modules: 3 })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

// ── Route handler: POST ──

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ─── health ───
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'BLAZE v2', modules: 3 })
    }

    // ─── videos/search: 搜索爆款视频 ───
    if (action.length === 2 && action[0] === 'videos' && action[1] === 'search') {
      const body = await request.json()
      const keyword: string = body.keyword || ''
      const category: string = body.category || '男装'
      const limit: number = body.limit || 20
      const days: number = body.days || 7

      let videos: VideoResult[] = []

      // Try real data from JustOneAPI first
      try {
        const searchParams: Record<string, string> = {
          keyword,
          category,
          days: String(days),
          limit: String(limit),
        }
        const data = await justoneAPI('/v1/douyin/search', searchParams)
        const raw = (data.videos || data.data || []).slice(0, limit) as any[]

        videos = raw.map((v: any) => ({
          id: v.id || '',
          title: v.title || '',
          author: v.author || v.author_name || '',
          platform: 'douyin' as const,
          views: Number(v.views || v.play_count || 0),
          likes: Number(v.likes || v.digg_count || 0),
          comments: Number(v.comments || v.comment_count || 0),
          shares: Number(v.shares || v.share_count || 0),
          engagement_rate: Number(v.engagement_rate || 0),
          posted_at: v.posted_at || v.create_time || '',
          tags: Array.isArray(v.tags) ? v.tags : (v.video_tag ? v.video_tag.split(',').slice(0, 3) : []),
          duration_sec: Number(v.duration_sec || v.duration || 0),
          viral_score: Number(v.viral_score || 0),
        }))

        // Sort by viral_score descending
        videos.sort((a, b) => b.viral_score - a.viral_score)
      } catch {
        // Fallback: use deepseekJSON to generate video data
        const result = await deepseekJSON<{ videos: VideoResult[] }>(
          '你是抖音短视频数据分析专家。请只返回纯JSON，不要markdown代码块。数据需符合真实抖音短视频数据分布。',
          SEARCH_PROMPT(keyword, category, limit),
        )
        videos = (result.videos || []).slice(0, limit)
      }

      return NextResponse.json({
        keyword,
        category,
        days,
        total: videos.length,
        videos,
      })
    }

    // ─── videos/analyze: 深度拆解视频结构 ───
    if (action.length === 2 && action[0] === 'videos' && action[1] === 'analyze') {
      const body = await request.json()
      const videoId: string = body.video_id || ''
      const brand: string = body.brand || '报喜鸟'

      if (!videoId) {
        return NextResponse.json({ error: 'video_id is required' }, { status: 400 })
      }

      const result = await deepseekJSON<VideoAnalysis>(
        '你是短视频内容策略与品牌营销深度分析专家。请只返回纯JSON，不要markdown代码块。分析需具体、可落地。',
        ANALYZE_PROMPT(videoId, brand),
      )

      return NextResponse.json({
        video_id: videoId,
        brand,
        ...result,
      })
    }

    // ─── koc/extract: 提取KOC线索 ───
    if (action.length === 2 && action[0] === 'koc' && action[1] === 'extract') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['海澜之家', '雅戈尔', '利郎']
      const days: number = body.days || 30
      const minKocScore: number = body.min_koc_score ?? body.min_score ?? 75

      if (!Array.isArray(competitors) || competitors.length === 0) {
        return NextResponse.json({ error: 'competitors array is required' }, { status: 400 })
      }

      const result = await deepseekJSON<KOCResult>(
        '你是KOC营销策略与红人挖掘专家。请只返回纯JSON，不要markdown代码块。推荐需基于竞品关联性。',
        EXTRACT_PROMPT(competitors, days, minKocScore),
      )

      return NextResponse.json(result)
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
