'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Course {
  id: string
  title: string
  price: number
  category: string
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        if (!res.ok) throw new Error('课程不存在')
        const data = await res.json()
        setCourse(data)
      } catch (err) {
        setError('课程加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  // Poll order status
  useEffect(() => {
    if (!orderId || paymentStatus !== 'pending') return

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        if (data.status === 'paid') {
          setPaymentStatus('success')
          clearInterval(poll)
        }
      } catch {}
    }, 3000)

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(poll)
      setPaymentStatus('failed')
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(poll)
      clearTimeout(timeout)
    }
  }, [orderId, paymentStatus])

  const handlePay = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setPaying(true)
    setError('')

    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      })
      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        setError(orderData.error)
        setPaying(false)
        return
      }

      setOrderId(orderData.orderId)

      // Initiate WeChat payment
      const payRes = await fetch('/api/payments/wechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: orderData.orderId }),
      })
      const payData = await payRes.json()

      if (!payRes.ok) {
        setError(payData.error)
        setPaying(false)
        return
      }

      // Redirect to WeChat H5 payment
      setPaymentStatus('pending')
      window.location.href = payData.h5_url
    } catch {
      setError('支付请求失败')
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">{error || '课程不存在'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">确认购买</h1>

        {/* Order Summary */}
        <div className="rounded-xl border bg-white p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">{course.title}</h2>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>分类</span>
            <span>{course.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>有效期</span>
            <span>永久有效</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">应付金额</span>
              <span className="text-3xl font-bold text-red-500">¥{course.price}</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus === 'success' && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center mb-4">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">支付成功！</p>
            <Button className="mt-3" onClick={() => router.push(`/learn/${courseId}`)}>
              开始学习
            </Button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-4">
            <XCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">支付超时或失败</p>
            <Button variant="outline" className="mt-3" onClick={() => setPaymentStatus('idle')}>
              重新支付
            </Button>
          </div>
        )}

        {/* Pay Button */}
        {paymentStatus === 'idle' && (
          <Button
            className="w-full"
            size="lg"
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              `微信支付 ¥${course.price}`
            )}
          </Button>
        )}

        {/* Dev mode note */}
        <p className="text-xs text-gray-400 text-center mt-4">
          开发模式：点击支付后将跳转到模拟页面
        </p>
      </div>
    </div>
  )
}
