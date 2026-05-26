# 文心课堂架构重设计

## 1. 背景与目标

当前项目存在以下问题：
- 练习模块功能太简单，只有选择题形式
- 整体架构混乱，模块耦合太紧
- 拼音课程不够专业，内容不够丰富

**目标：** 采用功能模块化架构，重构项目，重点优化拼音练习模块。

## 2. 核心流程

项目核心流程有三个，同等重要：
1. **课程付费流程**：浏览课程 → 课程详情 → 下单 → 微信支付 → 订单确认
2. **课程在线播放**：学习页面 → 视频播放 → 进度记录
3. **课程在线练习**：多种练习方式 → 提交 → 结果展示

## 3. 架构设计

### 3.1 模块划分

采用功能模块化架构，按功能划分独立模块：

```
src/
├── modules/
│   ├── course/                    # 课程模块
│   │   ├── api/                   # 课程API
│   │   ├── components/            # 课程组件
│   │   ├── types/                 # 课程类型定义
│   │   └── hooks/                 # 课程hooks
│   │
│   ├── practice/                  # 练习模块（重点）
│   │   ├── api/                   # 练习API
│   │   ├── components/            # 练习组件
│   │   ├── types/                 # 练习类型定义
│   │   ├── utils/                 # 拼音工具函数
│   │   └── hooks/                 # 练习hooks
│   │
│   ├── payment/                   # 支付模块
│   │   ├── api/                   # 支付API
│   │   ├── components/            # 支付组件
│   │   └── hooks/                 # 支付hooks
│   │
│   └── auth/                      # 认证模块
│       ├── api/                   # 认证API
│       └── components/            # 认证组件
│
├── shared/                        # 共享模块
│   ├── components/
│   │   ├── ui/                    # UI组件
│   │   └── layout/                # 布局组件
│   ├── lib/
│   │   ├── auth.ts                # 认证工具
│   │   └── prisma.ts              # 数据库
│   └── types/
│       └── index.ts               # 共享类型
│
└── app/                           # Next.js页面
    ├── courses/                   # 课程页面
    ├── learn/                     # 学习页面
    ├── practice/                  # 练习页面
    └── checkout/                  # 支付页面
```

### 3.2 模块职责

| 模块 | 职责 | 依赖 |
|------|------|------|
| course | 课程管理、课程展示 | shared |
| practice | 练习管理、练习交互 | shared |
| payment | 订单管理、支付处理 | shared, course |
| auth | 用户认证、权限管理 | shared |
| shared | 共享组件、工具函数、类型定义 | 无 |

### 3.3 数据流

```
用户请求 → app/页面 → modules/模块组件 → modules/api → prisma → 数据库
```

## 4. 练习模块详细设计

### 4.1 练习类型

| 类型 | 交互方式 | 适用场景 |
|------|----------|----------|
| char_to_pinyin | 看字选拼音 | 选择题 |
| pinyin_to_char | 看拼音选字 | 选择题 |
| audio_to_pinyin | 听音选拼音 | 选择题 |
| typing_to_pinyin | 键盘打字输入 | 打字练习 |
| pinyin_combination | 声韵母组合点击 | 互动练习 |

### 4.2 键盘打字输入流程

1. 显示汉字（如：妈）
2. 用户输入拼音（如：ma）
3. 用户选择声调（如：ā）
4. 系统验证答案
5. 显示结果和解释

### 4.3 声韵母组合点击流程

1. 显示汉字（如：妈）
2. 显示声母按钮（b, p, m, f...）
3. 显示韵母按钮（a, o, e, i...）
4. 用户依次点击声母和韵母
5. 用户选择声调
6. 系统验证答案

### 4.4 练习组件设计

#### PinyinPractice.tsx（拼音练习主组件）

```tsx
interface PinyinPracticeProps {
  type: 'char_to_pinyin' | 'pinyin_to_char' | 'audio_to_pinyin' | 'typing_to_pinyin' | 'pinyin_combination'
  content: string
  options?: { label: string; text: string }[]
  answer: string
  pinyinBase?: string
  tone?: number
  audioUrl?: string
  onAnswer: (answer: string) => void
}
```

#### KeyboardInput.tsx（键盘打字输入组件）

```tsx
interface KeyboardInputProps {
  targetChar: string  // 目标汉字
  onInput: (pinyin: string, tone: number) => void
}
```

## 5. 拼音课程内容设计

### 5.1 课程结构

```
拼音入门课程
├── 第一章：拼音基础知识
│   ├── 1.1 声母学习
│   ├── 1.2 韵母学习
│   └── 1.3 整体认读音节
├── 第二章：声调学习
│   ├── 2.1 四个声调
│   ├── 2.2 声调规则
│   └── 2.3 声调练习
├── 第三章：拼读规则
│   ├── 3.1 拼读方法
│   ├── 3.2 拼写规则
│   └── 3.3 特殊拼读
└── 第四章：拼音应用
    ├── 4.1 打字输入
    ├── 4.2 词语拼读
    └── 4.3 句子拼读
```

### 5.2 数据模型优化

```prisma
model QuizQuestion {
  id           String  @id @default(cuid())
  quizId       String
  type         String  // char_to_pinyin | pinyin_to_char | audio_to_pinyin | typing_to_pinyin | pinyin_combination
  content      String  // 题干
  options      String  // JSON选项
  answer       String  // 正确答案
  explanation  String  @default("")
  sortOrder    Int     @default(0)
  quiz         Quiz    @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  // 新增拼音相关字段
  pinyinBase   String? // 基础拼音（不带声调）
  tone         Int?    // 声调（1-4）
  audioUrl     String? // 音频URL
}
```

## 6. 实施计划

### 阶段一：重构练习模块（优先级最高）
1. 创建练习模块目录结构
2. 实现基础练习组件
3. 实现键盘打字输入
4. 实现声韵母组合点击
5. 完善练习结果展示

### 阶段二：优化课程模块
1. 创建课程模块目录结构
2. 重构课程组件
3. 优化课程详情页
4. 完善课程列表页

### 阶段三：优化支付模块
1. 创建支付模块目录结构
2. 重构支付组件
3. 优化订单流程

### 阶段四：完善拼音课程内容
1. 设计课程大纲
2. 创建练习题目
3. 完善课程视频

## 7. 技术选型

- **框架**：Next.js App Router
- **数据库**：SQLite + Prisma
- **UI组件**：shadcn/ui
- **状态管理**：React hooks
- **样式**：Tailwind CSS

## 8. 验收标准

### 练习模块
- [ ] 支持5种练习类型
- [ ] 键盘打字输入流程完整
- [ ] 声韵母组合点击流程完整
- [ ] 练习结果展示清晰
- [ ] 错题回顾功能完整

### 课程模块
- [ ] 课程列表展示正常
- [ ] 课程详情页完整
- [ ] 视频播放正常
- [ ] 学习进度记录正常

### 支付模块
- [ ] 订单创建正常
- [ ] 微信支付流程完整
- [ ] 支付回调处理正常

## 9. 风险与应对

| 风险 | 应对措施 |
|------|----------|
| 重构工作量大 | 分阶段实施，优先核心模块 |
| 现有功能受影响 | 保持现有功能不变，渐进式优化 |
| 拼音课程内容不足 | 先完善结构，再填充内容 |
