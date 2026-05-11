'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')

    try {
      const res = await fetch('/api/auth/sms-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setCodeSent(true)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      setError('发送失败，请重试')
    }
  }

  const handleLogin = async () => {
    if (!code || code.length !== 6) {
      setError('请输入6位验证码')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/sms-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      // Save token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect
      router.push('/')
    } catch {
      setError('登录失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">登录文心课堂</h1>
          <p className="text-gray-500 mt-2">使用手机号验证码登录</p>
        </div>

        <div className="space-y-4">
          {/* Phone Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">手机号</label>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={sendCode}
                disabled={countdown > 0}
                className="whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </div>
          </div>

          {/* Code Input */}
          {codeSent && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">验证码</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="请输入6位验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="pl-10 text-center text-lg tracking-widest"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                开发模式：验证码已打印到服务器控制台
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Login Button */}
          {codeSent && (
            <Button
              className="w-full"
              size="lg"
              onClick={handleLogin}
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
