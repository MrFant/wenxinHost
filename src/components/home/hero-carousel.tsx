'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    title: '前端开发',
    subtitle: '从零搭建你的第一个网站',
    desc: 'HTML/CSS/React 实战，学完就能接单',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 2,
    title: 'AI 人工智能',
    subtitle: '不神秘，从零开始学',
    desc: '用最通俗的语言理解 AI 核心原理',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: 3,
    title: 'UI 设计',
    subtitle: '从审美到落地',
    desc: '设计思维 + Figma 实战，做出专业级界面',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 4,
    title: '项目管理',
    subtitle: '从小白到项目经理',
    desc: '需求分析、进度管控、团队协作一站搞定',
    gradient: 'from-orange-500 to-red-500',
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [])

  // 自动切换
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const slide = slides[current]

  return (
    <section
      className={`relative bg-gradient-to-br ${slide.gradient} text-white overflow-hidden transition-colors duration-700`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
        <p className="text-sm md:text-base text-white/70 mb-2">{slide.subtitle}</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          {slide.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
            <Link href="/courses">浏览课程</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </div>

      {/* 左右箭头 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 底部指示点 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
