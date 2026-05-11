import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 })
    }

    const { courseId } = await request.json()

    // Check course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'published' },
    })
    if (!course) {
      return NextResponse.json({ error: '课程不存在' }, { status: 404 })
    }

    // Check if already purchased
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        courseId,
        status: 'paid',
      },
    })
    if (existingOrder) {
      return NextResponse.json({ error: '您已购买此课程' }, { status: 400 })
    }

    // Check for pending order
    const pendingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        courseId,
        status: 'pending',
      },
    })
    if (pendingOrder) {
      return NextResponse.json({ orderId: pendingOrder.id, amount: pendingOrder.amount })
    }

    // Create new order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        courseId,
        amount: course.price,
        status: 'pending',
      },
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch {
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 })
  }
}
