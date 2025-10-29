# Workero Platform Deployment Guide

## Server Details
- **IP**: 91.98.17.145
- **User**: forge
- **Domain**: workero.xepos.co.uk
- **Key**: hetzner-demo.pem

## Quick Deployment Steps

### 1. Connect to Server
```bash
# Using PEM key
ssh -i hetzner-demo.pem forge@91.98.17.145

# Using PPK key (Windows/PuTTY)
# Use hetzner-demo.ppk with PuTTY
```

### 2. Setup Server (Run once)
```bash
# Upload and run server setup
scp -i hetzner-demo.pem server-setup.sh forge@91.98.17.145:~/
ssh -i hetzner-demo.pem forge@91.98.17.145 'chmod +x server-setup.sh && ./server-setup.sh'
```

### 3. Build and Deploy Application
```bash
# On your local machine
npm run build:admin
chmod +x deploy.sh
./deploy.sh

# Upload to server
scp -i hetzner-demo.pem -r deploy/* forge@91.98.17.145:/var/www/workero/
```

### 4. Configure SSL (On server)
```bash
sudo certbot --nginx -d workero.xepos.co.uk
```

### 5. DNS Configuration
Point `workero.xepos.co.uk` A record to `91.98.17.145`

## File Structure on Server
```
/var/www/workero/
├── admin-dashboard/     # Built React app
├── nginx.conf          # Nginx configuration
├── docker-compose.yml  # Docker services
└── .env               # Environment variables
```

## Useful Commands

### Check Status
```bash
sudo systemctl status nginx
sudo nginx -t
curl -I http://workero.xepos.co.uk
```

### Update Deployment
```bash
# Local: rebuild and upload
npm run build:admin
scp -i hetzner-demo.pem -r packages/admin-dashboard/dist/* forge@91.98.17.145:/var/www/workero/admin-dashboard/

# Server: restart nginx
sudo systemctl reload nginx
```

### Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Permission Issues
```bash
sudo chown -R forge:forge /var/www/workero
sudo chmod -R 755 /var/www/workero
```

### Nginx Issues
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Issues
```bash
sudo certbot renew --dry-run
```