import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    if (payload.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, role: true },
    })

    if (!admin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch {
    return NextResponse.json({ error: '登录已过期' }, { status: 401 })
  }
}
