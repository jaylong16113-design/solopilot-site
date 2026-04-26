export default async function OpsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return <p>文章不存在</p>;

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
      <div className="text-xs text-gray-400 mb-4">{article.date}</div>
      <div className="prose prose-gray prose-sm max-w-none leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}

const articles: Record<string, { title: string; content: string; date: string }> = {
  "what-is-solo-company": {
    title: "一人公司是什么？为什么现在是最好的时代",
    date: "即将发布",
    content: `
## 一人公司的定义

一人公司（Solo Company / One-Person Business）是指**一个人运营全部业务**的企业形式。没有员工、没有合伙人、只有你自己。

## 为什么现在是最好的时代

**1. AI工具大幅降低了门槛**

以前一个人做不了的事——设计、编程、客服、文案——现在AI都能帮你完成。你只需要会"指挥"AI。

**2. 零成本建站和获客**

GitHub Pages、Vercel免费托管，Google SEO免费流量。十年前建一个网站需要几千块，现在0元。

**3. 支付和收款极度便利**

微信支付、支付宝、Payoneer、Stripe——个人收款的渠道比以前多了10倍。

**4. 内容即产品**

写一篇博客文章、做一个免费工具、录一个教程——都可以成为你获取用户的方式。

## 一人公司 vs 传统创业

| 维度 | 传统创业 | 一人公司 |
|------|---------|---------|
| 团队 | 3-10人 | 1人+AI |
| 成本 | 每月至少几万 | 每月几百甚至0 |
| 决策速度 | 慢（需开会） | 快（立刻执行） |
| 风险 | 高 | 低 |
| 天花板 | 高 | 中（可外包） |

## 最适合一人公司的方向

1. 内容站 + AdSense
2. 免费工具站 + CPS联盟
3. 独立开发 SaaS
4. 知识付费
5. 跨境电商选品站

## 我的实践

这个网站（AgentClaw）就是一个典型的一人公司——从域名购买到内容规划到技术搭建，全部一个人完成，成本只有域名费45元。
    `
  },
  "ai-automation-workflow": {
    title: "AI自动化工作流的完整搭建教程",
    date: "即将发布",
    content: `
## 什么是AI自动化工作流？

工作流 = 一系列自动执行的任务链条。AI自动化工作流 = AI帮你完成这些任务。

## 搭建一个简单的自动化工作流

### 需求：自动生成SEO文章并发布

**Step 1：选题**
用 Python 脚本抓取Google Search Console数据 → 找到高潜力关键词

**Step 2：写作**
用 ChatGPT/Claude API 根据关键词生成文章初稿

**Step 3：配图**
用 DALL-E 3 或 Canva API 生成文章封面图

**Step 4：发布**
用 GitHub Actions 自动推送内容 → Vercel 自动构建部署

### 工具链

- **选题**：Google Search Console + 自制脚本
- **写作**：OpenAI API / Claude API
- **配图**：DALL-E 3 API / Canva API
- **发布**：GitHub + Vercel
- **调度**：GitHub Actions（定时任务）

## 入门建议

先从最简单的开始：**一个脚本 + 一个AI API**，解决一个具体问题。
比如："用AI批量生成淘宝标题"，用Python调一次OpenAI API就够了。
    `
  }
};
