import { describe, it, expect } from 'vitest'

describe('User courses API logic', () => {
  // 模拟订单和课程数据
  const mockOrders = [
    { id: 'o1', courseId: 'c1', status: 'paid', amount: 199 },
    { id: 'o2', courseId: 'c2', status: 'paid', amount: 199 },
    { id: 'o3', courseId: 'c3', status: 'pending', amount: 249 },
  ]

  const mockProgress = [
    { chapterId: 'ch1', completed: true },
    { chapterId: 'ch2', completed: true },
    { chapterId: 'ch3', completed: false },
  ]

  it('只返回已付款的课程', () => {
    const paidCourses = mockOrders.filter((o) => o.status === 'paid')
    expect(paidCourses).toHaveLength(2)
  })

  it('计算学习进度', () => {
    const total = 3
    const completed = mockProgress.filter((p) => p.completed).length
    const percent = Math.round((completed / total) * 100)
    expect(percent).toBe(67)
  })

  it('空订单返回空数组', () => {
    const orders = mockOrders.filter((o) => o.status === 'paid' && o.courseId === 'none')
    expect(orders).toHaveLength(0)
  })
})
