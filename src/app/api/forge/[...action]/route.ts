import { NextRequest, NextResponse } from 'next/server'
import { deepseekChat, deepseekJSON } from '@/lib/api-clients'

// ── Route handler ──

export async function GET(_request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []
  if (action.length === 1 && action[0] === 'health') {
    return NextResponse.json({ status: 'ok', service: 'FORGE v1', modules: 9 })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    // ─── health ───
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'FORGE v1', modules: 9 })
    }

    // ─── factory/generate ───
    if (action.length === 2 && action[0] === 'factory' && action[1] === 'generate') {
      const body = await request.json()
      const skuName = body.sku_name || 'Unnamed SKU'
      const sellingPoints: string[] = body.selling_points || []
      const targetPlatform = body.target_platform || 'douyin'
      const contentFormat = body.content_format || 'short_video'

      const formatNames: Record<string, string> = {
        short_video: '抖音短视频脚本 (35-40s)',
        live_script: '直播话术脚本',
       种草_post: '小红书种草文案',
      }
      const formatLabel = formatNames[contentFormat] || '内容脚本'

      const output = await deepseekChat([
        { role: 'system', content: '你是一位专业的电商内容创作专家，擅长为品牌生成高质量营销内容脚本。请直接输出完整的脚本内容，使用Markdown格式排版。' },
        { role: 'user', content: `请为SKU "${skuName}" 生成一份${formatLabel}。
目标平台: ${targetPlatform}
核心卖点: ${sellingPoints.join('; ')}

要求:
1. 内容格式完整、可直接使用
2. 包含Hook开头、痛点引入、产品展示、价格锚定、CTA引导
3. 风格符合${targetPlatform}平台调性
4. 用中文输出，Markdown排版` }
      ])

      return NextResponse.json({
        sku_name: skuName,
        target_platform: targetPlatform,
        content_format: contentFormat,
        output,
        generated_at: new Date().toISOString(),
      })
    }

    // ─── auditor/score ───
    if (action.length === 2 && action[0] === 'auditor' && action[1] === 'score') {
      const body = await request.json()
      const content: string = body.content || ''
      const brandKeywords: string = body.brand_keywords || 'SAINT ANGELO, 圣安杰罗'

      const result = await deepseekJSON<{
        overall_score: number
        dimensions: Record<string, { score: number; weight: string }>
        compliance_flags: { term: string; context: string; severity: string }[]
        has_brand_keyword: boolean
        word_count: number
      }>(
        '你是电商内容审核与质量评分专家。请返回纯JSON。请对内容进行多维度评分并标记合规风险。',
        `请对以下电商营销内容进行审核评分:

内容:
"""
${content}
"""

品牌关键词: ${brandKeywords}

评分维度:
1. 品牌一致性 (权重25%): 内容是否充分体现品牌关键词
2. 互动潜力 (权重20%): 内容是否易于引发互动
3. 合规性 (权重20%): 是否包含违禁词/敏感词
4. 清晰度 (权重15%): 表达是否清晰易懂
5. 转化力 (权重20%): 是否包含转化引导元素

如有合规问题，请在compliance_flags中列出(term=问题词, context=上下文, severity=high/medium/low)

返回JSON结构:
{
  "overall_score": 0-100的数字,
  "dimensions": {
    "品牌一致性": { "score": 数字, "weight": "25%" },
    "互动潜力": { "score": 数字, "weight": "20%" },
    "合规性": { "score": 数字, "weight": "20%" },
    "清晰度": { "score": 数字, "weight": "15%" },
    "转化力": { "score": 数字, "weight": "20%" }
  },
  "compliance_flags": [{ "term": "string", "context": "string", "severity": "string" }],
  "has_brand_keyword": true/false,
  "word_count": 数字
}`
      )

      return NextResponse.json(result)
    }

    // ─── board/report ───
    if (action.length === 2 && action[0] === 'board' && action[1] === 'report') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['douyin']
      const groupBy = body.group_by || 'platform'
      const dateRange = body.date_range || { start: '2026-04-01', end: '2026-04-30' }

      const result = await deepseekJSON<{
        date_range: { start: string; end: string }
        total_views: number
        total_likes: number
        avg_engagement: number
        platforms: Record<string, { title: string; views: number; likes: number; comments: number; shares: number; engagement_rate: number }[]>
        generated_at: string
      }>(
        '你是社交媒体数据看板分析师。请返回纯JSON。',
        `生成电商内容表现看板报告，按${groupBy}分组。
平台: ${platforms.join(', ')}
日期范围: ${dateRange.start} 至 ${dateRange.end}

每个平台生成5条内容表现数据(title、views、likes、comments、shares、engagement_rate百分比数字如5.23)
计算总计: total_views、total_likes、avg_engagement(各平台engagement_rate的平均值)

返回JSON结构:
{
  "date_range": { "start": "string", "end": "string" },
  "total_views": 数字,
  "total_likes": 数字,
  "avg_engagement": 数字,
  "platforms": {
    "douyin": [{ "title": "string", "views": 数字, "likes": 数字, "comments": 数字, "shares": 数字, "engagement_rate": 数字 }]
  },
  "generated_at": "ISO时间戳"
}`
      )

      result.date_range = dateRange
      result.generated_at = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ─── radar/scan ───
    if (action.length === 2 && action[0] === 'radar' && action[1] === 'scan') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['Coach', 'Michael Kors', 'Furla', 'Tory Burch']
      const category = body.category || '轻奢通勤包'

      const result = await deepseekJSON<{
        category: string
        competitors: string[]
        hot_formats: { format: string; frequency: number; avg_engagement: number; gap: string }[]
        trending_topics: { topic: string; growth: string }[]
        content_gaps: string[]
        scanned_items: number
        generated_at: string
      }>(
        '你是内容竞争情报分析师。请返回纯JSON。',
        `对品类 "${category}" 进行内容雷达扫描，分析竞品 ${competitors.join(', ')}。
要求:
1. hot_formats: 热门内容格式（format、frequency出现频次、avg_engagement平均互动率、gap竞争差距high/medium/low）
2. trending_topics: 3个热门话题（topic、growth增长率如"+34%"）
3. content_gaps: 3个内容空白机会
4. scanned_items: 扫描到的内容总数

返回JSON结构:
{
  "category": "string",
  "competitors": ["string"],
  "hot_formats": [{ "format": "string", "frequency": 数字, "avg_engagement": 数字, "gap": "string" }],
  "trending_topics": [{ "topic": "string", "growth": "string" }],
  "content_gaps": ["string"],
  "scanned_items": 数字,
  "generated_at": "ISO时间戳"
}`
      )

      result.generated_at = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ─── planner/generate ───
    if (action.length === 2 && action[0] === 'planner' && action[1] === 'generate') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['douyin', 'xiaohongshu', 'jd']

      const result = await deepseekJSON<{
        plans: Record<string, { day: string; content_type: string; time: string; topic: string }[]>
        total_items: number
        recommendation: string
      }>(
        '你是社交媒体内容排期策划专家。请返回纯JSON。',
        `为以下平台生成一周内容排期计划: ${platforms.join(', ')}
每个平台生成周一至周日的内容安排，每天包含:
- day(周一到周日)
- content_type(短视频/图文/直播/文章)
- time(发布时间如"10:00")
- topic(内容主题如新品展示/穿搭教程/客户好评/保养技巧/场景搭配)
total_items为所有平台内容总数
recommendation为一条总体建议

返回JSON结构:
{
  "plans": {
    "douyin": [{ "day": "string", "content_type": "string", "time": "string", "topic": "string" }]
  },
  "total_items": 数字,
  "recommendation": "string"
}`
      )

      return NextResponse.json(result)
    }

    // ─── daily-report ───
    if (action.length === 1 && action[0] === 'daily-report') {
      const body = await request.json()

      const result = await deepseekJSON<{
        date: string
        results: { new_content: number; total_views: number; new_followers: number; engagement: string; estimated_gmv: number }
        top_content: { title: string; views: number; engagement: string }
        alerts: string[]
        generated_at: string
      }>(
        '你是社交媒体运营数据分析师。请返回纯JSON。',
        `生成本日社交媒体运营日报数据。
包含:
1. results: new_content(新增内容数)、total_views(总播放量)、new_followers(新增粉丝)、engagement(互动率如"5.2%")、estimated_gmv(预估GMV)
2. top_content: 今日最佳内容(title标题、views播放量、engagement互动率)
3. alerts: 2条运营预警/提醒

返回JSON结构:
{
  "date": "YYYY-MM-DD",
  "results": { "new_content": 数字, "total_views": 数字, "new_followers": 数字, "engagement": "string", "estimated_gmv": 数字 },
  "top_content": { "title": "string", "views": 数字, "engagement": "string" },
  "alerts": ["string"],
  "generated_at": "ISO时间戳"
}`
      )

      result.date = body.date || new Date().toISOString().split('T')[0]
      result.generated_at = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ─── intel-report ───
    if (action.length === 1 && action[0] === 'intel-report') {
      const result = await deepseekJSON<{
        alerts: { competitor: string; action: string; severity: string }[]
        trending_keywords: string[]
        our_position: { share_of_voice: string; avg_engagement_vs_category: string }
        generated_at: string
      }>(
        '你是竞品情报分析师。请返回纯JSON。',
        `生成今日竞品情报简报。
要求:
1. alerts: 2条竞品动态警报(competitor竞品名、action行动描述、severity等级high/medium/low)
2. trending_keywords: 3个热门关键词
3. our_position: 我们的市场位置(share_of_voice声量占比如"4.5%"、avg_engagement_vs_category与品类平均对比如"+1.2%")

返回JSON结构:
{
  "alerts": [{ "competitor": "string", "action": "string", "severity": "string" }],
  "trending_keywords": ["string"],
  "our_position": { "share_of_voice": "string", "avg_engagement_vs_category": "string" },
  "generated_at": "ISO时间戳"
}`
      )

      result.generated_at = new Date().toISOString()
      return NextResponse.json(result)
    }

    // ─── translator/translate ───
    if (action.length === 2 && action[0] === 'translator' && action[1] === 'translate') {
      const body = await request.json()
      const skuName = body.sku_name || 'Unnamed SKU'
      const sellingPoints: string[] = body.selling_points || []
      const targetPlatform = body.target_platform || 'xiaohongshu'
      const targetTiers: string[] = body.target_tiers || ['en_ecom', 'cn_optimized', 'en_native']
      const points = sellingPoints.join('; ')

      const output = await deepseekChat([
        { role: 'system', content: '你是一位专业的电商文案翻译专家，擅长进行三层次翻译：英文电商版、中文平台优化版、原生英文版。输出使用Markdown格式。' },
        { role: 'user', content: `请为SKU "${skuName}" 进行三层次翻译。
核心卖点: ${points}
目标平台: ${targetPlatform}
翻译层次: ${targetTiers.join(', ')}

要求:
- en_ecom: 英文电商版，适用于Amazon等国际电商平台
- cn_optimized: 中文平台优化版，适用于${targetPlatform}，符合中文社交平台调性
- en_native: 原生英文版，地道英语表达

请用以下格式输出:
## Three-Tier Translation: ${skuName}

### 1. English E-commerce (en_ecom)
...

### 2. Chinese Platform Optimized (cn_optimized)
...

### 3. Native English Adaptation (en_native)
...` }
      ])

      return NextResponse.json({
        sku_name: skuName,
        tiers: targetTiers,
        target_platform: targetPlatform,
        output,
        generated_at: new Date().toISOString(),
      })
    }

    // ─── video/generate ───
    if (action.length === 2 && action[0] === 'video' && action[1] === 'generate') {
      const body = await request.json()
      const script: string = body.script || ''
      const engine = body.engine || 'veo'
      const aspectRatio = body.aspect_ratio || '9:16'
      const voiceoverStyle = body.voiceover_style || 'female_elegant'

      const storyboard = await deepseekChat([
        { role: 'system', content: '你是一位专业的短视频导演/分镜师，擅长将营销脚本转化为详细的视频分镜表(storyboard)。输出Markdown格式表格。' },
        { role: 'user', content: `请根据以下脚本生成视频分镜故事板。

脚本:
"""
${script}
"""

引擎: ${engine}
画面比例: ${aspectRatio}
配音风格: ${voiceoverStyle}

请输出一个包含7个分镜的表格，每个分镜包含: 镜头编号、画面描述、摄像机运动、灯光氛围、配音文案。

格式: Markdown表格
| 镜头 | 画面描述 | 摄像机运动 | 灯光氛围 | 配音文案 |` }
      ])

      return NextResponse.json({
        engine,
        total_shots: 7,
        storyboard,
        assembly_notes: `建议使用FFmpeg拼接所有分镜, ${aspectRatio}竖屏, ${voiceoverStyle}配音, 无BGM`,
        generated_at: new Date().toISOString(),
      })
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
