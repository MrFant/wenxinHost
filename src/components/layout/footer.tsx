import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const courseLinks = [
  { href: '/courses?category=编程开发', label: '编程开发' },
  { href: '/courses?category=人工智能', label: '人工智能' },
  { href: '/courses?category=设计创意', label: '设计创意' },
  { href: '/courses?category=职场技能', label: '职场技能' },
]

const infoLinks = [
  { href: '/about', label: '关于我们' },
  { href: '/contact', label: '联系方式' },
  { href: '/privacy', label: '隐私政策' },
  { href: '/terms', label: '服务条款' },
]

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>文心课堂</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              让学习更简单。优质在线课程，助你提升技能，实现职业突破。
            </p>
          </div>

          {/* Course Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">课程分类</h3>
            <ul className="space-y-2">
              {courseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">关于</h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>邮箱：admin@wenxin.host</li>
              <li>微信公众号：文心课堂</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} 文心课堂 All rights reserved.
        </div>
      </div>
    </footer>
  )
}
