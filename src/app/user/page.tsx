'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, BookOpen, ShoppingCart, Save, Loader2, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserProfile {
  id: string
  phone: string
  nickname: string
  avatar: string | null
  role: string
  createdAt: string
}

export default function UserCenterPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setNickname(data.user.nickname)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!nickname.trim()) return
    setSaving(true)
    setMsg('')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      })
      const data = await res.json()

      if (res.ok) {
        setUser((prev) => prev ? { ...prev, nickname: data.user.nickname } : prev)
        setMsg('保存成功')
      } else {
        setMsg(data.error || '保存失败')
      }
    } catch {
      setMsg('保存失败')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/user/courses"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-medium">我的课程</p>
            <p className="text-sm text-gray-500">已购买的课程</p>
          </div>
        </Link>
        <Link
          href="/user/orders"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <ShoppingCart className="h-8 w-8 text-green-600" />
          <div>
            <p className="font-medium">我的订单</p>
            <p className="text-sm text-gray-500">查看订单记录</p>
          </div>
        </Link>
      </div>

      {/* 个人信息 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          个人信息
        </h2>

        <div className="space-y-4">
          {/* 头像 */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-medium">{user.nickname}</p>
              <p className="text-sm text-gray-500">头像</p>
            </div>
          </div>

          {/* 手机号 */}
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm">
              {user.phone.slice(0, 3)}****{user.phone.slice(7)}
            </span>
          </div>

          {/* 昵称编辑 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">昵称</label>
            <div className="flex gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="请输入昵称"
                className="flex-1"
              />
              <Button onClick={handleSave} disabled={saving || !nickname.trim()}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                保存
              </Button>
            </div>
            {msg && (
              <p className={`text-sm mt-1 ${msg.includes('成功') ? 'text-green-600' : 'text-red-500'}`}>
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
