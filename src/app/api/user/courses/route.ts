import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value
    || request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    return payload.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    // 查询已付款的订单，关联课程和章节
    const orders = await prisma.order.findMany({
      where: { userId, status: 'paid' },
      include: {
        course: {
          include: {
            chapters: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // 查询用户的学习进度
    const progress = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { chapterId: true },
    })
    const completedChapterIds = new Set(progress.map((p) => p.chapterId))

    // 组装返回数据
    const courses = orders.map((order) => {
      const course = order.course
      const totalChapters = course.chapters.length
      const completedChapters = course.chapters.filter((ch) =>
        completedChapterIds.has(ch.id)
      ).length

      return {
        courseId: course.id,
        title: course.title,
        cover: course.cover,
        totalChapters,
        completedChapters,
        progress: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      }
    })

    return NextResponse.json({ courses })
  } catch {
    return NextResponse.json({ error: '获取课程列表失败' }, { status: 500 })
  }
}
