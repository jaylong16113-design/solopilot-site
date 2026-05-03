import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOOL_PATHS = ['/axiom', '/forge', '/blaze', '/hunter', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth for login page itself, api endpoints, homepage, content pages
  const isToolPage = ['/axiom', '/forge', '/blaze', '/hunter'].some(p => 
    pathname === p || pathname.startsWith(p + '/')
  )
  if (!isToolPage) return NextResponse.next()
  
  const token = request.cookies.get('tools_token')?.value
  const password = process.env.TOOLS_PASSWORD || 'agentclaw2026'
  
  if (token !== password) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/axiom/:path*', '/forge/:path*', '/blaze/:path*', '/hunter/:path*']
}
