# Workero Admin Dashboard

A modern, production-ready admin dashboard for the Workero platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Phase 1 - Core Layout + Auth + Dashboard

This phase includes the foundational components and dashboard overview with KPI widgets, navigation, and authentication.

### Features Implemented

- ✅ **App Shell**: React Router with protected routes and mock JWT authentication
- ✅ **Layout Components**: Collapsible sidebar, topbar with search, user menu, and footer
- ✅ **Dashboard Page**: KPI widgets, revenue chart, job status overview, activity feed, and recent invoices
- ✅ **Design System**: Tailwind CSS with custom design tokens and consistent styling
- ✅ **State Management**: Zustand stores for authentication and UI state
- ✅ **Mock Data**: Realistic sample data for all dashboard components
- ✅ **Storybook**: Component stories for key UI elements
- ✅ **Testing**: Unit tests for critical components
- ✅ **TypeScript**: Full type safety with comprehensive interfaces

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library
- **Documentation**: Storybook
- **Icons**: Lucide React

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Create the project** (run this locally):
   ```bash
   npm create vite@latest workero-admin -- --template react-ts
   cd workero-admin
   npm install
   ```

2. **Install dependencies**:
   ```bash
   npm install react-router-dom axios @tanstack/react-query zustand react-hook-form @hookform/resolvers zod react-beautiful-dnd recharts react-big-calendar rrule date-fns react-signature-canvas react-infinite-scroll-component react-toastify framer-motion lucide-react @react-google-maps/api react-datepicker i18next react-i18next
   ```

3. **Install dev dependencies**:
   ```bash
   npm install -D @types/react-beautiful-dnd @types/react-signature-canvas @types/react-datepicker @types/rrule @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react autoprefixer eslint eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks postcss prettier tailwindcss tailwindcss-typography @tailwindcss/forms @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/blocks @storybook/react @storybook/react-vite @storybook/testing-library storybook jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest
   ```

4. **Copy the project files** from this repository to your local project

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

### Demo Login

Use these credentials to access the dashboard:
- **Email**: `admin@workero.com`
- **Password**: `password123`

## 📁 Project Structure

```
src/
├── api/                    # API client and services
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── KPI.tsx
│   │   └── Modal.tsx
│   ├── Layout/            # Layout components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── UserMenu.tsx
│   │   ├── Logo.tsx
│   │   └── Footer.tsx
│   ├── Charts/            # Chart components
│   │   ├── RevenueChart.tsx
│   │   └── JobStatusChart.tsx
│   └── Dashboard/         # Dashboard-specific components
│       ├── ActivityFeed.tsx
│       ├── RecentInvoices.tsx
│       └── QuickActions.tsx
├── pages/                 # Page components
│   ├── Dashboard.tsx
│   └── Login.tsx
├── stores/                # Zustand stores
│   ├── authStore.ts
│   └── uiStore.ts
├── mocks/                 # Mock data
│   └── dashboard.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── styles/                # Global styles and design tokens
│   ├── globals.css
│   └── tokens.ts
├── stories/               # Storybook stories
│   ├── Sidebar.stories.tsx
│   ├── KPICard.stories.tsx
│   └── RevenueChart.stories.tsx
└── App.tsx               # Main app component
```

## 🎨 Design System

### Colors
- **Primary**: Blue palette (#0ea5e9)
- **Secondary**: Gray palette (#64748b)
- **Success**: Green palette (#22c55e)
- **Warning**: Yellow palette (#f59e0b)
- **Error**: Red palette (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px to 36px scale
- **Weights**: 400, 500, 600, 700

### Spacing
- **Scale**: 4px base unit (0.25rem to 6rem)
- **Border Radius**: 4px to 32px scale
- **Shadows**: Soft, medium, and large variants

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage
- KPI Card component rendering and data formatting
- Sidebar navigation items and badge counts
- Authentication flow (mock)
- Form validation

## 📚 Storybook

View component documentation and examples:
```bash
npm run storybook
```

Available stories:
- **Layout/Sidebar**: Navigation component with collapsed/expanded states
- **UI/KPICard**: Metric display cards with different data types
- **Charts/RevenueChart**: Line chart with revenue data

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS with custom theme
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Prettier formatting rules

## 📊 Dashboard Components

### KPI Widgets
- **Total Revenue**: £125,430 (+12.5%)
- **Active Jobs**: 24 (-2)
- **New Leads**: 18 (+8.2%)
- **Conversion Rate**: 68.5% (+3.1%)

### Charts
- **Revenue Trend**: 12-month line chart with tooltips
- **Job Status**: Pie chart showing job distribution

### Activity Feed
- Real-time updates for leads, quotes, jobs, and payments
- User attribution and timestamps
- Activity type icons and colors

### Recent Invoices
- Payment status tracking
- Client information
- Amount and due date display

## 🔐 Authentication

Mock authentication system with:
- JWT token simulation
- Protected routes
- User session persistence
- Role-based access (admin, manager, technician, dispatcher)

## 🎯 Next Phases

- **Phase 2**: Leads & CRM UI
- **Phase 3**: Quotes & Estimates UI  
- **Phase 4**: Job Management (Kanban) + Job Detail
- **Phase 5**: Scheduling Calendar & Dispatch
- **Phase 6**: Inventory & Van Stock
- **Phase 7**: Invoicing, Payments & Client Portal
- **Phase 8**: Reporting & Analytics
- **Phase 9**: Settings, Roles & Permissions

## 📝 API Contracts

### Sample Endpoints (Mock)
```typescript
// Dashboard data
GET /api/dashboard/kpis -> KPIMetric[]
GET /api/dashboard/revenue -> ChartData[]
GET /api/dashboard/activities -> Activity[]

// Authentication
POST /api/auth/login -> { user: User, token: string }
POST /api/auth/logout -> void

// Future endpoints
GET /api/leads -> Lead[]
GET /api/quotes -> Quote[]
GET /api/jobs -> Job[]
GET /api/invoices -> Invoice[]
```

## 🤝 Contributing

1. Follow the established component patterns
2. Use TypeScript for all new code
3. Write tests for new components
4. Add Storybook stories for UI components
5. Follow the design system tokens
6. Ensure accessibility compliance

## 📄 License

This project is part of the Workero platform development.
