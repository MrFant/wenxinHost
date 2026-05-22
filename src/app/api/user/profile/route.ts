import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

function getUser(request: NextRequest) {
  // 先尝试 cookie，再尝试 header
  const token = request.cookies.get('token')?.value
    || request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = getUser(request)
    if (!payload) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, phone: true, nickname: true, avatar: true, role: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = getUser(request)
    if (!payload) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { nickname } = await request.json()

    if (!nickname || nickname.trim().length === 0) {
      return NextResponse.json({ error: '昵称不能为空' }, { status: 400 })
    }

    if (nickname.length > 20) {
      return NextResponse.json({ error: '昵称最多20个字符' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: { nickname: nickname.trim() },
      select: { id: true, phone: true, nickname: true, avatar: true },
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
