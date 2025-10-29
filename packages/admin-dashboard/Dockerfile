# Multi-stage build for Admin Dashboard
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/admin-dashboard/package.json ./packages/admin-dashboard/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY packages/admin-dashboard ./packages/admin-dashboard
COPY packages/shared ./packages/shared

# Build the application
RUN npm run build --workspace=packages/admin-dashboard

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=base /app/packages/admin-dashboard/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/admin-dashboard/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
