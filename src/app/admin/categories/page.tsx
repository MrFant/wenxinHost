'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  sortOrder: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data)
    } catch {} finally {
      setLoading(false)
    }
  }

  // 新增分类
  const addCategory = async () => {
    if (!newName.trim()) return
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), sortOrder: categories.length }),
      })
      if (res.ok) {
        setNewName('')
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || '添加失败')
      }
    } catch {}
  }

  // 删除分类
  const deleteCategory = async (id: string) => {
    if (!confirm('确定删除此分类？')) return
    try {
      await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchCategories()
    } catch {}
  }

  // 上移
  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...categories]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    // 更新排序
    next.forEach((c, i) => { c.sortOrder = i })
    setCategories(next)
  }

  // 下移
  const moveDown = (index: number) => {
    if (index === categories.length - 1) return
    const next = [...categories]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    next.forEach((c, i) => { c.sortOrder = i })
    setCategories(next)
  }

  // 保存排序
  const saveOrder = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      })
    } catch {} finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>

      {/* 新增分类 */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold mb-4">添加分类</h2>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="输入分类名称"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <Button onClick={addCategory} disabled={!newName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="text-sm text-gray-500">拖动调整顺序，修改后点保存</span>
          <Button size="sm" onClick={saveOrder} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            保存排序
          </Button>
        </div>
        <div className="divide-y">
          {categories.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
              <GripVertical className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-400 w-8">{index + 1}</span>
              <Input
                value={cat.name}
                onChange={(e) => {
                  const next = [...categories]
                  next[index] = { ...next[index], name: e.target.value }
                  setCategories(next)
                }}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0}>
                ↑
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === categories.length - 1}>
                ↓
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-gray-400 py-8">暂无分类</p>
          )}
        </div>
      </div>
    </div>
  )
}
