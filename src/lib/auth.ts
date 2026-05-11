import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'wenxin-host-jwt-secret-change-in-production'

// In-memory SMS code store (use Redis in production)
const smsCodes = new Map<string, { code: string; expires: number }>()

export function generateSmsCode(phone: string): string {
  const code = Math.random().toString().slice(2, 8).padStart(6, '0')
  const expires = Date.now() + 5 * 60 * 1000 // 5 minutes
  smsCodes.set(phone, { code, expires })

  // TODO: Integrate real SMS API
  console.log(`[SMS] Sending code ${code} to ${phone}`)

  return code
}

export function verifySmsCode(phone: string, code: string): boolean {
  const stored = smsCodes.get(phone)
  if (!stored) return false
  if (Date.now() > stored.expires) {
    smsCodes.delete(phone)
    return false
  }
  if (stored.code !== code) return false
  smsCodes.delete(phone)
  return true
}

export function generateToken(userId: string, role: string = 'user'): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token)
  if (!payload) return null
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  return user
}

// Rate limiting for SMS
const smsRateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkSmsRateLimit(phone: string): boolean {
  const now = Date.now()
  const limit = smsRateLimit.get(phone)

  if (!limit || now > limit.resetAt) {
    smsRateLimit.set(phone, { count: 1, resetAt: now + 60 * 1000 })
    return true
  }

  if (limit.count >= 1) {
    return false // 1 per minute
  }

  limit.count++
  return true
}
