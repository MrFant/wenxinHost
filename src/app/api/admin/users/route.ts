import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

function checkAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return false
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string }
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10')))
    const search = searchParams.get('search') || ''

    const where = search
      ? { phone: { contains: search } }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          phone: true,
          nickname: true,
          avatar: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users: users.map((u) => ({
        ...u,
        orderCount: u._count.orders,
        _count: undefined,
      })),
      total,
      page,
      pageSize,
    })
  } catch {
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}
