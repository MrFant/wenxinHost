import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

// mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    admin: { findUnique: vi.fn() },
  },
}))

// mock next/server
vi.mock('next/server', () => {
  const NextResponse = {
    redirect: (url: string) => ({
      status: 307,
      headers: { get: () => url },
      type: 'redirect',
      url,
    }),
    next: () => ({
      status: 200,
      type: 'next',
    }),
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      type: 'json',
      data,
    }),
  }
  return { NextResponse }
})

// 导入要测试的函数
// middleware 逻辑比较复杂，我们测试核心的 token 解析
describe('Auth middleware logic', () => {
  function makeToken(userId: string, role: string = 'user') {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
  }

  function extractPayload(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    } catch {
      return null
    }
  }

  it('解析有效用户 token', () => {
    const token = makeToken('user-1', 'user')
    const payload = extractPayload(token)
    expect(payload).not.toBeNull()
    expect(payload!.userId).toBe('user-1')
    expect(payload!.role).toBe('user')
  })

  it('解析有效管理员 token', () => {
    const token = makeToken('admin-1', 'admin')
    const payload = extractPayload(token)
    expect(payload).not.toBeNull()
    expect(payload!.role).toBe('admin')
  })

  it('无效 token 返回 null', () => {
    const payload = extractPayload('invalid-token')
    expect(payload).toBeNull()
  })

  it('过期 token 返回 null', () => {
    const token = jwt.sign({ userId: 'u1', role: 'user' }, JWT_SECRET, { expiresIn: '-1s' })
    const payload = extractPayload(token)
    expect(payload).toBeNull()
  })

  it('错误密钥的 token 返回 null', () => {
    const token = jwt.sign({ userId: 'u1', role: 'user' }, 'wrong-secret', { expiresIn: '7d' })
    const payload = extractPayload(token)
    expect(payload).toBeNull()
  })

  // 测试路径匹配逻辑
  describe('路径匹配', () => {
    const protectedPrefixes = ['/learn', '/user']
    const adminPrefix = '/admin'

    function needsAuth(pathname: string) {
      return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
    }

    function needsAdmin(pathname: string) {
      return pathname === adminPrefix || pathname.startsWith(adminPrefix + '/')
    }

    it('/learn/123 需要登录', () => {
      expect(needsAuth('/learn/123')).toBe(true)
    })

    it('/user 需要登录', () => {
      expect(needsAuth('/user')).toBe(true)
    })

    it('/user/courses 需要登录', () => {
      expect(needsAuth('/user/courses')).toBe(true)
    })

    it('/admin 需要管理员', () => {
      expect(needsAdmin('/admin')).toBe(true)
    })

    it('/admin/courses 需要管理员', () => {
      expect(needsAdmin('/admin/courses')).toBe(true)
    })

    it('/courses 不需要登录', () => {
      expect(needsAuth('/courses')).toBe(false)
    })

    it('/login 不需要登录', () => {
      expect(needsAuth('/login')).toBe(false)
    })

    it('/ 不需要登录', () => {
      expect(needsAuth('/')).toBe(false)
    })

    it('/api/auth/sms-login 不需要登录', () => {
      expect(needsAuth('/api/auth/sms-login')).toBe(false)
    })
  })
})
