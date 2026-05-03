import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '隐私政策 | AgentClaw',
  description: 'AgentClaw 隐私政策 — 我们如何收集、使用和保护您的个人信息',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
      <p className="text-sm text-muted-foreground mb-8">最后更新：2026年5月4日</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. 信息收集</h2>
          <p>我们仅收集您主动提供的信息，包括通过联系我们（邮箱）时提交的姓名和邮箱地址。</p>
          <p className="mt-2">当您访问本网站时，我们可能会自动收集以下技术信息：浏览器类型、设备类型、操作系统、IP地址、访问页面、访问时间。</p>
          <p className="mt-2">本网站使用 Google AdSense 展示广告，Google 可能会使用 Cookie 向您展示基于兴趣的广告。详情请参见 <a href="https://policies.google.com/technologies/ads" className="underline text-primary" target="_blank" rel="noopener noreferrer">Google 广告技术政策</a>。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. 信息使用</h2>
          <p>我们收集的信息用于：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>改善网站内容和用户体验</li>
            <li>回复您的咨询</li>
            <li>分析网站流量和使用趋势</li>
            <li>展示相关广告</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Cookie</h2>
          <p>本网站使用 Cookie 来改善体验。您可以在浏览器设置中禁用 Cookie。我们使用的 Cookie 类型包括：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>必要 Cookie：</strong>用于工具套件登录验证</li>
            <li><strong>分析 Cookie：</strong>用于了解网站使用情况</li>
            <li><strong>广告 Cookie：</strong>由 Google AdSense 设置</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. 第三方服务</h2>
          <p>本网站集成了以下第三方服务：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google AdSense — 广告展示</li>
            <li>Vercel — 网站托管</li>
            <li>GitHub — 代码托管</li>
          </ul>
          <p className="mt-2">这些服务有各自的隐私政策，我们建议您查阅。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. 数据安全</h2>
          <p>我们采取合理的技术措施保护您的个人信息，但无法保证绝对安全。工具套件区域使用密码保护，密码在传输过程中加密。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. 您的权利</h2>
          <p>您有权：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>要求查看我们持有的您的个人信息</li>
            <li>要求删除您的个人信息</li>
            <li>反对我们使用 Cookie</li>
          </ul>
          <p className="mt-2">如需行使上述权利，请通过 <a href="mailto:jaylong16113@gmail.com" className="underline text-primary">jaylong16113@gmail.com</a> 联系我们。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. 政策更新</h2>
          <p>我们可能会不时更新本隐私政策。重大变更时，我们会在网站首页发布通知。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. 联系方式</h2>
          <p>如有任何隐私相关问题，请联系：</p>
          <p className="mt-1">邮箱：<a href="mailto:jaylong16113@gmail.com" className="underline text-primary">jaylong16113@gmail.com</a></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/" className="text-sm text-primary underline">返回首页</Link>
        <span className="mx-3 text-muted-foreground">·</span>
        <Link href="/terms" className="text-sm text-primary underline">服务条款</Link>
      </div>
    </main>
  )
}
