import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createH5Payment } from '@/lib/wechat-pay'

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

    const { orderId } = await request.json()

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    })

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ error: '订单状态异常' }, { status: 400 })
    }

    // Create WeChat H5 payment
    const payment = await createH5Payment({
      orderId: order.id,
      amount: order.amount * 100, // Convert to cents
      description: `文心课堂 - ${order.course.title}`,
      userId: user.id,
    })

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: 'wechat_h5',
        amount: order.amount,
        wxPrepayId: payment.prepay_id,
      },
    })

    return NextResponse.json({
      h5_url: payment.h5_url,
      orderId: order.id,
    })
  } catch (err) {
    console.error('Payment error:', err)
    return NextResponse.json({ error: '支付创建失败' }, { status: 500 })
  }
}
