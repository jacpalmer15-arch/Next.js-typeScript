# Next.js-typeScript
Front end of Self Checkout App

## Overview

A modern self-checkout application frontend built with Next.js 15, TypeScript, and Tailwind CSS. Features a comprehensive admin interface for managing products, inventory, and system settings.

## Features

### 🛍️ Product Management
- Browse and search products
- Category filtering
- Individual product editing with pricing
- Kiosk visibility controls

### 📦 Inventory Tracking
- Real-time inventory levels
- Low stock alerts and monitoring
- Automatic reorder level management

### ⚙️ Sync & Settings
- **Enhanced Product Sync**: Trigger manual syncs with backend systems
- **Clover Integration**: Connect/disconnect POS system with API key management
- **Feature Flags**: Toggle system features including:
  - Kiosk Mode
  - Inventory Tracking
  - Low Stock Alerts
  - Product Recommendations
  - Reports
- **Merchant Profile**: Manage business information and settings

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Next.js-typeScript
```

2. Navigate to the web directory and install dependencies:
```bash
cd web
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage Instructions

### Sync & Settings Page

Navigate to the **Sync & Settings** page from the main navigation to access all administrative functions:

#### 🔄 Data Sync
- Click "Run Product Sync" to manually trigger synchronization with backend systems
- Monitor sync status and view detailed results
- Automatic cache invalidation ensures fresh data after sync

#### 🔗 Clover Integration
- **Connecting**: Enter your Clover API key and click "Connect"
- **Status**: View connection status, merchant ID, and last sync time
- **Disconnecting**: Click "Disconnect from Clover" to remove integration

#### 🚩 Feature Flags
- Toggle individual features on/off using the switches
- Changes are tracked automatically - save/reset buttons appear when modifications are made
- Click "Save Changes" to apply or "Reset" to revert

#### 👤 Merchant Profile
- Update business information including:
  - Business name and contact details
  - Email and phone number
  - Complete address information
  - Timezone and currency preferences
- Form validation ensures required fields are completed
- Changes are auto-detected with save/reset functionality

### Product Management
- Browse products from the main Products page
- Use search and category filters to find specific items
- Click on any product to edit details, pricing, and kiosk visibility
- Toggle "Visible in Kiosk" to control what customers can see

### Inventory Management
- View current inventory levels from the Inventory page
- Monitor low stock items with automatic alerts
- Track reorder levels and on-hand quantities

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage
- **Unit Tests**: All sync & settings components
- **Integration Tests**: Full page functionality
- **Mock APIs**: Complete backend simulation for testing

## Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **React Query**: Server state management
- **React Hook Form**: Form handling with validation
- **Sonner**: Toast notifications

### API Structure
- RESTful API routes under `/api/`
- Type-safe interfaces for all data models
- Mock implementations for development/testing

### Key Components
- `CloverSection`: Clover POS integration management
- `FeatureFlagsSection`: System feature toggles
- `MerchantProfileSection`: Business profile editing
- Reusable UI components with consistent patterns

## Development

### File Structure
```
web/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── sync/              # Sync & Settings page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── sync/              # Sync & Settings components
│   └── ui/                # Base UI components
├── lib/                   # Utilities and types
└── __tests__/             # Test files
```

### Adding New Features
1. Define TypeScript interfaces in `lib/types.ts`
2. Create API routes under `app/api/`
3. Build UI components in `components/`
4. Add comprehensive tests in `__tests__/`
5. Update this README with usage instructions

## Contributing

1. Create feature branches from the main development branch
2. Follow the existing TypeScript and React patterns
3. Add tests for new functionality
4. Update documentation as needed
5. Ensure all builds and tests pass before submitting

## License

[License information to be added]
