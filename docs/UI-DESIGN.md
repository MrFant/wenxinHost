# 文心课堂 — UI/UX 设计规范

## 1. 设计风格

**推荐风格：现代简约风（参考极客时间）**

**选择理由：**
- 内容为王：在线教育平台的核心价值是课程内容，设计应服务于内容呈现，而非喧宾夺主
- 信息密度高：简约风格允许在有限空间内展示更多有价值的信息（课程列表、进度、数据）
- 加载快：减少装饰性元素意味着更少的资源请求，移动端体验更佳
- 专业感：简洁克制的设计传递专业、可信赖的品牌形象
- 易维护：组件化程度高，开发迭代成本低

**设计关键词：** 清晰 · 有序 · 专注 · 高效

---

## 2. 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#2563EB` | 蓝色，用于按钮、链接、关键操作 |
| 辅色 | `#7C3A80` | 紫色，用于强调、标签、特殊状态 |
| 背景色 | `#F9FAFB` | 浅灰白，页面底色 |
| 标题色 | `#111827` | 深黑，h1-h4 |
| 正文色 | `#374151` | 深灰，段落文字 |
| 辅助色 | `#6B7280` | 中灰，说明文字、占位符 |
| 成功 | `#10B981` | 绿色，操作成功、已完成 |
| 警告 | `#F59E0B` | 黄色，提示、进行中 |
| 错误 | `#EF4444` | 红色，错误、删除确认 |
| 信息 | `#3B82F6` | 浅蓝，信息提示 |

**渐变（可选）：** 主色到辅色渐变 `bg-gradient-to-r from-blue-600 to-purple-600`，用于 Hero 区域或 CTA 按钮。

---

## 3. 字体规范

### 字体栈

```css
/* 中文 */
font-family: -apple-system, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;

/* 英文 */
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

### 字号体系

| 级别 | 字号 | 行高 | 字重 | Tailwind 类名 |
|------|------|------|------|---------------|
| H1 | 36px | 1.2 | 700 | `text-4xl font-bold leading-tight` |
| H2 | 28px | 1.3 | 700 | `text-2xl font-bold` |
| H3 | 22px | 1.4 | 600 | `text-xl font-semibold` |
| H4 | 18px | 1.4 | 600 | `text-lg font-semibold` |
| Body | 16px | 1.6 | 400 | `text-base` |
| Small | 14px | 1.5 | 400 | `text-sm` |
| Caption | 12px | 1.4 | 400 | `text-xs text-gray-500` |

---

## 4. 组件规范

### 4.1 按钮（Button）

```html
<!-- 主按钮 -->
<button class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm">
  开始学习
</button>

<!-- 次按钮 -->
<button class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200">
  取消
</button>

<!-- 危险按钮 -->
<button class="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200">
  删除课程
</button>

<!-- 禁用状态 -->
<button class="px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed" disabled>
  已完成
</button>

<!-- 小按钮 -->
<button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200">
  查看详情
</button>
```

### 4.2 卡片（Card）

```html
<!-- 课程卡片 -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
  <img src="cover.jpg" class="w-full h-40 object-cover" />
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-1">Vue 3 实战教程</h3>
    <p class="text-sm text-gray-500 mb-3">讲师：张三 · 12课时</p>
    <div class="flex items-center justify-between">
      <span class="text-blue-600 font-bold">¥99</span>
      <span class="text-xs text-gray-400">1.2万人学习</span>
    </div>
  </div>
</div>

<!-- 统计卡片 -->
<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <p class="text-sm text-gray-500 mb-1">今日学习</p>
  <p class="text-3xl font-bold text-gray-900">2.5h</p>
  <p class="text-sm text-green-500 mt-2">↑ 12% 较昨日</p>
</div>
```

### 4.3 表单（Form）

```html
<!-- 输入框 -->
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-1">课程名称</label>
  <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200" placeholder="请输入课程名称" />
</div>

<!-- 下拉选择 -->
<select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
  <option>前端开发</option>
  <option>后端开发</option>
</select>

<!-- 文本域 -->
<textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" rows="4" placeholder="请输入课程简介..."></textarea>

