'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OrderForm } from '@/modules/payment'
import type { CheckoutData } from '@/modules/payment'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [courseData, setCourseData] = useState<CheckoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        if (!res.ok) {
          throw new Error('课程不存在')
        }
        const data = await res.json()
        setCourseData({
          courseId: data.id,
          amount: data.price,
          description: data.title,
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || '课程不存在'}</p>
        <button onClick={() => router.back()}>返回</button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">课程购买</h1>
      <OrderForm
        data={courseData}
        onSuccess={(orderId) => {
          router.push(`/checkout/${courseId}?order=${orderId}`)
        }}
      />
    </div>
  )
}
