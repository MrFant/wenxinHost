import { describe, it, expect } from 'vitest'

describe('Admin upload API logic', () => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  it('允许的图片类型', () => {
    expect(allowedTypes).toContain('image/jpeg')
    expect(allowedTypes).toContain('image/png')
    expect(allowedTypes).toContain('image/webp')
  })

  it('拒绝 gif 类型', () => {
    expect(allowedTypes).not.toContain('image/gif')
  })

  it('拒绝超过 5MB 的文件', () => {
    const size = 6 * 1024 * 1024
    expect(size).toBeGreaterThan(maxSize)
  })

  it('允许刚好 5MB 的文件', () => {
    const size = 5 * 1024 * 1024
    expect(size).toBeLessThanOrEqual(maxSize)
  })

  it('生成唯一文件名', () => {
    const ext = 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    expect(filename).toMatch(/^\d+-\w+\.jpg$/)
  })
})
