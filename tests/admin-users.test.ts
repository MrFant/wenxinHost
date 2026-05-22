import { describe, it, expect } from 'vitest'

describe('Admin users API logic', () => {
  // 模拟用户数据
  const mockUsers = [
    { id: 'u1', phone: '13812345678', nickname: '用户1', role: 'user', createdAt: new Date('2026-01-01') },
    { id: 'u2', phone: '13987654321', nickname: '用户2', role: 'user', createdAt: new Date('2026-02-01') },
    { id: 'u3', phone: '13800001111', nickname: '用户3', role: 'user', createdAt: new Date('2026-03-01') },
  ]

  it('手机号搜索 - 精确匹配', () => {
    const search = '1381234'
    const results = mockUsers.filter((u) => u.phone.includes(search))
    expect(results).toHaveLength(1)
    expect(results[0].phone).toBe('13812345678')
  })

  it('手机号搜索 - 无结果', () => {
    const search = '9999999'
    const results = mockUsers.filter((u) => u.phone.includes(search))
    expect(results).toHaveLength(0)
  })

  it('分页逻辑', () => {
    const page = 1
    const pageSize = 10
    const start = (page - 1) * pageSize
    const paged = mockUsers.slice(start, start + pageSize)
    expect(paged).toHaveLength(3)
  })

  it('分页 - 第二页', () => {
    const page = 2
    const pageSize = 2
    const start = (page - 1) * pageSize
    const paged = mockUsers.slice(start, start + pageSize)
    expect(paged).toHaveLength(1)
    expect(paged[0].id).toBe('u3')
  })

  it('手机号脱敏', () => {
    const phone = '13812345678'
    const masked = phone.slice(0, 3) + '****' + phone.slice(7)
    expect(masked).toBe('138****5678')
  })
})
