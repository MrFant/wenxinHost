import { BookOpen, Target, Users, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">关于文心课堂</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          让每个人都能获得优质的在线教育资源，用技术降低学习门槛
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-7 w-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">内容为王</h3>
          <p className="text-sm text-gray-500">精选行业名师，严控课程质量，每节课都有干货</p>
        </div>
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-7 w-7 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">实战驱动</h3>
          <p className="text-sm text-gray-500">不讲空洞理论，每节课都有代码产出和实战项目</p>
        </div>
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">社区互助</h3>
          <p className="text-sm text-gray-500">学员社群交流，助教答疑，一起学习更有动力</p>
        </div>
        <div className="text-center p-6">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-7 w-7 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">终身有效</h3>
          <p className="text-sm text-gray-500">一次购买永久观看，不限次数不限时间</p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">我们的故事</h2>
        <div className="prose prose-gray mx-auto">
          <p className="text-gray-600 leading-relaxed mb-4">
            文心课堂成立于 2026 年，初衷很简单：让优质的编程和技术教育不再昂贵和遥远。
            我们相信，好的教育应该是 accessible 的，不应该被价格或地域所限制。
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            我们的课程都经过精心设计，从零基础到进阶，每个知识点都配有实战练习。
            学完一门课，你不只是"知道"，而是真正"会做"。
          </p>
          <p className="text-gray-600 leading-relaxed">
            目前我们提供编程开发、人工智能、设计创意、职场技能等多个方向的课程，
            持续更新中。感谢每一位学员的信任，我们会继续努力提供更好的学习体验。
          </p>
        </div>
      </div>
    </div>
  )
}
