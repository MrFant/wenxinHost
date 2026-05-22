'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, UserX, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface UserItem {
  id: string
  phone: string
  nickname: string
  avatar: string | null
  role: string
  createdAt: string
  orderCount: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchUsers = (p: number, s: string) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), pageSize: String(pageSize) })
    if (s) params.set('search', s)

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchUsers(1, search)
  }

  const toggleUser = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'disabled' ? 'user' : 'disabled'
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>

      {/* 搜索栏 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索手机号..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      {/* 用户表格 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 py-12">没有找到用户</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">手机号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">昵称</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">注册时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">订单数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {user.phone.slice(0, 3)}****{user.phone.slice(7)}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.nickname}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.orderCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'disabled' ? 'destructive' : 'default'}>
                      {user.role === 'disabled' ? '已禁用' : '正常'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleUser(user.id, user.role)}
                    >
                      {user.role === 'disabled' ? (
                        <UserCheck className="h-4 w-4 mr-1" />
                      ) : (
                        <UserX className="h-4 w-4 mr-1" />
                      )}
                      {user.role === 'disabled' ? '启用' : '禁用'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}
