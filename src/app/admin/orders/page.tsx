'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  amount: number
  status: string
  createdAt: string
  user: { id: string; phone: string; nickname: string }
  course: { id: string; title: string }
}

const statusFilters = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已付款' },
  { value: 'refunded', label: '已退款' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    })
    fetchOrders()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map((filter) => (
          <Badge
            key={filter.value}
            variant={statusFilter === filter.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500">订单ID</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">用户</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">课程</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">金额</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">状态</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">时间</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                <td className="p-4 text-sm">{order.user.nickname || order.user.phone}</td>
                <td className="p-4 text-sm">{order.course.title}</td>
                <td className="p-4 text-sm font-medium">¥{order.amount}</td>
                <td className="p-4">
                  <Badge
                    variant={
                      order.status === 'paid'
                        ? 'default'
                        : order.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {order.status === 'paid' ? '已付款' : order.status === 'pending' ? '待支付' : order.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('zh-CN')}
                </td>
                <td className="p-4">
                  {order.status === 'paid' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(order.id, 'refunded')}
                    >
                      退款
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  {loading ? '加载中...' : '暂无订单'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
