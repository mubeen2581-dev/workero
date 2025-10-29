#!/bin/bash

# Server Setup Script for Workero Platform
# Run this on the server: forge@91.98.17.145

echo "🔧 Setting up Workero Platform server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Create application directory
sudo mkdir -p /var/www/workero
sudo chown -R forge:forge /var/www/workero

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/workero.xepos.co.uk << EOF
server {
    listen 80;
    server_name workero.xepos.co.uk;
    root /var/www/workero/admin-dashboard;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/workero.xepos.co.uk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Install SSL certificate
sudo apt install certbot python3-certbot-nginx -y

# Test Nginx configuration
sudo nginx -t

# Start services
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "✅ Server setup complete!"
echo "📝 Next steps:"
echo "1. Upload your application files to /var/www/workero/"
echo "2. Run: sudo certbot --nginx -d workero.xepos.co.uk"
echo "3. Configure DNS to point workero.xepos.co.uk to 91.98.17.145"