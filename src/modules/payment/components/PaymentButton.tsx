'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PaymentButtonProps {
  orderId: string
  onSuccess?: () => void
}

export function PaymentButton({ orderId, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/payments/wechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '支付失败')
      }

      const data = await res.json()

      // 跳转到微信支付页面
      if (data.h5_url) {
        window.location.href = data.h5_url
      }

      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '支付中...' : '立即支付'}
      </Button>
    </div>
  )
}
