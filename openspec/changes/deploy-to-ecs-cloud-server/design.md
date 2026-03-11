# 设计文档：云服务器部署 + GitHub Actions 自动化

## 上下文

### 当前状态
- AetherViz 小学教学项目仅在本地开发环境运行
- 没有对外服务能力
- 未来有多个项目需要部署（个人主页、摄影作品、小工具集合）

### 技术约束
- 预算有限（月成本控制在 ¥100 以内）
- 国内访问速度快（中国用户）
- 需要支持多个独立项目
- 期望自动化部署，减少手动操作

### 利益相关者
- 项目所有者：需要成本低、易维护的方案
- 用户：需要访问速度快、稳定可靠的服务
- 开发者：需要部署流程简单、可重复

## 目标 / 非目标

**目标：**
1. 建立稳定的云服务器基础设施
2. 实现推送代码自动部署的 CI/CD 流程
3. 支持多个项目独立部署到同一服务器
4. 确保服务的安全性和可靠性
5. 控制月度成本在 ¥100 以内

**非目标：**
- 不实现高可用架构（单台服务器即可）
- 不实现容器化部署（直接部署静态文件）
- 不实现数据库服务（当前项目不需要）
- 不实现复杂的监控告警（按需检查即可）

## 决策

### 决策 1：云服务商选择

**选择：阿里云 ECS**

**理由：**
- ✅ 国内节点多，速度快
- ✅ 价格透明，按量付费
- ✅ 文档完善，社区活跃
- ✅ 与其他阿里云服务（OSS、CDN）集成方便

**替代方案考虑：**
- ❌ 腾讯云 CVM：价格相近，但节点略少
- ❌ 华为云 ECS：价格略高
- ❌ Vercel/Netlify：国外服务，国内访问慢
- ❌ 自己搭建物理服务器：成本高，维护复杂

### 决策 2：服务器规格

**选择：2核4GB，Ubuntu 22.04**

**理由：**
- ✅ 性能足够应对小流量（月访问 100GB 以内）
- ✅ 内存足够运行 Nginx + 多个静态站点
- ✅ 成本可控（约 ¥60/月）
- ✅ Ubuntu 22.04 是 LTS 版本，支持到 2027 年

**配置详情：**
```
实例规格：ecs.t6-c1m2.large (2核4GB)
操作系统：Ubuntu 22.04 LTS 64位
系统盘：40GB ESSD Entry
带宽：5Mbps（按使用付费）
预估成本：¥0.008/小时 ≈ ¥60/月
```

**替代方案考虑：**
- ❌ 1核2GB：性能不足，多个项目可能卡顿
- ❌ 4核8GB：性能过剩，成本翻倍（¥120/月）

### 决策 3：Web 服务器

**选择：Nginx**

**理由：**
- ✅ 性能优秀，处理静态文件速度快
- ✅ 配置简单，文档丰富
- ✅ 支持虚拟主机（多站点）
- ✅ 内置反向代理、负载均衡
- ✅ 内存占用小（约 10MB）

**替代方案考虑：**
- ❌ Apache：配置复杂，性能略差
- ❌ Caddy：自动 SSL，但国内资源少

### 决策 4：SSL 证书

**选择：Let's Encrypt + Certbot**

**理由：**
- ✅ 完全免费
- ✅ 自动配置 Nginx
- ✅ 自动续期（无需人工干预）
- ✅ 被所有浏览器信任

**配置方式：**
```bash
certbot --nginx -d math.yourdomain.com -d photo.yourdomain.com
```

**替代方案考虑：**
- ❌ 阿里云 SSL：付费证书（¥3000+/年）
- ❌ 腾讯云 SSL：付费证书
- ❌ Cloudflare SSL：需要使用 Cloudflare 代理

### 决策 5：自动化部署工具

**选择：GitHub Actions + SSH**

**理由：**
- ✅ 与 GitHub 深度集成
- ✅ 公开仓库免费使用
- ✅ 配置简单，社区支持好
- ✅ 可以执行自定义脚本（SSH 到服务器）

**部署流程：**
```
Git Push → GitHub Actions
  → Checkout 代码
  → 安装依赖
  → 构建项目
  → SSH 连接服务器
  → 上传构建产物
  → 重启 Nginx
  → 完成
```

**替代方案考虑：**
- ❌ Jenkins：需要自己搭建 Jenkins 服务器
- ❌ GitLab CI：需要迁移到 GitLab
- ❌ 阿里云云效：配置复杂，学习曲线陡

### 决策 6：多项目部署策略

**选择：独立仓库 + 共享服务器**

**架构：**
```
GitHub 仓库 A (math-education)
  → GitHub Actions
  → 部署到 /var/www/math-education

GitHub 仓库 B (photography)
  → GitHub Actions
  → 部署到 /var/www/photography

GitHub 仓库 C (personal-site)
  → GitHub Actions
  → 部署到 /var/www/personal-site

全部部署到同一台 ECS 服务器
```

**理由：**
- ✅ 完全独立，一个项目失败不影响其他
- ✅ 可以独立选择部署时机
- ✅ 共享基础设施（Nginx、SSL）
- ✅ 成本不增加（一台服务器承载所有项目）

**Nginx 配置：**
```nginx
server {
    listen 443 ssl;
    server_name math.yourdomain.com;
    root /var/www/math-education/dist;
}

server {
    listen 443 ssl;
    server_name photo.yourdomain.com;
    root /var/www/photography/dist;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    root /var/www/personal-site/dist;
}
```

**替代方案考虑：**
- ❌ Monorepo：配置复杂，构建时间长
- ❌ 独立服务器：成本太高（每个项目 ¥60/月）

## 风险 / 权衡

### 风险 1：单点故障
**风险：** 服务器宕机导致所有项目不可访问

