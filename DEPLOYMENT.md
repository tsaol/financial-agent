# 部署配置指南

本文档详细说明如何将 Financial Analysis Agent 部署到生产服务器。

## 环境变量配置

### 1. 环境变量说明

| 变量名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 前端 | 浏览器可访问的后端 API 地址 | `https://your-domain.com` |
| `BACKEND_URL` | 后端 | 服务器内部后端服务地址 | `http://localhost:8000` |

### 2. 本地开发配置

创建 `.env.local` 文件：
```bash
# 本地开发环境
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000
```

### 3. 生产环境配置

创建 `.env.production` 文件：
```bash
# 生产环境配置
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
BACKEND_URL=http://localhost:8000
```

## 部署步骤

### 步骤 1: 服务器准备

1. **安装依赖**
```bash
# 安装 Node.js (18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Python (3.10+)
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip

# 安装 PM2 (进程管理)
sudo npm install -g pm2
```

2. **克隆项目**
```bash
git clone <your-repo-url>
cd financial-agent
```

### 步骤 2: 前端配置

1. **安装前端依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
# 创建生产环境配置
cp .env.example .env.production

# 编辑配置文件
nano .env.production
```

在 `.env.production` 中设置：
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
BACKEND_URL=http://localhost:8000
```

3. **构建前端**
```bash
npm run build
```

### 步骤 3: 后端配置

1. **创建 Python 虚拟环境**
```bash
cd py-backend
python3 -m venv .venv
source .venv/bin/activate
```

2. **安装后端依赖**
```bash
pip install -r requirements.txt
```

3. **配置 AWS 凭证** (如果使用 AWS Bedrock)
```bash
# 方法 1: 使用 AWS CLI
aws configure

# 方法 2: 使用已配置好的 profile（或 IAM 角色 / IAM Identity Center）
export AWS_PROFILE=your-profile
export AWS_DEFAULT_REGION=us-west-2
```

### 步骤 4: 进程管理配置

1. **创建 PM2 配置文件**
```bash
# 在项目根目录创建
nano ecosystem.config.js
```

2. **PM2 配置内容**
```
javascript
module.exports = {
  apps: [
    {
      name: 'financial-agent-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'financial-agent-backend',
      script: 'python',
      args: 'app/app.py',
      cwd: './py-backend',
      interpreter: './py-backend/.venv/bin/python',
      env: {
        PYTHONPATH: './py-backend',
        PORT: 8000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G'
    }
  ]
};
```

### 步骤 5: Nginx 配置

1. **安装 Nginx**
```bash
sudo apt update
sudo apt install nginx
```

2. **创建 Nginx 配置**
```bash
sudo nano /etc/nginx/sites-available/financial-agent
```

3. **Nginx 配置内容**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 前端静态文件和 Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # API 路由通过 Next.js 处理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

4. **启用站点配置**
```bash
sudo ln -s /etc/nginx/sites-available/financial-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 6: SSL 证书配置 (可选但推荐)

1. **安装 Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **获取 SSL 证书**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 步骤 7: 启动服务

1. **启动应用**
```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

2. **设置开机自启**
```bash
pm2 startup
pm2 save
```

## 验证部署

### 1. 检查服务状态
```bash
# 检查 PM2 进程
pm2 status

# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000

# 检查 Nginx 状态
sudo systemctl status nginx
```

### 2. 测试访问
```bash
# 测试前端
curl http://localhost:3000

# 测试后端健康检查
curl http://localhost:8000/health

# 测试域名访问
curl https://your-domain.com
```

## 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查找占用进程
sudo lsof -i :3000
sudo lsof -i :8000

# 杀死进程
sudo kill -9 <PID>
```

2. **环境变量未生效**
```bash
# 检查环境变量
pm2 show financial-agent-frontend
pm2 show financial-agent-backend

# 重启服务
pm2 restart all
```

3. **Python 依赖问题**
```bash
# 重新安装依赖
cd py-backend
source .venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

4. **权限问题**
```bash
# 修复文件权限
sudo chown -R $USER:$USER /path/to/your/project
chmod +x py-backend/.venv/bin/python
```

### 日志查看

```bash
# PM2 日志
pm2 logs financial-agent-frontend
pm2 logs financial-agent-backend

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 系统日志
journalctl -u nginx -f
```

## 更新部署

### 更新代码
```bash
# 拉取最新代码
git pull origin main

# 更新前端
npm install
npm run build
pm2 restart financial-agent-frontend

# 更新后端
cd py-backend
source .venv/bin/activate
pip install -r requirements.txt
cd ..
pm2 restart financial-agent-backend
```

## 监控和维护

### 设置监控
```bash
# PM2 监控
pm2 monit

# 设置日志轮转
pm2 install pm2-logrotate
```

### 定期维护
```bash
# 清理 PM2 日志
pm2 flush

# 更新系统包
sudo apt update && sudo apt upgrade

# 重启服务器 (如需要)
sudo reboot
```

## 安全建议

1. **防火墙配置**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **定期备份**
```bash
# 备份数据库和配置文件
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/your/project
```

3. **监控资源使用**
```bash
# 安装 htop
sudo apt install htop

# 监控系统资源
htop
```

---

## 快速部署脚本

创建一键部署脚本 `deploy.sh`：

```bash
#!/bin/bash
set -e

echo "🚀 开始部署 Financial Analysis Agent..."

# 更新代码
echo "📥 拉取最新代码..."
git pull origin main

# 安装前端依赖并构建
echo "🔨 构建前端..."
npm install
npm run build

# 安装后端依赖
echo "🐍 安装后端依赖..."
cd py-backend
source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 重启服务
echo "🔄 重启服务..."
pm2 restart all

echo "✅ 部署完成！"
echo "🌐 访问地址: https://your-domain.com"
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh
```