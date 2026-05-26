'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VideoUploaderProps {
  value?: string
  onChange?: (url: string) => void
  accept?: string
}

const MAX_SIZE_MB = 500

export function VideoUploader({ value, onChange }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null)
      setUploading(true)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append('file', file)

        // Use XMLHttpRequest for progress tracking
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/admin/upload/video')
          xhr.withCredentials = true

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100))
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText)
              resolve(data.url)
            } else {
              const data = JSON.parse(xhr.responseText)
              reject(new Error(data.error || '上传失败'))
            }
          })

          xhr.addEventListener('error', () => reject(new Error('网络错误')))
          xhr.send(formData)
        })

        onChange?.(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : '上传失败')
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [onChange]
  )

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`文件不能超过 ${MAX_SIZE_MB}MB`)
      return
    }
    uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleClear = () => {
    onChange?.('')
    setError(null)
  }

  // Show existing video
  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-lg border overflow-hidden bg-black">
          <video
            src={value}
            controls
            className="w-full max-h-[300px] object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Input
          value={value}
          readOnly
          className="text-xs text-muted-foreground"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-lg p-8 cursor-pointer
          transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                上传中... {progress}%
              </p>
            </div>
          </>
        ) : (
          <>
            <Film className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                点击选择或拖拽视频文件到此处
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                支持 MP4, WebM, MOV，最大 {MAX_SIZE_MB}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
