import { NextRequest, NextResponse } from 'next/server'
import { generateSmsCode, checkSmsRateLimit } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '请输入正确的手机号' }, { status: 400 })
    }

    if (!checkSmsRateLimit(phone)) {
      return NextResponse.json({ error: '验证码发送过于频繁，请稍后再试' }, { status: 429 })
    }

    const code = generateSmsCode(phone)

    // TODO: Integrate real SMS API (e.g., Aliyun SMS)
    // For now, code is logged to console
    console.log(`[DEV] SMS code for ${phone}: ${code}`)

    return NextResponse.json({ success: true, message: '验证码已发送' })
  } catch {
    return NextResponse.json({ error: '请求失败' }, { status: 500 })
  }
}
