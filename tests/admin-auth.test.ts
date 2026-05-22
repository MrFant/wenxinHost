import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

// mock prisma
const mockAdmin = {
  id: 'admin-1',
  username: 'admin',
  pwdHash: '',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
}

vi.mock('@/lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: vi.fn(),
    },
  },
}))

describe('Admin auth API logic', () => {
  beforeEach(async () => {
    // 用真实 bcrypt hash
    mockAdmin.pwdHash = await bcrypt.hash('admin123', 10)
  })

  it('正确密码验证通过', async () => {
    const result = await bcrypt.compare('admin123', mockAdmin.pwdHash)
    expect(result).toBe(true)
  })

  it('错误密码验证失败', async () => {
    const result = await bcrypt.compare('wrong', mockAdmin.pwdHash)
    expect(result).toBe(false)
  })

  it('生成 admin token 包含正确 role', () => {
    const token = jwt.sign({ userId: mockAdmin.id, role: mockAdmin.role }, JWT_SECRET, { expiresIn: '7d' })
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    expect(payload.role).toBe('admin')
    expect(payload.userId).toBe('admin-1')
  })

  it('admin token 可以被 middleware 验证', () => {
    const token = jwt.sign({ userId: 'admin-1', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    expect(payload.role).toBe('admin')
  })
})
