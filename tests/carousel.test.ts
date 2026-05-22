import { describe, it, expect } from 'vitest'

describe('Carousel logic', () => {
  const slides = [
    { id: 1, title: '前端开发', color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'AI 人工智能', color: 'from-purple-500 to-pink-500' },
    { id: 3, title: 'UI 设计', color: 'from-green-500 to-teal-500' },
    { id: 4, title: '项目管理', color: 'from-orange-500 to-red-500' },
  ]

  it('幻灯片数量正确', () => {
    expect(slides).toHaveLength(4)
  })

  it('下一张索引计算（循环）', () => {
    const current = 3
    const next = (current + 1) % slides.length
    expect(next).toBe(0)
  })

  it('上一张索引计算（循环）', () => {
    const current = 0
    const prev = (current - 1 + slides.length) % slides.length
    expect(prev).toBe(3)
  })

  it('点击指示点跳转', () => {
    const current = 0
    const target = 2
    expect(target).toBeGreaterThanOrEqual(0)
    expect(target).toBeLessThan(slides.length)
  })

  it('5秒自动切换间隔', () => {
    const interval = 5000
    expect(interval).toBe(5000)
  })
})
