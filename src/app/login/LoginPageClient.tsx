'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/axiom'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    
    if (res.ok) {
      router.push(redirect)
    } else {
      setError('密码错误，请重试')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          访问密码
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="请输入密码"
          className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-[#5e6ad2] focus:ring-2 focus:ring-[#5e6ad2]/20"
          autoFocus
        />
      </div>
      
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full rounded-lg bg-[#5e6ad2] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#7170ff] hover:shadow-lg hover:shadow-[#5e6ad2]/20 disabled:opacity-50"
      >
        {loading ? '验证中...' : '进入工具套件'}
      </button>
    </form>
  )
}

export default function LoginPageClient() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090a] p-4">
      <div className="pointer-events-none fixed inset-0 opacity-20"
           style={{backgroundImage: 'radial-gradient(circle, rgba(94,106,210,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] text-2xl text-white shadow-lg">
            ✦
          </div>
          <h1 className="text-2xl font-bold text-white">AgentClaw</h1>
          <p className="mt-2 text-sm text-zinc-500">输入密码访问工具套件</p>
        </div>
        
        <Suspense fallback={<div className="text-center text-zinc-500 py-4">加载中...</div>}>
          <LoginForm />
        </Suspense>
        
        <p className="mt-6 text-center text-xs text-zinc-600">
          仅限授权演示使用 · AgentClaw Tools
        </p>
      </div>
    </main>
  )
}
