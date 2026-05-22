import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

// 允许修改的设置 key
const allowedKeys = ['site_name', 'site_slogan', 'contact_email', 'wechat_mp_qrcode', 'icp_number']

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

    const settings = await prisma.setting.findMany()
    // 转成 key-value 对象
    const result: Record<string, string> = {}
    for (const s of settings) {
      result[s.key] = s.value
    }

    return NextResponse.json({ settings: result })
  } catch {
    return NextResponse.json({ error: '获取设置失败' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const data = await request.json()

    // 只允许更新白名单里的 key
    const updates: { key: string; value: string }[] = []
    for (const key of allowedKeys) {
      if (key in data) {
        updates.push({ key, value: String(data[key]) })
      }
    }

    // 批量 upsert
    for (const u of updates) {
      await prisma.setting.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '更新设置失败' }, { status: 500 })
  }
}
