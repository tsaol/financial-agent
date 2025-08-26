#!/bin/bash

# Financial Analysis Agent - 生产环境配置脚本
# 使用方法: ./scripts/setup-production.sh your-domain.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ 错误: 请提供域名"
    echo "使用方法: ./scripts/setup-production.sh your-domain.com"
    exit 1
fi

echo "🚀 开始配置 Financial Analysis Agent 生产环境..."
echo "🌐 域名: $DOMAIN"

# 1. 创建生产环境配置
echo "📝 创建环境配置文件..."
cat > .env.production << EOF
# 生产环境配置
NEXT_PUBLIC_API_BASE_URL=https://$DOMAIN
BACKEND_URL=http://localhost:8000
EOF

echo "✅ 已创建 .env.production"

# 2. 创建 PM2 配置
echo "📝 创建 PM2 配置文件..."
cat > ecosystem.config.js << 'EOF'
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
EOF

echo "✅ 已创建 ecosystem.config.js"

# 3. 创建 Nginx 配置
echo "📝 创建 Nginx 配置文件..."
sudo tee /etc/nginx/sites-available/financial-agent > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # 前端和 API 路由
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

echo "✅ 已创建 Nginx 配置"

# 4. 启用 Nginx 站点
echo "🔗 启用 Nginx 站点..."
sudo ln -sf /etc/nginx/sites-available/financial-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx 配置已生效"

# 5. 创建部署脚本
echo "📝 创建部署脚本..."
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 开始部署 Financial Analysis Agent..."

# 更新代码
echo "📥 拉取最新代码..."
git pull origin main

# 构建前端
echo "🔨 构建前端..."
npm install
npm run build

# 更新后端依赖
echo "🐍 更新后端依赖..."
cd py-backend
source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 重启服务
echo "🔄 重启服务..."
pm2 restart all

echo "✅ 部署完成！"
echo "🌐 访问地址: https://DOMAIN_PLACEHOLDER"
EOF

# 替换域名占位符
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" deploy.sh
chmod +x deploy.sh

echo "✅ 已创建部署脚本 deploy.sh"

# 6. 显示后续步骤
echo ""
echo "🎉 配置完成！接下来请执行以下步骤："
echo ""
echo "1️⃣  安装依赖并构建："
echo "   npm install && npm run build"
echo ""
echo "2️⃣  设置 Python 后端："
echo "   cd py-backend"
echo "   python3 -m venv .venv"
echo "   source .venv/bin/activate"
echo "   pip install -r requirements.txt"
echo "   cd .."
echo ""
echo "3️⃣  启动服务："
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "4️⃣  配置 SSL (推荐)："
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "5️⃣  后续更新使用："
echo "   ./deploy.sh"
echo ""
echo "🌐 配置的域名: https://$DOMAIN"
echo "📚 详细文档: 查看 DEPLOYMENT.md"