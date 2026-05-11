# 文心课堂 — 项目总规划

> 版本：v1.0 | 创建日期：2026-05-10 | 负责人：Eva（统筹）

---

## 一、项目概述

**项目名称：** 文心课堂（Wenxin Classroom）
**项目定位：** 面向国内用户的在线教育平台，集品牌宣传、课程售卖、在线学习于一体
**核心功能：** 品牌展示 · 课程商城 · 微信H5支付 · 视频播放学习 · 后台管理

---

## 二、技术选型

| 层级 | 技术方案 | 理由 |
|------|---------|------|
| **前端** | Next.js 14 (App Router) + TypeScript | SSR/SSG 利于 SEO，React 生态成熟 |
| **UI 框架** | Tailwind CSS + shadcn/ui | 开发效率高，组件质量好，易定制 |
| **移动端适配** | 响应式设计（PC + Mobile 同一套代码） | 维护成本低，体验一致 |
| **后端** | Node.js + Next.js API Routes | 全栈统一，部署简单 |
| **数据库** | SQLite (Prisma ORM) | 轻量，单文件，适合教育类项目初期 |
| **视频存储** | 阿里云 OSS | 已确认使用 OSS |
| **视频播放** | DPlayer / xgplayer | 国内播放器，支持 HLS 加密 |
| **支付** | 微信支付 H5（v3 API） | 国内主流支付方式，已有商户号 |
| **后台管理** | 独立 Admin 页面（Next.js 内置） | 同一项目，共享数据层 |
| **部署** | Docker + Nginx | 一键部署，环境一致 |

---

## 三、项目目录结构

