import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 })
    }

    const { chapterId } = await params

    const progress = await prisma.progress.findUnique({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId,
        },
      },
    })

    return NextResponse.json({
      watchedSec: progress?.watchedSec || 0,
      completed: progress?.completed || false,
    })
  } catch {
    return NextResponse.json({ error: '获取进度失败' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 })
    }

    const { chapterId } = await params
    const { watchedSec, completed } = await request.json()

    await prisma.progress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId,
        },
      },
      update: {
        watchedSec: Math.max(watchedSec || 0, 0),
        completed: completed || false,
      },
      create: {
        userId: user.id,
        chapterId,
        watchedSec: watchedSec || 0,
        completed: completed || false,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '保存进度失败' }, { status: 500 })
  }
}
