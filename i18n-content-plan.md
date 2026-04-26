# i18n 多语言文章架构方案

## 存储结构

每篇文章翻译后存为 `src/lib/content/{locale}/{slug}.json`

```
src/lib/content/
├── zh/              ← 中文原文
│   ├── index.json
│   ├── first-suit-guide.json
│   └── ...
├── en/              ← 英文翻译
│   ├── index.json
│   ├── first-suit-guide.json
│   └── ...
└── ja/              ← 日文翻译
    ├── index.json
    ├── first-suit-guide.json
    └── ...
```

## 路由结构
```
/tool/first-suit-guide       ← 中文（默认）
/en/tool/first-suit-guide    ← 英文
/ja/tool/first-suit-guide    ← 日文
```

## 翻译方式
- 先搞定英文（57篇），分批并行
- 英文上线后再搞日文、韩文
- 每篇保留：title(翻译), excerpt(翻译), content(全文翻译), slug(不变), site(不变)

## 切换逻辑
- 语言选择器选择 `en` → 页面URL自动切换到 `/en/...`
- 如果英文版本不存在 → 回退中文版本
- 导航/Footer等UI文案和文章内容语言独立
