# Workero Driver App

React Native mobile application for field technicians and drivers.

## Features

- **Job Management**: View assigned jobs, update status, complete tasks
- **GPS Tracking**: Real-time location tracking and geofencing
- **Photo Capture**: Before/after photos with job documentation
- **Material Tracking**: Log parts used from van inventory
- **Client Signatures**: Digital signature capture
- **Offline Support**: Work offline with automatic sync
- **Push Notifications**: Real-time job assignments and updates

## Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Install dependencies
npm install

# Install iOS pods (iOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Architecture

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # API and device services
├── store/             # Redux store and slices
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## Key Features Implementation

### Job Workflow
1. **Job Assignment** - Receive push notification
2. **En Route** - Start journey with GPS tracking
3. **On Site** - Clock in with location verification
4. **Work Progress** - Add photos, notes, materials
5. **Completion** - Capture signature and complete job
6. **Sync** - Auto-sync all data to cloud

### Location Services
- GPS tracking every 60-90 seconds
- Geofencing for automatic check-in
- Route optimization and navigation
- Mileage tracking for payroll

### Inventory Management
- Van-specific stock tracking
- Barcode scanning for materials
- Real-time stock updates
- Low stock alerts

## Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add to navigation stack in `App.tsx`
3. Update types if needed

### API Integration
- All API calls go through `driverApiService`
- Automatic token management
- Offline queue for failed requests

### State Management
- Redux Toolkit for state management
- Redux Persist for offline storage
- Separate slices for different features

## Build & Deploy

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```