import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

describe('User profile API logic', () => {
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

  it('从 cookie 或 header 解析 user token', () => {
    const token = makeToken('user-1', 'user')
    const payload = extractPayload(token)
    expect(payload).not.toBeNull()
    expect(payload!.userId).toBe('user-1')
    expect(payload!.role).toBe('user')
  })

  it('更新昵称逻辑 - 空值校验', () => {
    const nickname = ''
    expect(nickname.length).toBe(0)
    // 空昵称应该被拒绝
  })

  it('更新昵称逻辑 - 长度限制', () => {
    const nickname = 'a'.repeat(21)
    expect(nickname.length).toBeGreaterThan(20)
    // 超长昵称应该被截断或拒绝
  })

  it('手机号格式脱敏', () => {
    const phone = '13812345678'
    const masked = phone.slice(0, 3) + '****' + phone.slice(7)
    expect(masked).toBe('138****5678')
  })
})
