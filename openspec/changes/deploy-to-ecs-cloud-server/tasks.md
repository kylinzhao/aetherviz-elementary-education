# 部署到云服务器 - 执行清单

## 📋 总览

**目标：** 将 AetherViz 小学教学项目部署到阿里云 ECS，并配置 GitHub Actions 自动化部署

**预计时间：** 4-5 小时（分 4 个阶段完成）

**预计成本：** ¥70-90/月

---

## 阶段 1：购买和配置云服务器（2-3 小时）

### 1.1 购买 ECS 实例

- [ ] 1.1.1 登录阿里云控制台（https://ecs-buy.aliyun.com/）
- [ ] 1.1.2 选择付费模式：按量付费
- [ ] 1.1.3 选择实例规格：ecs.t6-c1m2.large（2核4GB）
- [ ] 1.1.4 选择镜像：Ubuntu 22.04 64位
- [ ] 1.1.5 选择系统盘：40GB ESSD Entry
- [ ] 1.1.6 选择带宽：5Mbps（按使用付费）
- [ ] 1.1.7 确认订单并支付（约 ¥0.008/小时）

### 1.2 配置安全组

- [ ] 1.2.1 进入 ECS 控制台 → 实例列表
- [ ] 1.2.2 点击实例名称 → 安全组标签
- [ ] 1.2.3 点击"配置规则" → "添加安全组规则"
- [ ] 1.2.4 添加入方向规则：
  - [ ] 端口 22，协议 TCP，授权对象 0.0.0.0/0（SSH）
  - [ ] 端口 80，协议 TCP，授权对象 0.0.0.0/0（HTTP）
  - [ ] 端口 443，协议 TCP，授权对象 0.0.0.0/0（HTTPS）
- [ ] 1.2.5 保存配置

### 1.3 获取服务器信息

- [ ] 1.3.1 记录 ECS 公网 IP：_____________
- [ ] 1.3.2 记录root用户密码：_____________
- [ ] 1.3.3 测试 SSH 连接：`ssh root@<公网IP>`

### 1.4 初始化服务器环境

- [ ] 1.4.1 SSH 登录服务器
- [ ] 1.4.2 更新系统：
  ```bash
  apt update && apt upgrade -y
  ```
- [ ] 1.4.3 设置时区（可选）：
  ```bash
  timedatectl set-timezone Asia/Shanghai
  ```
- [ ] 1.4.4 安装必要软件：
  ```bash
  apt install -y nginx git nodejs npm curl ufw
  ```
- [ ] 1.4.5 安装 PM2（进程管理器）：
  ```bash
  npm install -g pm2
  ```
- [ ] 1.4.6 验证安装：
  ```bash
  nginx -v
  node -v
  npm -v
  git --version
  ```

### 1.5 配置防火墙

- [ ] 1.5.1 允许 SSH：
  ```bash
  ufw allow 22
  ```
- [ ] 1.5.2 允许 HTTP：
  ```bash
  ufw allow 80
  ```
- [ ] 1.5.3 允许 HTTPS：
  ```bash
  ufw allow 443
  ```
- [ ] 1.5.4 启用防火墙：
  ```bash
  ufw enable
  ```
- [ ] 1.5.5 查看状态：
  ```bash
  ufw status
  ```

### 1.6 创建项目目录

- [ ] 1.6.1 创建项目根目录：
  ```bash
  mkdir -p /var/www
  ```
- [ ] 1.6.2 创建共享目录：
  ```bash
  mkdir -p /var/www/shared/{ssl,logs,backups}
  ```
- [ ] 1.6.3 创建数学教育项目目录：
  ```bash
  mkdir -p /var/www/math-education
  ```
- [ ] 1.6.4 设置目录权限：
  ```bash
  chown -R www-data:www-data /var/www
  chmod -R 755 /var/www
  ```

### 1.7 测试 Nginx

