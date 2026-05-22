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

// GET 获取章节练习题（不含答案，需登录 + 已购买）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { courseId, chapterId } = await params

  // 检查是否已购买
  const order = await prisma.order.findFirst({
    where: { userId, courseId, status: 'paid' },
  })
  if (!order) {
    return NextResponse.json({ error: '请先购买课程' }, { status: 403 })
  }

  // 获取练习题
  const quiz = await prisma.quiz.findUnique({
    where: { chapterId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          type: true,
          content: true,
          options: true,
          sortOrder: true,
          // 不返回答案
        },
      },
    },
  })

  if (!quiz || quiz.questions.length === 0) {
    return NextResponse.json({ error: '该章节暂无练习题' }, { status: 404 })
  }

  return NextResponse.json({
    quizId: quiz.id,
    title: quiz.title,
    total: quiz.questions.length,
    questions: quiz.questions.map(q => ({
      ...q,
      options: JSON.parse(q.options),
    })),
  })
}

// POST 提交答案
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { courseId, chapterId } = await params
  const body = await request.json()
  const { answers } = body // { questionId: "A", ... }

  // 检查是否已购买
  const order = await prisma.order.findFirst({
    where: { userId, courseId, status: 'paid' },
  })
  if (!order) {
    return NextResponse.json({ error: '请先购买课程' }, { status: 403 })
  }

  // 获取题目（含答案）
  const quiz = await prisma.quiz.findUnique({
    where: { chapterId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          type: true,
          content: true,
          options: true,
          answer: true,
          explanation: true,
          sortOrder: true,
        },
      },
    },
  })

  if (!quiz) {
    return NextResponse.json({ error: '练习不存在' }, { status: 404 })
  }

  // 计算结果
  let correct = 0
  const results = quiz.questions.map(q => {
    const userAnswer = answers?.[q.id] || ''
    const isCorrect = userAnswer === q.answer
    if (isCorrect) correct++

    return {
      id: q.id,
      type: q.type,
      content: q.content,
      options: JSON.parse(q.options),
      answer: q.answer,
      explanation: q.explanation,
      userAnswer,
      isCorrect,
    }
  })

  const total = quiz.questions.length
  const score = Math.round((correct / total) * 100)

  return NextResponse.json({
    score,
    correct,
    total,
    results,
  })
}
