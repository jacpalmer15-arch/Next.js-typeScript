# Next.js TypeScript - Self Checkout App Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### Products Management
The application includes a comprehensive products management system with:

- **Product Listing** (`/products`): Browse all products with advanced filtering and search
- **Product Details** (`/products/[id]`): View and edit individual product information
- **Inventory Tracking** (`/inventory`): Monitor stock levels and low-stock alerts
- **Data Synchronization** (`/sync`): Sync product data with backend systems

## Products Page Features

### Core Functionality
- **Search & Filter**: Filter products by name, SKU, UPC, category, and kiosk visibility
- **Sortable Table**: Click column headers to sort products
- **Pagination**: Navigate through large product catalogs efficiently
- **Real-time Updates**: Changes reflect immediately across the application

### Advanced Features
- **Inline Editing**: Click any cell in the product table to edit values directly
- **Details Drawer**: Click the eye icon to view product details in a slide-out panel
- **Kiosk Toggle**: Quickly toggle product visibility for kiosk displays
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Inline Editing
- Click any editable cell (Category, UPC, SKU, Price) to edit inline
- Press `Enter` to save changes or `Escape` to cancel
- Price is automatically formatted and validated
- Changes are saved immediately to the backend

### Details Drawer
- Click the eye icon in any row to open the details drawer
- View all product information in a clean, organized layout
- Quick access to edit the full product via "Edit Product" button
- Click outside the drawer or the X button to close

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Next.js-typeScript/web

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate test coverage report
npm test:coverage
```

## Environment Variables

Create a `.env.local` file in the web directory:

```env
# Backend API URL
BACKEND_BASE=http://localhost:8000

# Sync timeout (optional)
SYNC_TIMEOUT_MS=60000
```

## Testing

The application includes comprehensive test coverage using Jest and React Testing Library:

- **Unit Tests**: All components and utilities
- **Integration Tests**: API client and data flow
- **UI Tests**: User interactions and state management

Run tests with coverage:
```bash
npm run test:coverage
```

## API Integration

The application communicates with a backend API for:
- Product CRUD operations
- Category management
- Inventory tracking
- Data synchronization

API endpoints are automatically normalized to handle different backend response formats.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Data Tables**: TanStack Table
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest + React Testing Library
- **Build Tool**: Turbopack

## Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── products/          # Products pages
│   ├── inventory/         # Inventory pages
│   ├── sync/             # Sync utilities
│   └── api/              # API routes
├── components/            # Reusable UI components
│   ├── products/         # Product-specific components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and shared code
│   ├── api.ts           # API client
│   ├── types.ts         # TypeScript definitions
│   └── utils.ts         # Helper functions
└── __tests__/            # Test files
    ├── components/       # Component tests
    ├── lib/             # Utility tests
    └── app/             # Page tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Ensure linting passes: `npm run lint`
7. Ensure build succeeds: `npm run build`
8. Submit a pull request

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