- [ ] 1.7.1 启动 Nginx：
  ```bash
  systemctl start nginx
  systemctl enable nginx
  ```
- [ ] 1.7.2 访问默认页面：http://<公网IP>
- [ ] 1.7.3 检查 Nginx 状态：
  ```bash
  systemctl status nginx
  ```

---

## 阶段 2：域名和 SSL 配置（1-2 小时）

### 2.1 配置域名解析

- [ ] 2.1.1 登录域名服务商控制台
- [ ] 2.1.2 添加 A 记录：
  - 主机记录：`math`，记录值：`<公网IP>`
  - 主机记录：`photo`，记录值：`<公网IP>`
  - 主机记录：`@`，记录值：`<公网IP>`
  - 主机记录：`www`，记录值：`<公网IP>`
- [ ] 2.1.3 等待 DNS 生效（5-10 分钟）
- [ ] 2.1.4 验证解析：
  ```bash
  nslookup math.yourdomain.com
  ```

### 2.2 配置 Nginx 虚拟主机

- [ ] 2.2.1 创建站点配置：
  ```bash
  nano /etc/nginx/sites-available/math-education
  ```
- [ ] 2.2.2 粘贴以下配置：
  ```nginx
  server {
      listen 80;
      server_name math.yourdomain.com;

      root /var/www/math-education/dist;
      index index.html;

      # Gzip 压缩
      gzip on;
      gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

      location / {
          try_files $uri $uri/ /index.html;
      }

      # 静态资源缓存
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
      }
  }
  ```
- [ ] 2.2.3 保存文件（Ctrl+X，Y，Enter）
- [ ] 2.2.4 启用站点：
  ```bash
  ln -s /etc/nginx/sites-available/math-education /etc/nginx/sites-enabled/
  ```
- [ ] 2.2.5 测试配置：
  ```bash
  nginx -t
  ```
- [ ] 2.2.6 重载 Nginx：
  ```bash
  nginx -s reload
  ```

### 2.3 安装 Certbot

- [ ] 2.3.1 安装 Certbot：
  ```bash
  apt install certbot python3-certbot-nginx -y
  ```
- [ ] 2.3.2 验证安装：
  ```bash
  certbot --version
  ```

### 2.4 申请 SSL 证书

- [ ] 2.4.1 运行 Certbot：
  ```bash
  certbot --nginx -d math.yourdomain.com
  ```
- [ ] 2.4.2 按提示输入：
  - 邮箱地址：_____________
  - 同意服务条款：Y
  - 是否共享邮箱：N
  - 选择重定向选项：2（重定向到 HTTPS）
- [ ] 2.4.3 验证证书：
  ```bash
  curl https://math.yourdomain.com
  ```
- [ ] 2.4.4 检查自动续期：
  ```bash
  certbot renew --dry-run
  ```

---

## 阶段 3：配置自动化部署（1 小时）

### 3.1 生成 SSH 密钥对

- [ ] 3.1.1 本地生成密钥：
  ```bash
  ssh-keygen -t rsa -b 4096 -C "github-actions"
  ```
- [ ] 3.1.2 按提示操作：
  - 保存路径：默认（~/.ssh/id_rsa）
  - 密码：可选（直接回车跳过）
- [ ] 3.1.3 查看公钥：
  ```bash
  cat ~/.ssh/id_rsa.pub
  ```
- [ ] 3.1.4 复制公钥内容（整段复制）

### 3.2 配置服务器免密登录

- [ ] 3.2.1 复制公钥到服务器：
  ```bash
  ssh-copy-id -i ~/.ssh/id_rsa.pub root@<公网IP>
  ```
- [ ] 3.2.2 输入服务器密码
- [ ] 3.2.3 测试免密登录：
  ```bash
  ssh root@<公网IP>
  ```
- [ ] 3.2.4 如果不需要密码，说明配置成功

### 3.3 配置 GitHub Secrets

