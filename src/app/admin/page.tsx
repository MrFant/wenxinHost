import { prisma } from '@/lib/prisma'
import { BookOpen, ShoppingCart, Users, DollarSign } from 'lucide-react'

export default async function AdminDashboard() {
  const [courseCount, orderCount, userCount, revenue] = await Promise.all([
    prisma.course.count(),
    prisma.order.count({ where: { status: 'paid' } }),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    }),
  ])

  const stats = [
    {
      title: '总课程数',
      value: courseCount,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: '已付款订单',
      value: orderCount,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: '注册用户',
      value: userCount,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: '总收入',
      value: `¥${revenue._sum.amount || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ]

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { phone: true, nickname: true } },
      course: { select: { title: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">数据概览</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{stat.title}</span>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">最近订单</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-500">订单ID</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">用户</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">课程</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">金额</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">时间</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="p-4 text-sm">{order.user.nickname || order.user.phone}</td>
                  <td className="p-4 text-sm">{order.course.title}</td>
                  <td className="p-4 text-sm font-medium">¥{order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status === 'paid' ? '已付款' : order.status === 'pending' ? '待支付' : order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    暂无订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
