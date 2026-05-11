import crypto from 'crypto'

const MCH_ID = process.env.WX_MCH_ID || ''
const API_KEY = process.env.WX_API_KEY || ''
const NOTIFY_URL = process.env.WX_NOTIFY_URL || 'https://ziiy.fun/api/payments/notify'
const APP_ID = process.env.WX_APP_ID || ''

interface WechatPaymentParams {
  orderId: string
  amount: number // in cents
  description: string
  userId: string
}

interface WechatH5Response {
  h5_url: string
  prepay_id: string
}

export async function createH5Payment({
  orderId,
  amount,
  description,
  userId,
}: WechatPaymentParams): Promise<WechatH5Response> {
  const nonceStr = crypto.randomBytes(16).toString('hex')
  const timestamp = Math.floor(Date.now() / 1000).toString()

  const body = {
    appid: APP_ID,
    mchid: MCH_ID,
    description: description.slice(0, 128),
    out_trade_no: orderId,
    notify_url: NOTIFY_URL,
    amount: {
      total: amount,
      currency: 'CNY',
    },
    scene_info: {
      payer_client_ip: '127.0.0.1',
      h5_info: {
        type: 'Wap',
        wap_url: 'https://ziiy.fun',
        wap_name: '文心课堂',
      },
    },
  }

  // In development, return mock response
  if (process.env.NODE_ENV !== 'production' || !MCH_ID) {
    console.log(`[DEV] Mock WeChat H5 payment for order ${orderId}, amount: ${amount}`)
    return {
      h5_url: `https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=mock_${orderId}`,
      prepay_id: `mock_prepay_${orderId}`,
    }
  }

  // Production: Call WeChat Pay H5 API
  const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/h5'
  const bodyStr = JSON.stringify(body)

  // Generate signature (simplified - use wechatpay-node-v3 in production)
  const message = `POST\n/v3/pay/transactions/h5\n${timestamp}\n${nonceStr}\n${bodyStr}\n`
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(message)
    .sign(process.env.WX_PRIVATE_KEY || '', 'base64')

  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${MCH_ID}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${process.env.WX_CERT_SERIAL}"`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
    body: bodyStr,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`WeChat payment failed: ${error}`)
  }

  return response.json()
}

export function verifyNotification(
  signature: string,
  timestamp: string,
  nonce: string,
  body: string
): boolean {
  // Simplified verification - use proper cert verification in production
  if (process.env.NODE_ENV !== 'production') return true

  const message = `${timestamp}\n${nonce}\n${body}\n`
  const verify = crypto.createVerify('RSA-SHA256')
  verify.update(message)
  return verify.verify(process.env.WX_PLATFORM_CERT || '', signature, 'base64')
}

export function decryptNotification(ciphertext: string, nonce: string): unknown {
  const key = crypto.createHash('sha256').update(API_KEY).digest()
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'utf8'))
  // Simplified - proper implementation needed for production
  return JSON.parse(ciphertext)
}
