# 文心课堂 — 数据库设计任务书

> 派发给：后端 Agent | 日期：2026-05-10

---

## 任务目标

为"文心课堂"设计完整的数据库 Schema（Prisma ORM + SQLite），输出详细的数据库设计文档。

---

## 项目背景

- **技术栈：** Next.js + Prisma ORM + SQLite
- **核心功能：** 用户注册登录、课程管理、订单支付、视频学习进度
- **支付方式：** 微信 H5 支付
- **用户认证：** 手机号验证码登录 + 管理员账号密码

---

## 任务要求

### 1. 核心表设计

请设计以下表的完整 Schema（含字段名、类型、约束、索引、关联关系）：

| 表 | 说明 |
|----|------|
| `users` | 用户表（手机号登录） |
| `admins` | 管理员表 |
| `categories` | 课程分类 |
| `courses` | 课程表 |
| `chapters` | 章节表 |
| `orders` | 订单表 |
| `payments` | 支付记录表 |
| `progress` | 学习进度表 |
| `reviews` | 课程评价表（可选） |
| `settings` | 系统配置表 |
| `banners` | 轮播图表 |

### 2. Prisma Schema
输出完整的 `schema.prisma` 文件内容，包含：
- 所有 model 定义
- 字段类型和约束
- 关联关系（@relation）
- 枚举类型（enum）
- 索引（@@index）
- 默认值

### 3. ER 图
用文字/ASCII 描述表之间的关联关系。

### 4. 种子数据
提供 `seed.ts` 的设计思路，包含：
- 默认管理员账号
- 示例课程分类
- 系统默认配置项

---

## 设计原则

- 使用 cuid 或 uuid 作为主键
- 时间字段用 DateTime，自动填充 createdAt/updatedAt
- 软删除（isDeleted 字段）用于关键数据
- 金额用 Int（分）存储，避免浮点精度问题
- 预留扩展字段（metadata JSON 字段）

---

## 输出

1. 设计文档：`/mnt/e/Github/wenxinHost/docs/DB-DESIGN.md`
2. Prisma Schema：内容嵌入文档中，后续直接复制到项目

---

## 交付期限

一次性交付完整文档。
