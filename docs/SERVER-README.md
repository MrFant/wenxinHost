# 服务器运维文档

> 阿里云 ECS: 120.24.149.246
> 系统: Alibaba Cloud Linux 8 (x86_64)
> Node.js: v20.18.1
> 反向代理: Caddy v2.11.2
> 最后更新: 2026-05-22

---

## 服务一览

| 服务 | 域名 | 端口 | 目录 | 说明 |
|------|------|------|------|------|
| wenxin.service | ziiy.fun | 3000 | /opt/wenxinHost | 文心课堂（Next.js） |
| new-api.service | api.ziiy.fun | 3001 | /home/admin/new-api | New API（Go） |
| derper.service | derp.ziiy.fun | 12345 | - | Tailscale DERP 中继 |
| packy-web.service | img.ziiy.fun | 3002 | /var/www/packy-web | Packy 图片生成器 |
| caddy.service | - | 443 | /etc/caddy/ | HTTPS 反向代理 |

---

## 常用命令

### 查看状态
```bash
systemctl status wenxin.service new-api.service derper.service packy-web.service caddy.service
ss -tlnp | grep -E '3000|3001|3002|12345|443'
free -h
df -h /
```

### 重启服务
```bash
systemctl restart wenxin.service
systemctl restart wenxin.service new-api.service derper.service packy-web.service
systemctl restart caddy.service
```

### 查看日志
```bash
journalctl -u wenxin.service -f
journalctl -u wenxin.service --no-pager -n 50
journalctl -u wenxin.service -u new-api.service -u packy-web.service --priority=err --no-pager
```

---

## 各服务详情

### 1. 文心课堂 (wenxin.service)

- **域名:** ziiy.fun
- **端口:** 3000
- **目录:** /opt/wenxinHost
- **技术栈:** Next.js 16 + Prisma + SQLite
- **数据库:** /opt/wenxinHost/prisma/dev.db
- **环境变量:** /opt/wenxinHost/.env
- **部署:** GitHub Actions 自动部署（push to master）

```bash
cd /opt/wenxinHost
git pull origin master
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
systemctl restart wenxin.service
```

### 2. New API (new-api.service)

- **域名:** api.ziiy.fun
- **端口:** 3001
- **目录:** /home/admin/new-api
- **技术栈:** Go (Gin)
- **运行用户:** admin

### 3. Tailscale DERP (derper.service)

- **域名:** derp.ziiy.fun
- **端口:** 12345 (HTTPS) + 3478 (STUN)
- **用途:** Tailscale 网络 DERP 中继节点

### 4. Packy 图片生成器 (packy-web.service)

- **域名:** img.ziiy.fun
- **端口:** 3002
- **目录:** /var/www/packy-web
- **技术栈:** Node.js

---

## Caddy 配置

文件: `/etc/caddy/Caddyfile`

```
ziiy.fun {
    reverse_proxy localhost:3000
}
api.ziiy.fun {
    reverse_proxy localhost:3001
}
derp.ziiy.fun {
    reverse_proxy localhost:12345
}
img.ziiy.fun {
    reverse_proxy localhost:3002
}
```

Caddy 自动管理 Let's Encrypt SSL 证书。

---

## 故障排查

```bash
# 服务起不来
journalctl -u wenxin.service -n 30 --no-pager
ss -tlnp | grep :3000
ps aux | grep next-server

# 磁盘满了
df -h
du -sh /opt/* /var/www/* /home/admin/* 2>/dev/null | sort -rh | head -10
journalctl --vacuum-size=100M
```

---

## GitHub Actions 自动部署

- 仓库: https://github.com/MrFant/wenxinHost
- 触发: push 到 master
- 流程: SSH → git pull → npm install → prisma migrate → build → restart
- Secrets: SERVER_HOST, SERVER_USER, SERVER_PASSWORD（在 GitHub 仓库 Settings 配置）
