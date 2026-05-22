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

// GET: 获取课程评价列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reviews = await prisma.review.findMany({
      where: { courseId: id },
      include: {
        user: {
          select: { id: true, nickname: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // 计算平均评分
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      total: reviews.length,
    })
  } catch {
    return NextResponse.json({ error: '获取评价失败' }, { status: 500 })
  }
}

// POST: 提交评价
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { id: courseId } = await params
    const { rating, content } = await request.json()

    // 校验评分
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: '评分必须是 1-5 的整数' }, { status: 400 })
    }

    // 校验内容
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: '评价内容不能为空' }, { status: 400 })
    }
    if (content.length > 500) {
      return NextResponse.json({ error: '评价最多500字' }, { status: 400 })
    }

    // 检查是否已购买
    const order = await prisma.order.findFirst({
      where: { userId, courseId, status: 'paid' },
    })
    if (!order) {
      return NextResponse.json({ error: '只有购买过课程才能评价' }, { status: 403 })
    }

    // 检查是否已评价
    const existing = await prisma.review.findFirst({
      where: { userId, courseId },
    })
    if (existing) {
      return NextResponse.json({ error: '您已经评价过此课程' }, { status: 400 })
    }

    // 创建评价
    const review = await prisma.review.create({
      data: {
        userId,
        courseId,
        rating,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, nickname: true, avatar: true },
        },
      },
    })

    return NextResponse.json({ review })
  } catch {
    return NextResponse.json({ error: '提交评价失败' }, { status: 500 })
  }
}