- [ ] 3.3.1 打开 GitHub 仓库 → Settings → Secrets and variables → Actions
- [ ] 3.3.2 点击"New repository secret"
- [ ] 3.3.3 添加 Secrets：

  **Secret 1: SSH_PRIVATE_KEY**
  - Name: `SSH_PRIVATE_KEY`
  - Value: 本地执行 `cat ~/.ssh/id_rsa`，复制全部内容（包括 BEGIN/END 行）

  **Secret 2: REMOTE_HOST**
  - Name: `REMOTE_HOST`
  - Value: `<公网IP>`

  **Secret 3: REMOTE_USER**
  - Name: `REMOTE_USER`
  - Value: `root`

  **Secret 4: REMOTE_PORT**
  - Name: `REMOTE_PORT`
  - Value: `22`

### 3.4 创建 GitHub Actions 工作流

- [ ] 3.4.1 在项目根目录创建目录：
  ```bash
  mkdir -p .github/workflows
  ```
- [ ] 3.4.2 创建工作流文件：
  ```bash
  nano .github/workflows/deploy.yml
  ```
- [ ] 3.4.3 粘贴以下内容（见下方完整配置）
- [ ] 3.4.4 保存文件

**GitHub Actions 配置内容：**
```yaml
name: Deploy to ECS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v3

      # 2. 设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. 安装依赖
      - name: Install dependencies
        run: npm ci

      # 4. 构建项目
      - name: Build
        run: npm run build

      # 5. 部署到服务器
      - name: Deploy to ECS
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/math-education

      # 6. 重启 Nginx
      - name: Restart Nginx
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/math-education
            nginx -t && nginx -s reload
            echo "✅ Deploy successful!"
```

### 3.5 测试自动部署

- [ ] 3.5.1 提交工作流文件：
  ```bash
  git add .github/workflows/deploy.yml
  git commit -m "Add GitHub Actions workflow"
  ```
- [ ] 3.5.2 推送到 GitHub：
  ```bash
  git push origin main
  ```
- [ ] 3.5.3 在 GitHub 查看 Actions 标签页
- [ ] 3.5.4 点击工作流查看执行日志
- [ ] 3.5.5 等待执行完成（约 2-3 分钟）
- [ ] 3.5.6 验证部署：
  ```bash
  ssh root@<公网IP>
  ls -la /var/www/math-education/
  ```

---

## 阶段 4：部署当前项目（30 分钟）

### 4.1 构建当前项目

- [ ] 4.1.1 本地构建测试：
  ```bash
  npm run build
  ```
- [ ] 4.1.2 检查构建产物：
  ```bash
  ls -la dist/
  ```
- [ ] 4.1.3 如果构建成功，继续下一步

### 4.2 首次手动部署

- [ ] 4.2.1 手动上传构建产物：
  ```bash
  scp -r dist/* root@<公网IP>:/var/www/math-education/dist/
  ```
- [ ] 4.2.2 访问测试：
  - [ ] https://math.yourdomain.com
  - [ ] 检查页面是否正常显示
  - [ ] 检查 3D 场景是否加载
  - [ ] 检查路由是否正常

### 4.3 触发自动部署

- [ ] 4.3.1 修改代码（例如：修改首页标题）
- [ ] 4.3.2 提交代码：
  ```bash
  git add .
  git commit -m "Test auto deployment"
  git push origin main
  ```
- [ ] 4.3.3 等待 GitHub Actions 执行
- [ ] 4.3.4 访问 https://math.yourdomain.com
- [ ] 4.3.5 验证修改已生效

### 4.4 验证完整功能

- [ ] 4.4.1 检查所有课程页面：
  - [ ] /lesson/multiplication
  - [ ] /lesson/division
  - [ ] /lesson/fraction
  - [ ] 其他课程...
- [ ] 4.4.2 检查 3D 可视化
- [ ] 4.4.3 检查任务系统
- [ ] 4.4.4 检查测验游戏
- [ ] 4.4.5 检查响应式布局（移动端）

