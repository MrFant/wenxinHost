import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = JSON.parse(body)

    // Verify signature (simplified for dev)
    // In production, use proper WeChat signature verification

    const { out_trade_no, transaction_id, trade_state } = data.resource || data

    if (trade_state === 'SUCCESS') {
      // Update order
      const order = await prisma.order.update({
        where: { id: out_trade_no },
        data: {
          status: 'paid',
          transactionId: transaction_id,
        },
      })

      // Update payment record
      await prisma.payment.update({
        where: { orderId: out_trade_no },
        data: {
          paidAt: new Date(),
        },
      })

      console.log(`[Payment] Order ${out_trade_no} paid successfully`)
    }

    // Return success to WeChat
    return NextResponse.json({ code: 'SUCCESS', message: 'OK' })
  } catch (err) {
    console.error('Payment notification error:', err)
    return NextResponse.json({ code: 'FAIL', message: '处理失败' }, { status: 500 })
  }
}
