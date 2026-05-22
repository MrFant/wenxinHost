'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SettingsData {
  site_name: string
  site_slogan: string
  contact_email: string
  wechat_mp_qrcode: string
  icp_number: string
}

const fields: { key: keyof SettingsData; label: string; placeholder: string }[] = [
  { key: 'site_name', label: '网站名称', placeholder: '文心课堂' },
  { key: 'site_slogan', label: '网站标语', placeholder: '让学习更简单' },
  { key: 'contact_email', label: '联系邮箱', placeholder: 'admin@example.com' },
  { key: 'wechat_mp_qrcode', label: '微信公众号二维码 URL', placeholder: 'https://...' },
  { key: 'icp_number', label: 'ICP 备案号', placeholder: '京ICP备xxxxxxxx号' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    site_name: '',
    site_slogan: '',
    contact_email: '',
    wechat_mp_qrcode: '',
    icp_number: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMsg('保存成功')
      } else {
        setMsg('保存失败')
      }
    } catch {
      setMsg('保存失败')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        系统设置
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
            <Input
              value={settings[f.key]}
              onChange={(e) => setSettings((prev) => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            保存
          </Button>
          {msg && (
            <span className={`text-sm ${msg.includes('成功') ? 'text-green-600' : 'text-red-500'}`}>
              {msg}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
