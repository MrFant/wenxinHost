'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users, ShoppingCart, Settings, LogOut, Tags } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/admin', label: '数据概览', icon: LayoutDashboard },
  { href: '/admin/courses', label: '课程管理', icon: BookOpen },
  { href: '/admin/categories', label: '分类管理', icon: Tags },
  { href: '/admin/orders', label: '订单管理', icon: ShoppingCart },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/settings', label: '系统设置', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-6">
        <Link href="/admin" className="text-xl font-bold">
          文心课堂
        </Link>
        <p className="text-xs text-gray-400 mt-1">管理后台</p>
      </div>

      <Separator className="bg-gray-700 mb-4" />

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Separator className="bg-gray-700 mb-4" />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
          返回前台
        </Link>
      </div>
    </aside>
  )
}
