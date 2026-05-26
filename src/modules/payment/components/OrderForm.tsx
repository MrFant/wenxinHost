'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CheckoutData } from '../types'

interface OrderFormProps {
  data: CheckoutData
  onSuccess: (orderId: string) => void
}

export function OrderForm({ data, onSuccess }: OrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: data.courseId,
        }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || '创建订单失败')
      }

      const result = await res.json()
      onSuccess(result.orderId)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '创建订单失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold mb-4">订单确认</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-500">课程名称</span>
          <span className="font-medium">{data.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">支付金额</span>
          <span className="text-xl font-bold text-red-500">¥{data.amount}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '创建订单中...' : '确认支付'}
      </Button>
    </div>
  )
}
