import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, phone: true, nickname: true } },
        course: { select: { id: true, title: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