<!-- 错误状态 -->
<input type="text" class="w-full px-3 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
<p class="text-sm text-red-500 mt-1">此项为必填</p>
```

### 4.4 导航（Navigation）

```html
<!-- 顶部导航栏 -->
<nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <span class="text-xl font-bold text-blue-600">文心课堂</span>
      <div class="hidden md:flex items-center gap-6">
        <a class="text-gray-700 hover:text-blue-600 font-medium transition-colors">首页</a>
        <a class="text-gray-700 hover:text-blue-600 font-medium transition-colors">课程</a>
        <a class="text-gray-700 hover:text-blue-600 font-medium transition-colors">学习路径</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <img src="avatar.jpg" class="w-8 h-8 rounded-full" />
    </div>
  </div>
</nav>

<!-- 侧边栏导航 -->
<aside class="w-64 bg-white border-r border-gray-100 h-screen sticky top-16 p-4">
  <a class="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium mb-1">
    <span>📊</span> Dashboard
  </a>
  <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 mb-1">
    <span>📚</span> 课程管理
  </a>
</aside>
```

### 4.5 弹窗（Modal）

```html
<!-- 遮罩 -->
<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
    <p class="text-gray-500 mb-6">删除后无法恢复，确定要删除该课程吗？</p>
    <div class="flex justify-end gap-3">
      <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">取消</button>
      <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">确认删除</button>
    </div>
  </div>
</div>
```

### 4.6 标签（Tag）

```html
<span class="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">前端</span>
<span class="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">已完成</span>
<span class="px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">进行中</span>
<span class="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">未开始</span>
```

### 4.7 加载状态（Loading）

```html
<!-- Spinner -->
<div class="flex items-center justify-center py-12">
  <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
</div>

<!-- 骨架屏 -->
<div class="bg-white rounded-xl p-4 animate-pulse">
  <div class="bg-gray-200 h-40 rounded-lg mb-4"></div>
  <div class="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
  <div class="bg-gray-200 h-4 w-1/2 rounded"></div>
</div>

<!-- 进度条 -->
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 65%"></div>
</div>
```

---

## 5. 页面线框图（ASCII）

### 5.1 首页（Landing）

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂    首页  课程  学习路径    [头像]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌─────────────────────────────────────────────┐    │
│   │          Hero 区域                           │    │
│   │    高质量的在线编程教育平台                    │    │
│   │    [立即开始学习]  [浏览课程]                 │    │
│   └─────────────────────────────────────────────┘    │
│                                                      │
│   热门课程                              [查看全部 →]  │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│   │ [封面] │ │ [封面] │ │ [封面] │ │ [封面] │      │
│   │ 课程1  │ │ 课程2  │ │ 课程3  │ │ 课程4  │      │
│   │ ¥99    │ │ ¥199   │ │ 免费   │ │ ¥149   │      │
│   └────────┘ └────────┘ └────────┘ └────────┘      │
│                                                      │
│   学习路径                                           │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│   │ 前端工程师   │ │ 后端工程师   │ │ 全栈开发     │   │
│   │ 8门课程     │ │ 6门课程     │ │ 12门课程    │   │
│   └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                      │
│   ┌─────────────────────────────────────────────┐    │
│   │             Footer                           │    │
│   │  关于我们 · 联系方式 · 隐私政策               │    │
│   └─────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 5.2 课程列表

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂    首页  课程  学习路径    [头像]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  课程中心                                            │
│  ┌──────────────────────────────────────────────┐    │
│  │ [搜索课程...]          [分类▼] [难度▼] [排序▼]│    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │ [封面] │ │ [封面] │ │ [封面] │                   │
│  │ 课程名 │ │ 课程名 │ │ 课程名 │                   │
│  │ 讲师   │ │ 讲师   │ │ 讲师   │                   │
│  │ ★4.8  │ │ ★4.9  │ │ ★4.7  │                   │
│  │ ¥99   │ │ 免费   │ │ ¥149  │                   │
│  └────────┘ └────────┘ └────────┘                   │
│  ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │        │ │        │ │        │                   │
│  └────────┘ └────────┘ └────────┘                   │
│                                                      │
│         [1] [2] [3] ... [10]                         │
└──────────────────────────────────────────────────────┘
```

