import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expected = process.env.TOOLS_PASSWORD || 'Sally'
  
  if (password === expected) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('tools_token', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  }
  
  return NextResponse.json({ error: '密码错误' }, { status: 401 })
}
