# 文心课堂

在线教育课程售卖平台，集品牌展示、课程购买、在线学习、后台管理于一体。

🔗 **线上地址：** https://ziiy.fun

## 功能

### 前台
- 品牌首页（轮播图 + 特色介绍 + 精选课程）
- 课程中心（分类筛选 + 搜索 + 详情）
- 微信 H5 支付购买
- 在线学习（视频播放 + 章节导航 + 进度记录）
- 在线练习（看字选拼音 / 看拼音选字 / 听音选拼音）
- 用户中心（个人资料、我的课程、我的订单）
- 评价系统

### 后台
- 数据概览 Dashboard
- 课程管理（CRUD + 章节管理 + 封面上传）
- 分类管理（增删改 + 排序）
- 练习题管理（按章节管理题目）
- 订单管理（筛选 + 退款）
- 用户管理（搜索 + 禁用/启用）
- 系统设置

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + Radix UI
- Prisma ORM + SQLite
- 微信支付 H5 (V3 API)
- JWT 认证（手机验证码登录）
- Vitest 测试

## 快速开始

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma migrate dev
npx tsx prisma/seed.ts

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 环境变量

复制 `.env.example` 为 `.env`，填写以下配置：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"

# 微信支付（生产环境必填）
WX_MCH_ID=""
WX_API_KEY=""
WX_APP_ID=""
WX_PRIVATE_KEY=""
WX_CERT_SERIAL=""
WX_NOTIFY_URL=""
WX_PLATFORM_CERT=""
```

## 部署

项目已配置 GitHub Actions 自动部署，push 到 master 分支即可触发。

手动部署：

```bash
npm run build
npx prisma migrate deploy
npm start
```

## 管理后台

访问 `/admin`，默认账号：
- 用户名：`admin`
- 密码：`admin123`

## License

Private
