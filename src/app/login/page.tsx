import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: '工具登录 | AgentClaw Tools',
  description: 'AgentClaw 工具套件密码入口 — 仅供授权演示使用',
}

export default function LoginPage() {
  return <LoginPageClient />
}