### 5.3 课程详情

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂    首页  课程  学习路径    [头像]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────┐  ┌─────────────────────┐ │
│  │                        │  │ 课程名称             │ │
│  │     课程封面 / 视频     │  │ 讲师：张三           │ │
│  │                        │  │ ★ 4.9 (2,300评价)   │ │
│  │                        │  │ 12课时 · 6小时       │ │
│  └────────────────────────┘  │ 中级 · 前端开发      │ │
│                               │                     │ │
│                               │ ¥99                 │ │
│                               │ [立即购买]           │ │
│                               │ [加入购物车]         │ │
│                               └─────────────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ [课程介绍] [课程大纲] [评价] [资料]           │    │
│  ├──────────────────────────────────────────────┤    │
│  │                                              │    │
│  │  课程介绍内容...                              │    │
│  │  你将学到：                                   │    │
│  │  ✓ Vue 3 组合式 API                          │    │
│  │  ✓ TypeScript 集成                           │    │
│  │  ✓ 项目实战                                  │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 5.4 学习页面（播放器）

```
┌──────────────────────────────────────────────────────┐
│  [← 返回课程]                          [笔记] [问答]  │
├──────────────────────┬───────────────────────────────┤
│                      │ 课程大纲                       │
│                      │ ─────────────────              │
│                      │ ✅ 1. 课程介绍    12:30        │
│     视频播放器        │ ▶  2. 环境搭建    18:45 ←当前 │
│                      │ ○  3. 基础语法    25:00        │
│                      │ ○  4. 组件开发    30:00        │
│                      │ ○  5. 路由管理    22:00        │
│                      │ ○  6. 状态管理    28:00        │
│                      │                               │
├──────────────────────┤ 学习进度                       │
│                      │ ████████░░░░░░░░ 50%           │
│  第2节：环境搭建      │                               │
│  本节内容介绍...      │ 讲师笔记                       │
│                      │ 重点：Node.js >= 16            │
│  [上一节] [下一节]    │                               │
└──────────────────────┴───────────────────────────────┘
```

### 5.5 个人中心

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂    首页  课程  学习路径    [头像]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  [头像]  张三                                 │    │
│  │          已学习 120 小时 · 完成 8 门课程       │    │
│  │          [编辑资料]                            │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────┬──────────┬──────────┬──────────┐       │
│  │ 我的课程 │ 学习记录 │ 我的收藏 │ 设置     │       │
│  └──────────┴──────────┴──────────┴──────────┘       │
│                                                      │
│  正在学习 (3)                                        │
│  ┌────────────────────────────────────────────┐      │
│  │ [封面] Vue 3 实战     ████████░░ 65%       │      │
│  │        上次学习：2天前     [继续学习]       │      │
│  ├────────────────────────────────────────────┤      │
│  │ [封面] TypeScript     ████░░░░░░ 30%       │      │
│  │        上次学习：5天前     [继续学习]       │      │
│  └────────────────────────────────────────────┘      │
│                                                      │
│  已完成 (5)                                          │
│  ┌────────────────────────────────────────────┐      │
│  │ [封面] HTML/CSS 基础   ████████████ 100% ✓ │      │
│  │ [封面] JavaScript 入门 ████████████ 100% ✓ │      │
│  └────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

