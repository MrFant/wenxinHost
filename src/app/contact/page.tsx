import { Mail, MessageCircle, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">联系我们</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          有任何问题或建议，欢迎随时联系我们
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">邮箱</h3>
          <p className="text-sm text-gray-500">admin@wenxin.host</p>
          <p className="text-xs text-gray-400 mt-1">工作日 24 小时内回复</p>
        </div>

        <div className="text-center p-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-7 w-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">微信公众号</h3>
          <p className="text-sm text-gray-500">文心课堂</p>
          <p className="text-xs text-gray-400 mt-1">关注获取最新课程动态</p>
        </div>

        <div className="text-center p-6">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-7 w-7 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">工作时间</h3>
          <p className="text-sm text-gray-500">周一至周五</p>
          <p className="text-xs text-gray-400 mt-1">9:00 - 18:00</p>
        </div>
      </div>
    </div>
  )
}
