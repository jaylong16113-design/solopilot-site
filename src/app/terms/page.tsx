import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '服务条款 | AgentClaw',
  description: 'AgentClaw 服务条款 — 使用本网站即表示您同意以下条款',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">服务条款</h1>
      <p className="text-sm text-muted-foreground mb-8">最后更新：2026年5月4日</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. 接受条款</h2>
          <p>访问和使用 AgentClaw（以下简称"本网站"）即表示您同意接受本服务条款的约束。如您不同意任何条款，请停止使用本网站。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. 内容所有权</h2>
          <p>本网站上的所有内容，包括但不限于文章、图片、代码、设计，均为本网站或其内容提供者的知识产权，受版权法保护。</p>
          <p className="mt-2">除非另有说明，您不得复制、分发、修改或商业使用本网站的内容。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. 内容准确性</h2>
          <p>本网站上的文章和教程仅供参考。我们尽力确保内容准确，但不保证信息的完整性、准确性或时效性。使用本网站内容所产生的结果由您自行承担。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. 外部链接</h2>
          <p>本网站可能包含第三方网站链接。我们不对这些网站的内容、隐私政策或做法负责。点击第三方链接风险自负。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. 工具套件</h2>
          <p>本网站提供的工具套件（包括 AXIOM、FORGE、BLAZE、HUNTER、MIST）仅供内部演示使用，不提供任何明示或暗示的保证。</p>
          <p className="mt-2">工具套件访问密码仅供授权用户使用，不得分享给未授权第三方。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. 免责声明</h2>
          <p>本网站按"现状"提供，不提供任何形式的保证。在适用法律允许的最大范围内，我们不对因使用本网站而产生的任何直接或间接损失承担责任。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. 条款变更</h2>
          <p>我们保留随时修改本服务条款的权利。重大变更时，我们会在网站首页发布通知。继续使用本网站即表示您接受修改后的条款。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. 适用法律</h2>
          <p>本服务条款受中华人民共和国法律管辖。如有争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院裁决。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. 联系方式</h2>
          <p>邮箱：<a href="mailto:jaylong16113@gmail.com" className="underline text-primary">jaylong16113@gmail.com</a></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/" className="text-sm text-primary underline">返回首页</Link>
        <span className="mx-3 text-muted-foreground">·</span>
        <Link href="/privacy" className="text-sm text-primary underline">隐私政策</Link>
      </div>
    </main>
  )
}
