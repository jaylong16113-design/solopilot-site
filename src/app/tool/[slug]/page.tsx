import { notFound } from "next/navigation";

// Article content map
const articles: Record<string, { title: string; content: string; site: string }> = {
  // AI Tool - ready sample
  "free-ai-product-image-tools": {
    title: "免费AI商品图生成工具推荐及使用教程",
    site: "tool",
    content: `
## 为什么需要AI商品图？

电商卖家的核心痛点之一就是商品图片。请专业摄影师成本高，自己拍效果差。AI商品图生成工具可以帮你：

- 一键生成白底图
- AI模特换装
- 商品场景图自动合成
- 批量处理节省时间

---

## 5款免费AI商品图工具推荐

### 1. 稿定AI

稿定设计的AI商品图功能，支持上传商品照片自动去背景、换背景、AI模特穿戴。免费版每天可生成5张。

**优点：** 中文界面，操作简单，模板丰富

### 2. Canva AI

Canva内置的Magic Studio，通过文本描述直接生成商品场景图。免费版提供大量模板和AI功能。

**优点：** 国际化模板，AI生图质量高

### 3. Remove.bg（去背景专用）

最知名的商品图去背景工具，支持批量处理。免费版支持预览，高清下载需付费。

**优点：** 去背景效果业界最佳

### 4. 佐糖

国产去背景和AI商品图工具，完全免费。支持批量上传，衣物类商品效果不错。

**优点：** 完全免费，中文支持好

### 5. Leonardo AI

免费生图AI工具，可以生成电商产品展示图。有专门的电商模板，支持ControlNet精准控制。

**优点：** 生成质量高，免费额度充足

---

## 实战：用AI生成商品主图（3步）

**第一步：** 拍摄或准备商品白底照片
**第二步：** 用Remove.bg去背景
**第三步：** 用稿定AI或Canva选择合适的场景模板合成

---

## 小结

这些免费工具已经能满足大部分电商卖家的日常需求。建议从稿定AI开始尝试（中文界面最友好），有特殊需求再搭配其他工具。
    `,
  },
  "10-free-ecommerce-tools": {
    title: "电商新手必备的10个免费工具",
    site: "tool",
    content: `
## 1. 飞书多维表格 — 商品管理和数据追踪

飞书多维表格拥有强大的数据库功能，可以管理商品信息、订单状态、客户数据。比Excel更智能。

## 2. Canva — 商品主图设计

Canva提供大量电商模板，支持拖拽式设计，无需PS基础。

## 3. 剪映 — 商品视频制作

免费的视频剪辑工具，支持自动字幕、模板、AI配音。电商短视频必备。

## 4. Google Analytics — 网站流量分析

免费但功能强大的数据分析工具，了解访客从哪里来、看什么内容。

## 5. Google Search Console — SEO监控

免费监控网站在谷歌搜索中的表现，发现优化机会。

## 6. 淘宝天猫商家后台 — 免费经营分析

淘宝提供的免费数据分析工具，包括行业大盘、竞品分析等。

## 7. ChatGPT — 文案撰写

辅助撰写商品描述、标题优化、客户沟通话术。

## 8. Notion — 运营笔记和协作

免费的知识管理和项目协作工具，适合记录运营SOP。

## 9. 飞书妙记 — 会议和培训记录

免费的语音转文字工具，录制培训视频自动生成文字稿。

## 10. GitHub — 代码和内容版本管理

不仅管代码，还可以管内容，配合GitHub Actions实现自动化发布。
    `,
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
      <div className="prose prose-gray prose-sm max-w-none leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}
