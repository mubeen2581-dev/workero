# Workero Platform

A comprehensive field service management platform built with React, TypeScript, and modern web technologies.

## 🏗️ Architecture

This is a monorepo containing multiple applications and shared packages:

```
workero-platform/
├── packages/
│   ├── shared/                    # Shared types, services, and utilities
│   ├── admin-dashboard/           # Admin dashboard (React + TypeScript)
│   ├── driver-app/                # Driver mobile app (React Native)
│   ├── client-portal/             # Client portal (React + TypeScript)
│   └── warehouse-panel/           # Warehouse management (React + TypeScript)
├── backend/                       # Shared backend API (Node.js + Express)
├── docs/                          # Documentation
└── scripts/                       # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- React Native CLI (for mobile development)
- Android Studio / Xcode (for mobile development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/workero/platform.git
   cd workero-platform
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start development servers:**
   ```bash
   # Start admin dashboard
   npm run dev:admin

   # Start driver app (in separate terminal)
   npm run dev:driver

   # Start client portal (in separate terminal)
   npm run dev:client

   # Start backend API (in separate terminal)
   npm run dev:backend
   ```

## 📱 Applications

### Admin Dashboard
- **Technology:** React + TypeScript + Vite
- **Purpose:** Business management, scheduling, analytics
- **URL:** http://localhost:3000
- **Features:** CRM, Quotes, Jobs, Scheduling, Inventory, Invoicing, Reports

### Driver App
- **Technology:** React Native
- **Purpose:** Field technician mobile app
- **Features:** Job management, clock in/out, photo capture, GPS tracking

### Client Portal
- **Technology:** React + TypeScript + Vite
- **Purpose:** Customer-facing interface
- **Features:** Quote approval, job status, payments, feedback

### Warehouse Panel
- **Technology:** React + TypeScript + Vite
- **Purpose:** Inventory and stock management
- **Features:** Stock tracking, transfers, barcode scanning

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start admin dashboard
npm run dev:admin             # Start admin dashboard
npm run dev:driver            # Start driver app
npm run dev:client            # Start client portal
npm run dev:backend           # Start backend API

# Building
npm run build                 # Build all packages
npm run build:admin           # Build admin dashboard
npm run build:driver          # Build driver app
npm run build:client          # Build client portal
npm run build:backend         # Build backend API

# Testing
npm run test                  # Run all tests
npm run lint                  # Lint all packages

# Utilities
npm run clean                 # Clean all build artifacts
```

### Package Management

This monorepo uses npm workspaces for package management:

```bash
# Install dependency in specific package
npm install <package> --workspace=packages/admin-dashboard

# Install dependency in all packages
npm install <package> --workspaces

# Run script in specific package
npm run dev --workspace=packages/admin-dashboard
```

## 📦 Shared Package

The `@workero/shared` package contains:

- **Types:** TypeScript interfaces for all entities
- **Services:** API client, authentication, common services
- **Utils:** Date formatting, currency formatting, validation
- **Constants:** API endpoints, configuration

### Usage

```typescript
import { User, apiService, authService } from '@workero/shared';

// Use shared types
const user: User = { ... };

// Use shared services
const response = await apiService.get<User[]>('/users');
```

## 🔐 Authentication

The platform supports multiple authentication methods:

- **Admin Dashboard:** Email/password with JWT tokens
- **Driver App:** Phone number + OTP verification
- **Client Portal:** Email/password with limited access
- **Warehouse Panel:** Email/password with inventory permissions

## 🌐 API Integration

### XE Pay Integration
- Payment processing
- Payment links
- Automated reminders
- Multi-currency support

### WhatsApp Integration (WhatsHub)
- Message templates
- File sharing
- Auto-responses
- Conversation management

### Google Maps Integration
- Location services
- Route optimization
- Geofencing
- Real-time tracking

## 📊 Features

### Core Business Functions
- ✅ **CRM & Leads** - Complete lead management
- ✅ **Quotes & Estimates** - Professional quote generation
- ✅ **Job Management** - Kanban board with drag-drop
- ✅ **Scheduling** - Calendar with smart dispatch
- ✅ **Inventory** - Stock management and tracking
- ✅ **Invoicing** - Automated billing and payments
- ✅ **Analytics** - Comprehensive reporting

### Advanced Features
- ✅ **Communication Hub** - WhatsApp integration
- ✅ **Smart Dispatch** - AI-powered technician matching
- ✅ **Van Stock Management** - Per-technician inventory
- ✅ **Live Tracking** - Real-time location services
- ✅ **Compliance** - Document management and RAMS

## 🚀 Deployment

### Production Build

```bash
# Build all packages
npm run build

# Deploy admin dashboard
npm run build:admin
# Deploy to your hosting platform

# Deploy driver app
npm run build:driver
# Upload to app stores

# Deploy client portal
npm run build:client
# Deploy to your hosting platform

# Deploy backend
npm run build:backend
# Deploy to your server
```

### Environment Variables

Create `.env` files in each package:

```bash
# packages/admin-dashboard/.env
VITE_API_URL=https://api.workero.com
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# packages/driver-app/.env
REACT_APP_API_URL=https://api.workero.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here

# backend/.env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
XE_PAY_API_KEY=your_xe_pay_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@workero.com
- Documentation: https://docs.workero.com
- Issues: https://github.com/workero/platform/issues