import { NextRequest, NextResponse } from 'next/server'
import { verifySmsCode, generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ error: '手机号和验证码不能为空' }, { status: 400 })
    }

    if (!verifySmsCode(phone, code)) {
      return NextResponse.json({ error: '验证码错误或已过期' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          nickname: `用户${phone.slice(-4)}`,
        },
      })
    }

    const token = generateToken(user.id, user.role)

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    })

    // 设置 httpOnly cookie，middleware 可以读取
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 天
      path: '/',
    })

    return res
  } catch {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
