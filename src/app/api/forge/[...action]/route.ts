import { NextRequest, NextResponse } from 'next/server'

// ── Mock data helpers ──

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function randomInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function randomFloat(rng: () => number, min: number, max: number) {
  return rng() * (max - min) + min
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function sample<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rng() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

// ── Banned words ──

const BANNED_WORDS: Record<string, string[]> = {
  high: ['最', '第一', '国家级', '唯一', '首个', '顶级', '极致', '100%', '绝对', '永不'],
  medium: ['保证', '承诺', '无效退款', '根治', '治疗', '疗效', '药效'],
  low: ['限时特惠', '限时抢购', '错过等一年', '限量', '仅限今日'],
}

// ── Format templates (for mock generation) ──

const FORMAT_TEMPLATES: Record<string, string> = {
  short_video:
    '## 📱 抖音短视频脚本 (35-40s)\n\n| 时间 | 画面 | 文案 |\n|------|------|------|\n| 0-3s | 产品特写+品牌logo | "你还在为通勤包太重发愁吗？" |\n| 3-8s | 背包细节展示（皮质纹理） | "圣安杰罗意大利头层牛皮，质感一眼可见" |\n| 8-15s | 上身展示+通勤场景 | "仅重0.8kg，手机钥匙电脑统统装下" |\n| 15-22s | 防水测试画面 | "下雨天也不怕，防水涂层给你安全感" |\n| 22-30s | 手工缝制工艺特写 | "纯手工缝制，每只包包8小时打磨" |\n| 30-35s | 三色展示+购买引导 | "经典三色可选，点击下方链接获取" |',
  live_script:
    '## 🎙️ 直播话术脚本\n\n**【开场】**\n大家好，欢迎来到SAINT ANGELO直播间！今天给大家带来的是我们的王牌产品——米兰系列双肩包。\n\n**【痛点引入】**\n有多少姐妹每天通勤背的包重得像背了块砖？肩膀酸痛、勒痕、怕下雨...今天这款包解决你所有烦恼。\n\n**【产品展示】**\n来，镜头拉近看这个皮质纹理——意大利头层进口牛皮，摸一下就知道什么叫质感。\n\n**【价格锚定】**\n专柜同品质3999，今天直播间仅需1999！\n\n**【逼单】**\n只剩最后5单！拍下备注"主播推荐"送价值299的护理套装！3、2、1上链接！',
  种草_post:
    '## 📕 小红书种草文案\n\n**标题：** 👜 通勤女孩的梦中情包！仅重0.8kg的意大利牛皮双肩包✨\n\n**正文：**\n姐妹们！我终于找到了理想中的通勤包！\n\n每天地铁通勤1小时，之前背的PU包重得我想哭 😭 直到入手了这款圣安杰罗米兰系列双肩包——\n\n👜 **头层意大利进口牛皮**：质感真的绝了，摸上去就知道和几百块的包不一样\n💪 **仅重0.8kg**：背一整天肩膀毫无压力\n🌧️ **防水涂层**：上周下雨实测，包里文件一点没湿\n🧵 **纯手工缝制**：每只包耗时8小时，细节经得起放大镜看\n\n背了一周，同事都在问链接！经典三色我入了两个，通勤和出差换着背～\n\n**标签：**\n#通勤包包 #千元包包推荐 #轻奢女包 #双肩包 #意大利牛皮 #圣安杰罗 #上班族必备',
}

// ── Route handler ──

export async function GET(request: NextRequest, { params }: { params: { action?: string[] } }) {
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

      const template = FORMAT_TEMPLATES[contentFormat] || FORMAT_TEMPLATES['short_video']
      const points = sellingPoints.join('; ')

      const output = template
        .replace(/{sku_name}/g, skuName)
        .replace(/{selling_points}/g, points)

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

      const flags: { term: string; context: string; severity: string }[] = []
      for (const [severity, words] of Object.entries(BANNED_WORDS)) {
        for (const word of words) {
          const idx = content.indexOf(word)
          if (idx !== -1) {
            const start = Math.max(0, idx - 10)
            const end = Math.min(content.length, idx + word.length + 10)
            flags.push({ term: word, context: content.slice(start, end), severity })
          }
        }
      }

      const brandMatch = Math.min(
        100,
        brandKeywords
          .split(',')
          .filter((k) => content.includes(k.trim()))
          .length * 25,
      )
      const engagement = /[?!]/.test(content) || /你|你的|我们/.test(content) ? 70 : 45
      const compliance = Math.max(0, 100 - flags.length * 20)
      const clarity = content.length > 50 ? 85 : 60
      const conversion = /购买|下单|链接|限时|特惠|点击/.test(content) ? 75 : 40

      const overall = Math.round(brandMatch * 0.25 + engagement * 0.2 + compliance * 0.2 + clarity * 0.15 + conversion * 0.2 * 10) / 10

      return NextResponse.json({
        overall_score: overall,
        dimensions: {
          '品牌一致性': { score: brandMatch, weight: '25%' },
          '互动潜力': { score: engagement, weight: '20%' },
          '合规性': { score: compliance, weight: '20%' },
          '清晰度': { score: clarity, weight: '15%' },
          '转化力': { score: conversion, weight: '20%' },
        },
        compliance_flags: flags,
        has_brand_keyword: brandKeywords.split(',').some((k) => content.includes(k.trim())),
        word_count: content.length,
      })
    }

    // ─── board/report ───
    if (action.length === 2 && action[0] === 'board' && action[1] === 'report') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['douyin']
      const groupBy = body.group_by || 'platform'
      const rng = seededRandom(42)

      const platformsData: Record<string, any[]> = {}
      for (const plat of platforms) {
        const items = []
        for (let i = 0; i < 5; i++) {
          const views = randomInt(rng, 20000, 500000)
          const likes = Math.floor(views * randomFloat(rng, 0.05, 0.15))
          items.push({
            title: `${groupBy.includes('通勤') ? '通勤穿搭' : plat}内容${i + 1}`,
            views,
            likes,
            comments: Math.floor(likes * randomFloat(rng, 0.05, 0.1)),
            shares: Math.floor(likes * randomFloat(rng, 0.1, 0.3)),
            engagement_rate: Math.round((likes / Math.max(views, 1)) * 100 * 100) / 100,
          })
        }
        platformsData[plat] = items
      }

      const allViews = Object.values(platformsData).flatMap((items) => items.map((i) => i.views))
      const allLikes = Object.values(platformsData).flatMap((items) => items.map((i) => i.likes))
      const allEngagement = Object.values(platformsData).flatMap((items) => items.map((i) => i.engagement_rate))
      const totalViews = allViews.reduce((a, b) => a + b, 0)
      const totalLikes = allLikes.reduce((a, b) => a + b, 0)
      const avgEngagement =
        Math.round((allEngagement.reduce((a, b) => a + b, 0) / Math.max(allEngagement.length, 1)) * 100) / 100

      return NextResponse.json({
        date_range: body.date_range || { start: '2026-04-01', end: '2026-04-30' },
        total_views: totalViews,
        total_likes: totalLikes,
        avg_engagement: avgEngagement,
        platforms: platformsData,
        generated_at: new Date().toISOString(),
      })
    }

    // ─── radar/scan ───
    if (action.length === 2 && action[0] === 'radar' && action[1] === 'scan') {
      const body = await request.json()
      const competitors: string[] = body.competitors || ['Coach', 'Michael Kors', 'Furla', 'Tory Burch']
      const category = body.category || '轻奢通勤包'

      const hotFormats = [
        { format: '开箱测评', frequency: 23, avg_engagement: 9.2, gap: 'high' },
        { format: '通勤穿搭Vlog', frequency: 18, avg_engagement: 8.7, gap: 'high' },
        { format: '皮质保养教程', frequency: 12, avg_engagement: 7.5, gap: 'medium' },
        { format: '价格对比', frequency: 15, avg_engagement: 11.3, gap: 'medium' },
        { format: '品牌故事/工艺', frequency: 8, avg_engagement: 5.2, gap: 'low' },
      ]
      const topics = [
        { topic: '#通勤包包', growth: '+34%' },
        { topic: '#千元包包推荐', growth: '+45%' },
        { topic: '#皮质包包保养', growth: '+52%' },
      ]
      const gaps = [
        '皮质保养教程 — 竞品已验证有效',
        '通勤一周穿搭不重样 — 系列Vlog',
        '包包收纳技巧 — 小红书收藏率23%',
      ]

      return NextResponse.json({
        category,
        competitors,
        hot_formats: hotFormats,
        trending_topics: topics,
        content_gaps: gaps,
        scanned_items: 42,
        generated_at: new Date().toISOString(),
      })
    }

    // ─── planner/generate ───
    if (action.length === 2 && action[0] === 'planner' && action[1] === 'generate') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['douyin', 'xiaohongshu', 'jd']
      const rng = seededRandom(Date.now())
      const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

      const plans: Record<string, any[]> = {}
      for (const plat of platforms) {
        const weekly = weekdays.map((day) => ({
          day,
          content_type: pick(rng, ['短视频', '图文', '直播', '文章']),
          time: `${String(randomInt(rng, 8, 21)).padStart(2, '0')}:00`,
          topic: pick(rng, ['新品展示', '穿搭教程', '客户好评', '保养技巧', '场景搭配']),
        }))
        plans[plat] = weekly
      }

      return NextResponse.json({
        plans,
        total_items: Object.values(plans).reduce((a, b) => a + b.length, 0),
        recommendation: '建议抖音每日1条短视频 + 小红书隔日1篇图文 + 京东每周2次A+内容更新',
      })
    }

    // ─── daily-report ───
    if (action.length === 1 && action[0] === 'daily-report') {
      const body = await request.json()
      const rng = seededRandom(Math.floor(Date.now() / 86400000))
      const rngViews = seededRandom(Math.floor(Date.now() / 86400000) + 1)

      return NextResponse.json({
        date: body.date || 'today',
        results: {
          new_content: randomInt(rng, 3, 8),
          total_views: randomInt(rngViews, 50000, 500000),
          new_followers: randomInt(rng, 100, 800),
          engagement: `${randomFloat(rng, 3, 12).toFixed(1)}%`,
          estimated_gmv: randomInt(rng, 5000, 50000),
        },
        top_content: {
          title: '今日最佳内容',
          views: randomInt(rngViews, 10000, 100000),
          engagement: `${randomFloat(rng, 5, 15).toFixed(1)}%`,
        },
        alerts: [
          '抖音完播率低于均值，建议优化前3秒Hook',
          '小红书收藏率上升12%，保持内容深度策略',
        ],
        generated_at: new Date().toISOString(),
      })
    }

    // ─── intel-report ───
    if (action.length === 1 && action[0] === 'intel-report') {
      const rng = seededRandom(Math.floor(Date.now() / 86400000))

      const alerts = [
        {
          competitor: pick(rng, ['Coach', 'MK', 'Furla', 'TB']),
          action: pick(rng, ['直播加码', '新代言人', '降价促销', '新品上线']),
          severity: pick(rng, ['high', 'medium', 'low']),
        },
        {
          competitor: pick(rng, ['Coach', 'MK', 'Furla', 'TB']),
          action: pick(rng, ['KOL矩阵加速', '小红书投放增加', '京东A+升级']),
          severity: pick(rng, ['high', 'medium', 'low']),
        },
      ]

      return NextResponse.json({
        alerts,
        trending_keywords: sample(rng, ['通勤双肩包', '意大利牛皮', '手工包包', '千元轻奢', '通勤穿搭'], 3),
        our_position: {
          share_of_voice: `${randomFloat(rng, 2, 8).toFixed(1)}%`,
          avg_engagement_vs_category: `${randomFloat(rng, -2, 2).toFixed(1)}%`,
        },
        generated_at: new Date().toISOString(),
      })
    }

    // ─── translator/translate ───
    if (action.length === 2 && action[0] === 'translator' && action[1] === 'translate') {
      const body = await request.json()
      const skuName = body.sku_name || 'Unnamed SKU'
      const sellingPoints: string[] = body.selling_points || []
      const targetPlatform = body.target_platform || 'xiaohongshu'
      const targetTiers: string[] = body.target_tiers || ['en_ecom', 'cn_optimized', 'en_native']
      const points = sellingPoints.join('; ')

      const output = `## Three-Tier Translation: ${skuName}\n\n### 1. English E-commerce (en_ecom)\n${skuName} — Premium Italian Leather Backpack. Crafted from top-grain Italian cowhide with artisanal hand-stitching. Water-resistant coating protects your essentials. Ultra-light at 0.8kg — the perfect commuter companion.\n\n### 2. Chinese Platform Optimized (cn_optimized)\n【${skuName}】意大利头层牛皮×纯手工缝制，轻到只有0.8kg！防水涂层雨天无忧，通勤出差一只搞定✨\n${targetPlatform === 'xiaohongshu' ? '#轻奢通勤包 #意大利牛皮 #SAINTANGELO' : '限量发售中，点击下方抢购！'}\n\n### 3. Native English Adaptation (en_native)\nIntroducing the Milano Commuter — where Italian craftsmanship meets modern urban life. Hand-stitched by master artisans, each piece requires 8 hours of meticulous work. The water-repellent finish means you're prepared for whatever the city throws at you. At just 0.8kg, it's the lightest luxury backpack you'll ever carry.`

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

      const storyboard = `## 🎬 Storyboard (${aspectRatio} · ${engine})\n\n| 镜头 | 画面描述 | 摄像机运动 | 灯光氛围 | 配音文案 |\n|------|---------|-----------|---------|---------|\n| 1 | 清晨城市街道，通勤人群匆匆走过，主角背影出现 | 中景推近 | 晨光自然光，暖色调 | "每天通勤的你，值得更好的" |\n| 2 | 圣安杰罗背包特写，皮质纹理在光线下闪烁 | 微距慢推 | 侧光突出皮质质感 | "意大利头层牛皮，触手可及的奢华" |\n| 3 | 主角将电脑、水杯、雨伞依次放入背包 | 固定机位 | 顶光柔和 | "0.8kg超轻设计，装下整个世界" |\n| 4 | 雨滴落在背包上，水珠滑落，内部物品干燥 | 特写俯拍 | 暗调+聚光灯打在水珠上 | "防水涂层，风雨无忧" |\n| 5 | 手工缝线细节，匠人手法特写 | 微距移动 | 暖黄工艺灯光 | "纯手工缝制，每只8小时精心打磨" |\n| 6 | 模特背包装扮走在阳光下的街道 | 跟拍+广角 | 逆光，金色轮廓 | "米兰系列，经典三色可选" |\n| 7 | 产品三色排列，品牌logo浮现+购买提示 | 固定机位 | 柔和环光 | "点击下方，开启你的质感通勤" |`

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