**缓解措施：**
- 定期创建快照（阿里云控制台）
- 配置自动备份（每周一次）
- 准备应急预案（快速切换到备用服务器）

**权衡：**
- 多台服务器成本高（¥120+/月）
- 当前项目可接受短暂停机（个人项目）

### 风险 2：SSH 密钥泄露
**风险：** GitHub Secrets 泄露导致服务器被攻击

**缓解措施：**
- 使用专用 SSH Key（不用于其他用途）
- 设置密钥密码（可选）
- 定期轮换密钥
- 限制密钥权限（仅能执行特定命令）
- 启用服务器防火墙（仅开放必要端口）

**权衡：**
- 密钥管理增加了复杂度
- 但比密码登录更安全

### 风险 3：部署失败
**风险：** GitHub Actions 执行失败导致服务中断

**缓解措施：**
- 部署前先在测试环境验证
- 保留旧版本（部署失败可快速回滚）
- 配置部署通知（Discord/Email）
- 记录部署日志，便于排查问题

**回滚策略：**
```bash
# 保留最近 3 个版本
/var/www/math-education/
├── dist.current → latest
├── dist.previous → v1
├── dist.backup → v2
```

### 风险 4：流量突增
**风险：** 突发流量导致带宽超出预期，费用增加

**缓解措施：**
- 配置带宽监控和告警（¥50/月时告警）
- 设置带宽上限（阿里云控制台）
- 准备降级方案（静态页面，减少资源）

**权衡：**
- 按量付费灵活，但可能超出预算
- 固定带宽贵，但成本可控

### 风险 5：SSL 证书过期
**风险：** 证书未及时续期导致访问被拦截

**缓解措施：**
- 配置 Certbot 自动续期
- 设置续期提醒（过期前 30 天）
- 定期检查证书状态

**自动续期配置：**
```bash
# Certbot 安装时会自动配置定时任务
# /etc/cron.d/certbot
0 */12 * * * root test -x /usr/bin/certbot -a ! -d /run/systemd/system && perl -e 'sleep int(rand(3600))' && certbot -q renew
```

## 迁移计划

### 阶段 1：服务器初始化（2-3 小时）

**步骤：**
1. 购买阿里云 ECS
2. 配置安全组（开放端口）
3. SSH 登录服务器
4. 更新系统：`apt update && apt upgrade -y`
5. 安装软件：`apt install -y nginx git nodejs npm`
6. 配置防火墙：`ufw allow 22/80/443 && ufw enable`
7. 创建项目目录：`mkdir -p /var/www`

**验收标准：**
- ✅ 可以 SSH 登录
- ✅ Nginx 默认页面可访问
- ✅ 防火墙规则生效

### 阶段 2：域名和 SSL 配置（1-2 小时）

**步骤：**
1. 配置域名解析（A 记录指向 ECS IP）
2. 配置 Nginx 虚拟主机
3. 安装 Certbot：`apt install certbot python3-certbot-nginx -y`
4. 申请证书：`certbot --nginx -d math.yourdomain.com`
5. 验证 SSL：`curl https://math.yourdomain.com`

**验收标准：**
- ✅ 域名解析生效
- ✅ HTTPS 访问正常
- ✅ SSL 证书有效

### 阶段 3：配置自动化部署（1 小时）

**步骤：**
1. 生成 SSH Key：`ssh-keygen -t rsa -b 4096`
2. 复制公钥到服务器：`ssh-copy-id -i ~/.ssh/id_rsa.pub root@server`
3. 配置 GitHub Secrets（SSH_PRIVATE_KEY、REMOTE_HOST）
4. 创建 GitHub Actions 工作流
5. 测试自动部署：Push 代码触发 Actions

**验收标准：**
- ✅ 可以免密 SSH 登录
- ✅ Push 代码后自动部署
- ✅ 部署后立即可访问

### 阶段 4：部署当前项目（30 分钟）

**步骤：**
1. 在项目根目录创建 `.github/workflows/deploy.yml`
2. 配置构建和部署步骤
3. Push 代码触发部署
4. 验证部署结果

**验收标准：**
- ✅ 项目可从外网访问
- ✅ https://math.yourdomain.com 正常
- ✅ 所有功能正常工作

### 回滚策略

**如果部署失败：**

1. **快速回滚（恢复旧版本）**
   ```bash
   ssh root@server
   cd /var/www/math-education
   rm -rf dist
   mv dist.previous dist
   nginx -s reload
   ```

2. **GitHub Actions 回滚**
   ```bash
   git revert HEAD
   git push origin main
   # 触发自动部署
   ```

3. **服务器回滚（从快照恢复）**
   - 阿里云控制台 → ECS → 快照 → 回滚
   - 选择最近的正常快照

## 开放问题

### 待定决策

1. **是否需要监控告警？**
   - 当前：按需检查
   - 未来：可以配置服务器监控（CPU、内存、流量）
   - 成本：免费（阿里云云监控）

2. **是否需要备份数据？**
   - 当前：静态文件，无需备份
   - 未来：如果添加数据库，需要配置自动备份
   - 成本：约 ¥10/月（OSS 存储）

3. **是否需要 CDN 加速？**
   - 当前：ECS 直接访问，速度足够
   - 未来：如果流量大，可以添加阿里云 CDN
   - 成本：约 ¥20/月（100GB 流量）

4. **是否需要容器化？**
   - 当前：直接部署，简单快速
   - 未来：如果项目复杂，可以考虑 Docker
   - 收益：环境隔离，易于扩展

### 未来优化方向

- [ ] 配置服务器监控和告警
- [ ] 添加自动备份策略
- [ ] 集成 CDN 加速
- [ ] 配置 CI/CD 测试环境
- [ ] 添加灰度发布能力
- [ ] 配置日志收集和分析
