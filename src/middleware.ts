import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOOL_PATHS = ['/axiom', '/forge', '/blaze', '/hunter', '/mist', '/lens', '/pulse', '/growth', '/cascade', '/compass', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth for login page itself, api endpoints, homepage, content pages
  const isToolPage = ['/axiom', '/forge', '/blaze', '/hunter', '/mist', '/lens', '/pulse', '/growth', '/cascade', '/compass'].some(p => 
    pathname === p || pathname.startsWith(p + '/')
  )
  if (!isToolPage) return NextResponse.next()
  
  const token = request.cookies.get('tools_token')?.value
  const password = process.env.TOOLS_PASSWORD || 'Sally'
  
  if (token !== password) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Cookie renewal: extend lifetime on every valid tool page visit
  const response = NextResponse.next()
  response.cookies.set('tools_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days, rolling renewal
    path: '/',
  })
  return response
}

export const config = {
  matcher: ['/axiom/:path*', '/forge/:path*', '/blaze/:path*', '/hunter/:path*', '/mist/:path*', '/lens/:path*', '/pulse/:path*', '/growth/:path*', '/cascade/:path*', '/compass/:path*']
}
