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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const { id } = await params
    const { role } = await request.json()

    if (!['user', 'disabled'].includes(role)) {
      return NextResponse.json({ error: '无效的角色' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, phone: true, nickname: true, role: true },
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
