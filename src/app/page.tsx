import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap, Shield, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "优质课程",
    desc: "名师授课，从零基础到高级进阶，体系化学习路径",
  },
  {
    icon: Zap,
    title: "实战驱动",
    desc: "每节课都有代码产出，学完就能用在工作中",
  },
  {
    icon: Shield,
    title: "终身有效",
    desc: "一次购买，永久观看。不限次数，不限时间",
  },
  {
    icon: Users,
    title: "社区交流",
    desc: "加入学员社群，和志同道合的人一起学习进步",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            让学习更简单
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            优质在线课程，涵盖编程、AI、设计、职场技能。
            <br />
            名师授课，实战驱动，助你实现职业突破。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
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
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择文心课堂</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center p-6 rounded-xl border hover:shadow-lg transition-shadow">
                <f.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
          <p className="text-gray-500 mb-8">加入 thousands of 学员，开始你的学习之旅</p>
          <Button size="lg" asChild>
            <Link href="/courses">立即开始</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
