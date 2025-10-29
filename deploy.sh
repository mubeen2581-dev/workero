#!/bin/bash

# Workero Platform Deployment Script
# Server: 91.98.17.145 (forge@hetzner)
# Domain: workero.xepos.co.uk

set -e

echo "🚀 Deploying Workero Platform to workero.xepos.co.uk"

# Build the admin dashboard
echo "📦 Building admin dashboard..."
npm run build:admin

# Create deployment directory structure
echo "📁 Creating deployment structure..."
mkdir -p deploy/admin-dashboard
mkdir -p deploy/nginx

# Copy built files
cp -r packages/admin-dashboard/dist/* deploy/admin-dashboard/
cp nginx.conf deploy/nginx/
cp docker-compose.yml deploy/

# Create production environment file
cat > deploy/.env << EOF
NODE_ENV=production
VITE_API_URL=https://api.workero.xepos.co.uk
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
DOMAIN=workero.xepos.co.uk
EOF

echo "✅ Deployment package ready in ./deploy/"
echo "📤 Upload to server: scp -r deploy/* forge@91.98.17.145:/var/www/workero/"