---

## 阶段 5：优化和维护（可选）

### 5.1 配置服务器监控

- [ ] 5.1.1 安装 htop：
  ```bash
  apt install htop
  ```
- [ ] 5.1.2 配置云监控（阿里云控制台）

### 5.2 配置自动备份

- [ ] 5.2.1 创建备份脚本：
  ```bash
  nano /root/backup.sh
  ```
- [ ] 5.2.2 添加备份任务到 crontab

### 5.3 安全加固

- [ ] 5.3.1 安装 fail2ban：
  ```bash
  apt install fail2ban -y
  ```
- [ ] 5.3.2 禁用密码登录：
  ```bash
  sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
  systemctl restart sshd
  ```

### 5.4 配置日志轮转

- [ ] 5.4.1 配置 Nginx 日志轮转
- [ ] 5.4.2 配置系统日志轮转

---

## 🎯 完成标准

当所有任务完成后，你应该能够：

✅ **通过域名访问项目**
- https://math.yourdomain.com 可正常访问
- 所有功能正常工作

✅ **自动化部署**
- Git Push 后自动构建部署
- 无需手动操作服务器

✅ **安全可靠**
- SSL 证书有效
- 防火墙规则生效
- SSH 密钥认证

✅ **成本可控**
- 月度成本约 ¥70-90
- 资源使用合理

---

## 📝 常用命令备忘录

### 服务器管理

```bash
# SSH 登录
ssh root@<公网IP>

# 查看 Nginx 状态
systemctl status nginx

# 重启 Nginx
nginx -s reload

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看进程
htop
```

### 域名和 SSL

```bash
# 查看证书有效期
certbot certificates

# 手动续期证书
certbot renew

# 测试 Nginx 配置
nginx -t

# 重新加载 Nginx
nginx -s reload
```

### 部署相关

```bash
# 手动部署（如果自动部署失败）
npm run build
scp -r dist/* root@<公网IP>:/var/www/math-education/dist/
ssh root@<公网IP> "nginx -s reload"

# 查看部署后的文件
ssh root@<公网IP> "ls -la /var/www/math-education/"
```

---

## 🆘 故障排查

### 问题 1：无法访问网站

**检查步骤：**
1. 检查 ECS 是否运行：阿里云控制台
2. 检查安全组规则：端口 80/443 是否开放
3. 检查 Nginx 状态：`systemctl status nginx`
4. 检查防火墙：`ufw status`
5. 检查域名解析：`nslookup math.yourdomain.com`

### 问题 2：SSL 证书错误

**检查步骤：**
1. 检查证书有效期：`certbot certificates`
2. 手动续期：`certbot renew`
3. 检查 Nginx 配置：`nginx -t`
4. 重启 Nginx：`nginx -s reload`

### 问题 3：自动部署失败

**检查步骤：**
1. 查看 GitHub Actions 日志
2. 检查 Secrets 是否正确配置
3. 测试 SSH 连接：`ssh root@<公网IP>`
4. 检查服务器磁盘空间：`df -h`
5. 检查构建产物：`ls -la dist/`

### 问题 4：页面显示异常

**检查步骤：**
1. 清除浏览器缓存
2. 检查构建是否成功：`npm run build`
3. 查看浏览器控制台错误（F12）
4. 检查 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

---

## ✅ 完成后

所有任务完成后，你可以：

1. **分享你的网站**
   - https://math.yourdomain.com
   - 发给朋友、家人、同事

2. **继续开发**
   - 本地开发 → Git Push → 自动部署
   - 无需考虑部署问题

3. **添加更多项目**
   - 重复相同的步骤
   - 部署摄影作品、个人主页等

4. **优化和改进**
   - 配置 CDN 加速
   - 添加监控告警
   - 优化性能和成本

---

**部署愉快！** 🚀
