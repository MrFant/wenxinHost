'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderItem {
  id: string
  amount: number
  status: string
  createdAt: string
  course: {
    id: string
    title: string
    cover: string | null
  }
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: '待支付', variant: 'destructive' },
  paid: { label: '已完成', variant: 'default' },
  refunded: { label: '已退款', variant: 'secondary' },
  cancelled: { label: '已取消', variant: 'outline' },
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/orders')
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/user" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">我的订单</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">还没有订单</p>
          <Link href="/courses">
            <Button>去选课</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const st = statusConfig[order.status] || { label: order.status, variant: 'outline' as const }
            return (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                  {/* 课程封面 */}
                  <div className="w-20 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {order.course.cover ? (
                      <img src={order.course.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 订单信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{order.course.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>

                  {/* 金额和状态 */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg">¥{order.amount}</p>
                    <Badge variant={st.variant} className="mt-1">
                      {st.label}
                    </Badge>
                  </div>
                </div>

                {/* 待支付显示去支付按钮 */}
                {order.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Link href={`/checkout/${order.course.id}`}>
                      <Button size="sm">去支付</Button>
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