### 5.6 Dashboard（数据面板）

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂                           [管理员]   │
├──────────┬───────────────────────────────────────────┤
│          │ Dashboard                                 │
│ 侧边栏   │                                           │
│          │ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ ▶ 数据   │ │ 总用户   │ │ 总课程   │ │ 今日活跃 │   │
│   课程   │ │ 12,580   │ │   86     │ │  1,024   │   │
│   用户   │ │ ↑ 12%    │ │ ↑ 3     │ │ ↑ 8%    │   │
│   订单   │ └──────────┘ └──────────┘ └──────────┘   │
│   设置   │                                           │
│          │ ┌────────────────────────────────────┐    │
│          │ │  学习趋势图（折线图）                │    │
│          │ │  ──────────────────────────────     │    │
│          │ └────────────────────────────────────┘    │
│          │                                           │
│          │ ┌──────────────┐ ┌──────────────┐        │
│          │ │ 热门课程排行  │ │ 最新注册用户  │        │
│          │ │ 1. Vue 3    │ │ user_a 2min  │        │
│          │ │ 2. React    │ │ user_b 5min  │        │
│          │ │ 3. Python   │ │ user_c 12min │        │
│          │ └──────────────┘ └──────────────┘        │
└──────────┴───────────────────────────────────────────┘
```

### 5.7 课程管理（Admin）

```
┌──────────────────────────────────────────────────────┐
│  [Logo] 文心课堂                           [管理员]   │
├──────────┬───────────────────────────────────────────┤
│          │ 课程管理                    [+ 新建课程]   │
│ 侧边栏   │                                           │
│          │ ┌──────────────────────────────────────┐  │
│   数据   │ │ [搜索...]    [状态▼] [分类▼] [排序▼] │  │
│ ▶ 课程   │ └──────────────────────────────────────┘  │
│   用户   │                                           │
│   订单   │ ┌────┬────────┬──────┬──────┬─────┬────┐ │
│   设置   │ │ ID │ 课程名  │ 讲师 │ 课时 │状态 │操作│ │
│          │ ├────┼────────┼──────┼──────┼─────┼────┤ │
│          │ │ 1  │ Vue 3  │ 张三 │  12  │已上架│···│ │
│          │ │ 2  │ React  │ 李四 │  18  │已上架│···│ │
│          │ │ 3  │ Python │ 王五 │  24  │草稿 │···│ │
│          │ │ 4  │ Go     │ 赵六 │  15  │审核中│···│ │
│          │ └────┴────────┴──────┴──────┴─────┴────┘ │
│          │                                           │
│          │         [← 1  2  3  4  5 →]              │
└──────────┴───────────────────────────────────────────┘
```

---

## 6. 响应式断点

| 断点 | 宽度 | 设备 | Tailwind 前缀 |
|------|------|------|---------------|
| sm | ≥ 640px | 大手机 / 小平板 | `sm:` |
| md | ≥ 768px | 平板竖屏 | `md:` |
| lg | ≥ 1024px | 平板横屏 / 小笔记本 | `lg:` |
| xl | ≥ 1280px | 桌面显示器 | `xl:` |

**响应式策略：**
- 移动端优先（Mobile First），默认样式为移动端
- 课程卡片：移动端 1 列 → sm 2 列 → lg 3 列 → xl 4 列
- 侧边栏：移动端隐藏（汉堡菜单）→ lg 显示
- 播放器：移动端视频在上、大纲在下 → lg 左右分栏

```html
<!-- 课程网格示例 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- 课程卡片 -->
</div>
```

---

## 7. 动效规范

### 7.1 基础过渡

```css
/* 全局默认过渡 */
transition-all duration-200 ease-in-out

/* 按钮 hover */
hover:bg-blue-700 active:scale-95 transition-all duration-150

/* 卡片 hover */
hover:shadow-md hover:-translate-y-1 transition-all duration-200
```

### 7.2 页面切换

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
```

### 7.3 加载动画

```html
<!-- Spinner 旋转 -->
<div class="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

<!-- 脉冲骨架屏 -->
<div class="animate-pulse bg-gray-200 rounded h-4 w-3/4"></div>
```

### 7.4 微交互

- **按钮点击：** `active:scale-95` 轻微缩小反馈
- **卡片悬浮：** `hover:-translate-y-1` 微上浮 + 阴影加深
- **输入聚焦：** `focus:ring-2 focus:ring-blue-500` 蓝色光晕
- **标签切换：** `transition-colors duration-200` 颜色平滑过渡
- **列表加载：** 逐项淡入，每项延迟 50ms（stagger effect）

### 7.5 动效原则

1. **快速：** 动效时长 150-300ms，不让用户等待
2. **有意义：** 动效服务于交互反馈，不做纯装饰
3. **一致：** 全站统一 easing（`ease-in-out`）和时长
4. **可关闭：** 尊重 `prefers-reduced-motion` 系统设置

---

> 📌 本规范随项目迭代持续更新。最后更新：2026-05-10