```
wenxinHost/
├── docs/                           # 📚 项目文档
│   ├── PROJECT-PLAN.md             # 本文件 - 项目总规划
│   ├── API-DESIGN.md               # API 接口设计
│   ├── DB-DESIGN.md                # 数据库设计
│   ├── UI-DESIGN.md                # UI/UX 设计规范
│   ├── COURSE-OUTLINE.md           # 课程大纲规划
│   ├── DEPLOY-GUIDE.md             # 部署指南
│   ├── TEST-PLAN.md                # 测试计划
│   └── PROGRESS.md                 # 进度跟踪
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # 公开页面（品牌宣传、课程展示）
│   │   ├── (auth)/                 # 登录注册
│   │   ├── (learn)/                # 学习中心（视频播放）
│   │   ├── (checkout)/             # 支付流程
│   │   ├── admin/                  # 后台管理
│   │   ├── api/                    # API 路由
│   │   ├── layout.tsx              # 全局布局
│   │   └── page.tsx                # 首页
│   │
│   ├── components/                 # 通用组件
│   │   ├── ui/                     # shadcn/ui 基础组件
│   │   ├── layout/                 # 布局组件（Header, Footer, Nav）
│   │   ├── course/                 # 课程相关组件
│   │   ├── payment/                # 支付相关组件
│   │   ├── video/                  # 视频播放器组件
│   │   └── admin/                  # 后台管理组件
│   │
│   ├── lib/                        # 工具库
│   │   ├── db.ts                   # Prisma 客户端
│   │   ├── wechat-pay.ts           # 微信支付 SDK
│   │   ├── auth.ts                 # 认证工具
│   │   └── utils.ts                # 通用工具
│   │
│   └── types/                      # TypeScript 类型定义
│
├── prisma/
│   └── schema.prisma               # 数据库 Schema
│
├── public/                         # 静态资源
│   ├── images/
│   └── videos/
│
├── scripts/                        # 脚本工具
│   └── seed.ts                     # 数据库初始化
│
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## 四、功能模块拆解

### 4.1 前台（面向用户）

#### 🏠 品牌宣传首页
- Hero Banner（轮播图 + 品牌 Slogan）
- 课程特色介绍（3-4 个卖点卡片）
- 精选课程展示（热门 / 推荐）
- 讲师团队介绍
- 学员评价/案例
- 底部联系方式 + 微信公众号二维码

#### 📚 课程中心
- 课程分类列表（标签筛选）
- 课程卡片（封面、标题、价格、评分）
- 课程详情页（大纲、介绍、讲师、评价）
- 搜索功能

#### 🛒 购买流程
- 课程详情 → 立即购买 → 微信H5支付 → 支付回调 → 开通权限
- 订单列表 / 订单详情
- 支付状态查询

#### 📖 在线学习
- 视频播放器（支持进度记忆、倍速、清晰度切换）
- 课程大纲侧边栏（章节导航）
- 学习进度记录
- 笔记功能（可选）

#### 👤 用户中心
- 手机号验证码登录（无认证服务号，暂不用微信OAuth）
- 个人资料
- 我的课程（已购课程列表）
- 学习记录
- 订单管理

### 4.2 后台管理

#### 📊 数据概览 Dashboard
- 今日销售额、订单数、新增用户
- 近 7/30 天趋势图表
- 热门课程排行

#### 📚 课程管理
- 课程 CRUD（标题、描述、封面、价格、分类）
- 章节管理（添加/编辑/删除/排序）
- 视频上传（对接 OSS 或本地存储）
- 课程上下架

#### 👥 用户管理
- 用户列表（搜索、筛选）
- 用户详情（购买记录、学习进度）
- 禁用/启用用户

#### 📦 订单管理
- 订单列表（筛选：待支付/已完成/已退款）
- 订单详情
- 退款操作

#### ⚙️ 系统设置
- 网站基本信息（名称、Logo、联系方式）
- 微信支付配置
- 管理员账号管理

---

## 五、数据库核心表设计（概要）

| 表名 | 说明 | 核心字段 |
|------|------|---------|
| `users` | 用户表 | id, openid, nickname, avatar, phone, role |
| `courses` | 课程表 | id, title, description, cover, price, category, status |
| `chapters` | 章节表 | id, course_id, title, sort_order, video_url, duration |
| `orders` | 订单表 | id, user_id, course_id, amount, status, transaction_id |
| `payments` | 支付记录 | id, order_id, method, amount, paid_at, wx_prepay_id |
| `progress` | 学习进度 | id, user_id, chapter_id, watched_duration, completed |
| `categories` | 课程分类 | id, name, sort_order |
| `admins` | 管理员 | id, username, password_hash, role |
| `settings` | 系统配置 | id, key, value |

---

## 六、API 接口设计（概要）

### 公开接口
```
GET    /api/courses              # 课程列表
GET    /api/courses/:id          # 课程详情
GET    /api/courses/:id/chapters # 课程章节
GET    /api/categories           # 分类列表
GET    /api/banners              # 轮播图
```

### 用户接口（需登录）
```
POST   /api/auth/sms-code       # 发送验证码
POST   /api/auth/sms-login      # 手机号登录
GET    /api/user/profile         # 个人信息
GET    /api/user/courses         # 已购课程
GET    /api/user/orders          # 订单列表
POST   /api/orders               # 创建订单
POST   /api/payments/wechat      # 发起微信支付
POST   /api/payments/notify      # 微信支付回调
GET    /api/progress/:chapterId  # 学习进度
POST   /api/progress/:chapterId  # 更新进度
```

### 管理接口（需管理员权限）
```
GET/POST/PUT/DELETE /api/admin/courses     # 课程管理
GET/POST/PUT/DELETE /api/admin/chapters    # 章节管理
GET/POST/PUT/DELETE /api/admin/users       # 用户管理
GET/PUT             /api/admin/orders      # 订单管理
POST                /api/admin/upload      # 文件上传
GET/PUT             /api/admin/settings    # 系统设置
GET                 /api/admin/dashboard   # 数据统计
```

---

## 七、页面清单

### 前台页面（11 页）
| # | 路由 | 页面 | 优先级 |
|---|------|------|--------|
| 1 | `/` | 品牌首页 | P0 |
| 2 | `/courses` | 课程列表 | P0 |
| 3 | `/courses/[id]` | 课程详情 | P0 |
| 4 | `/checkout/[id]` | 支付页面 | P0 |
| 5 | `/learn/[courseId]` | 学习页面（视频播放） | P0 |
| 6 | `/user` | 个人中心 | P1 |
| 7 | `/user/orders` | 我的订单 | P1 |
| 8 | `/user/courses` | 我的课程 | P1 |
| 9 | `/login` | 登录页 | P0 |
| 10 | `/about` | 关于我们 | P2 |
| 11 | `/contact` | 联系方式 | P2 |

### 后台页面（7 页）
| # | 路由 | 页面 | 优先级 |
|---|------|------|--------|
| 1 | `/admin` | Dashboard | P0 |
| 2 | `/admin/courses` | 课程管理 | P0 |
| 3 | `/admin/courses/[id]` | 课程编辑 | P0 |
| 4 | `/admin/users` | 用户管理 | P1 |
| 5 | `/admin/orders` | 订单管理 | P1 |
| 6 | `/admin/settings` | 系统设置 | P1 |
| 7 | `/admin/login` | 管理员登录 | P0 |

---

## 八、开发阶段划分

### 🟢 Phase 1：基础搭建（预计 2-3 天）
**目标：** 项目能跑起来，有基础页面框架

- [ ] 项目初始化（Next.js + TypeScript + Tailwind + Prisma）
- [ ] 数据库 Schema 设计 & 迁移
- [ ] 基础布局组件（Header, Footer, 响应式框架）
- [ ] 路由结构搭建
- [ ] shadcn/ui 组件库集成

**交付物：** 可运行的空项目骨架 + 数据库

---

### 🔵 Phase 2：前台核心页面（预计 3-4 天）
**目标：** 用户能看到课程、查看详情

- [ ] 品牌首页（Hero、特色、精选课程）
- [ ] 课程列表页（分类筛选、搜索）
- [ ] 课程详情页（大纲、介绍、购买按钮）
- [ ] Mock 数据填充
- [ ] 响应式适配

**交付物：** 完整的前台展示页面（不含真实数据和支付）

---

### 🟡 Phase 3：用户系统 & 支付（预计 3-4 天）
**目标：** 用户能登录、购买课程

- [ ] 手机号验证码登录（无认证服务号，不用微信OAuth）
- [ ] 用户中心页面
- [ ] 微信 H5 支付集成（下单、回调、查询）
- [ ] 订单系统
- [ ] 购买后权限开通逻辑

**交付物：** 完整的登录-购买-开通流程

---

### 🟠 Phase 4：在线学习（预计 2-3 天）
**目标：** 买完课能看视频

- [ ] 视频播放器集成（DPlayer / xgplayer）
- [ ] 学习页面（章节导航 + 播放器）
- [ ] 学习进度记录（断点续播）
- [ ] 视频防盗链 / 签名 URL

**交付物：** 完整的学习体验

---

### 🔴 Phase 5：后台管理（预计 3-4 天）
**目标：** 管理员能管理所有内容

- [ ] 管理员登录
- [ ] Dashboard 数据概览
- [ ] 课程 CRUD（含章节、视频上传）
- [ ] 用户管理
- [ ] 订单管理
- [ ] 系统设置

**交付物：** 完整的后台管理系统

---

### 🟣 Phase 6：收尾 & 部署（预计 2 天）
**目标：** 可上线运行

- [ ] SEO 优化（meta、OG tags、sitemap）
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] Docker 部署方案
- [ ] Nginx 配置（HTTPS、反向代理）
- [ ] 数据备份方案
- [ ] 上线检查清单

**交付物：** 可部署的生产环境

---

## 九、子 Agent 任务分配

| Agent 负责 | 任务 | 阶段 |
|-----------|------|------|
| **课程大纲 Agent** | 设计课程分类体系、示例课程大纲、定价策略 | Phase 1 |
| **UI 设计 Agent** | 设计规范文档、页面线框图、配色方案、组件规范 | Phase 1 |
| **前端开发 Agent** | 前台页面开发、响应式适配、交互逻辑 | Phase 2-4 |
| **后端开发 Agent** | API 开发、数据库、微信支付、认证 | Phase 3-5 |
| **后台管理 Agent** | Admin 页面开发 | Phase 5 |
| **部署 Agent** | Docker、Nginx、CI/CD、上线 | Phase 6 |
| **测试 Agent** | 功能测试、支付测试、兼容性测试 | Phase 2-6 |

---

## 十、风险点 & 注意事项

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| 微信支付已有商户号 | ✅ 可直接开发 H5 支付 |
| 无认证服务号 | 无法用微信OAuth登录 | 改用手机号验证码登录 |
| 视频版权保护 | 内容泄露 | OSS 签名 URL + Referer 校验 |
| 大视频文件上传 | 超时/失败 | 分片上传 + 进度条 |
| 移动端兼容性 | 体验差 | 优先移动端设计，渐进增强 |

---

## 十一、文档清单

所有文档位于 `docs/` 目录：

| 文档 | 说明 | 状态 |
|------|------|------|
| `PROJECT-PLAN.md` | 本文件 - 项目总规划 | ✅ 完成 |
| `COURSE-OUTLINE.md` | 课程大纲 & 分类体系 | 📋 待创建 |
| `UI-DESIGN.md` | UI/UX 设计规范 | 📋 待创建 |
| `DB-DESIGN.md` | 数据库详细设计 | 📋 待创建 |
| `API-DESIGN.md` | API 接口详细文档 | 📋 待创建 |
| `DEPLOY-GUIDE.md` | 部署指南 | 📋 待创建 |
| `TEST-PLAN.md` | 测试计划 | 📋 待创建 |
| `PROGRESS.md` | 进度跟踪 | 📋 待创建 |

---

## 十二、沟通约定

- **进度更新：** 每个 Phase 完成后更新 `PROGRESS.md`
- **问题升级：** 子 Agent 遇到阻塞及时上报
- **验收标准：** 每个 Phase 完成后进行代码审查 + 功能验收
- **文档先行：** 任何开发开始前，先完成对应文档

---

*下一步：Phase 1 子 Agent 已派发，等待交付*

---

## 附录：决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-05-10 | 技术栈选定 Next.js + Tailwind + Prisma + SQLite | 全栈统一，部署简单，适合教育项目 |
| 2026-05-10 | PC + Mobile 响应式同代码 | 维护成本低 |
| 2026-05-10 | 登录方式：手机号验证码 | 无认证服务号，暂不支持微信OAuth |
| 2026-05-10 | 视频存储使用阿里云 OSS | 毅哥确认 |
| 2026-05-10 | 微信H5支付（非JSAPI） | 有商户号，无认证服务号 |
| 2026-05-10 | 域名和服务器已备好 | 毅哥确认 |
