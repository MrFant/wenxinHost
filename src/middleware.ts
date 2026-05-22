import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

// 需要登录的路径
const protectedPaths = ['/learn', '/user']
// 需要管理员的路径
const adminPaths = ['/admin']

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

function matchPath(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源和 API 路由（API 路由自己做鉴权）
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // 静态文件
  ) {
    return NextResponse.next()
  }

  // 从 cookie 获取 token
  const token = request.cookies.get('token')?.value
  const payload = token ? verifyToken(token) : null

  // 检查需要登录的页面
  if (matchPath(pathname, protectedPaths)) {
    if (!payload) {
      console.log('[Proxy] 未登录，跳转到登录页:', pathname)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 检查管理员路径
  if (matchPath(pathname, adminPaths)) {
    // /admin/login 不需要检查
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    if (!payload) {
      console.log('[Proxy] 管理员未登录，跳转:', pathname)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (payload.role !== 'admin') {
      console.log('[Proxy] 非管理员访问:', pathname, payload.role)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/learn/:path*', '/user/:path*', '/admin/:path*'],
}
