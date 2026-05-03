import { NextRequest, NextResponse } from 'next/server'

// ── Sample data (ported from Python backend) ──

const SAMPLE_VIDEOS = [
  { id: 'DY001', title: '穿西装也能做深蹲？这件可运动西服太绝了', author: '报喜鸟官方', platform: 'douyin', views: 3850000, likes: 428000, comments: 32100, shares: 18500, engagement_rate: 0.124, posted_at: '2026-04-28', tags: ['可运动西服', '报喜鸟', '穿搭'], duration_sec: 58, viral_score: 92.5 },
  { id: 'DY002', title: '老板出差必备！会呼吸的西装套装', author: '时尚先生Mr_刘', platform: 'douyin', views: 2100000, likes: 195000, comments: 15400, shares: 8200, engagement_rate: 0.104, posted_at: '2026-04-27', tags: ['西装', '商务', '出差'], duration_sec: 45, viral_score: 86.3 },
  { id: 'DY003', title: '面试穿这套，HR直接给offer', author: '职场穿搭日记', platform: 'douyin', views: 5800000, likes: 612000, comments: 48500, shares: 32000, engagement_rate: 0.118, posted_at: '2026-04-26', tags: ['面试', '穿搭', '职场', '西装'], duration_sec: 52, viral_score: 95.1 },
  { id: 'DY004', title: '男生改造计划：从土到帅只差一件西装', author: '阿强变型记', platform: 'douyin', views: 8200000, likes: 890000, comments: 72500, shares: 56000, engagement_rate: 0.124, posted_at: '2026-04-25', tags: ['男生改造', '穿搭', '西装'], duration_sec: 120, viral_score: 97.8 },
  { id: 'DY005', title: '3分钟教你把西装穿出松弛感', author: '穿搭教父', platform: 'douyin', views: 1250000, likes: 98000, comments: 8900, shares: 4500, engagement_rate: 0.088, posted_at: '2026-04-24', tags: ['西装穿搭', '松弛感', '商务'], duration_sec: 180, viral_score: 79.2 },
]

const SAMPLE_KOC = [
  { username: '职场穿搭小能手', platform: 'douyin', followers: 125000, engagement_rate: 0.092, koc_score: 88, content_style: '西装/职场', reason: '竞品评论区高频出现，互动质量高' },
  { username: '时尚搬运工阿杰', platform: 'douyin', followers: 85000, engagement_rate: 0.105, koc_score: 85, content_style: '男装测评', reason: '多次在竞品爆款下发表高质评论' },
  { username: '刘先生的衣帽间', platform: 'douyin', followers: 210000, engagement_rate: 0.078, koc_score: 82, content_style: '商务穿搭', reason: '已有一定粉丝基础，穿搭内容垂直' },
  { username: '职场新人穿搭记', platform: 'xiaohongshu', followers: 45000, engagement_rate: 0.156, koc_score: 91, content_style: '职场/日常', reason: '互动率极高，粉丝粘性强' },
  { username: '西装控老张', platform: 'douyin', followers: 68000, engagement_rate: 0.113, koc_score: 80, content_style: '西装评测', reason: '专业度高的垂直账号' },
  { username: '周一穿什么', platform: 'douyin', followers: 35000, engagement_rate: 0.145, koc_score: 78, content_style: '穿搭推荐', reason: '小而美的垂直内容' },
  { username: '职场精英穿搭秘籍', platform: 'xiaohongshu', followers: 128000, engagement_rate: 0.089, koc_score: 76, content_style: '职场穿搭', reason: '内容质量高，适合品牌合作' },
]

// ── Seeded random (consistent with forge pattern) ──

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function uniform(rng: () => number, min: number, max: number) {
  return rng() * (max - min) + min
}

function randint(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

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

      // Seeded hash to match Python's hash(keyword or category) % 2**31
      const seedStr = keyword || category
      let hash = 0
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
      }
      const seed = Math.abs(hash % 2147483647)
      const rng = seededRandom(seed)

      let results = [...SAMPLE_VIDEOS]
      if (keyword) {
        const kw = keyword.toLowerCase()
        results = results.filter(
          (v) => v.title.toLowerCase().includes(kw) || v.tags.some((t) => t.includes(kw))
        )
      }
      if (results.length === 0) {
        results = SAMPLE_VIDEOS.slice(0, limit)
      }

      // Apply random view multiplier like Python
      results = results.map((v) => ({
        ...v,
        views: Math.round(v.views * uniform(rng, 0.85, 1.15)),
      }))

      return NextResponse.json({
        keyword,
        category,
        total: results.length,
        videos: results.slice(0, limit),
      })
    }

    // ─── videos/analyze ───
    if (action.length === 2 && action[0] === 'videos' && action[1] === 'analyze') {
      const body = await request.json()
      const videoId: string = body.video_id || ''
      const brand: string = body.brand || '报喜鸟'

      const video = SAMPLE_VIDEOS.find((v) => v.id === videoId) || SAMPLE_VIDEOS[0]

      return NextResponse.json({
        video,
        script_structure: {
          hook: `${video.title.slice(0, 20)}... 这种钩子形式在男装类爆款中极为常见`,
          pain_point: '传统西装束缚感强，不适合日常多场景切换',
          solution: `${video.title} — 直接解决痛点`,
          social_proof: `${video.views.toLocaleString()}次播放 + ${video.likes.toLocaleString()}点赞，已验证的内容模式`,
          cta: '点击购物车/关注账号',
        },
        brand_mapping: [
          { original: '深蹲测试西装弹性', mapped: `${brand}可运动西服场景展示` },
          { original: '出差场景痛点', mapped: `${brand}商务出差穿搭方案` },
          { original: '面试穿搭指南', mapped: `${brand}职场第一印象穿搭` },
        ],
        reusable_template: {
          format: 'hook(反常识)+展示(场景化)+social proof(数据)+CTA',
          optimal_duration: '45-60秒',
          top_tags: video.tags,
        },
      })
    }

    // ─── koc/extract ───
    if (action.length === 2 && action[0] === 'koc' && action[1] === 'extract') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['海澜之家', '雅戈尔', '利郎']
      const days: number = body.days || 30
      const minScore: number = body.min_score || 75

      // Seeded hash matching Python's hash(str(competitors)) % 2**31
      const seedStr = JSON.stringify(competitors)
      let hash = 0
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0
      }
      const seed = Math.abs(hash % 2147483647)
      const rng = seededRandom(seed)

      const scored = SAMPLE_KOC.map((koc) => {
        const score = Math.min(100, Math.max(50, koc.koc_score + randint(rng, -5, 5)))
        return {
          ...koc,
          koc_score: score,
          recommended_action:
            score >= 85
              ? '直接私信合作'
              : score >= 75
                ? '关注并评论互动'
                : '先观察数据趋势',
          contact_priority: score >= 85 ? '高' : score >= 75 ? '中' : '低',
        }
      })

      return NextResponse.json({
        competitors,
        total: scored.length,
        high_priority: scored.filter((k) => k.contact_priority === '高').length,
        koc_list: scored.sort((a, b) => b.koc_score - a.koc_score),
      })
    }

    // ─── Fallback ───
    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
