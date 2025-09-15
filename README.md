# Next.js-typeScript
# Zenith Self-Checkout Admin System

Front end of Self Checkout App - A comprehensive Next.js TypeScript application for managing a self-checkout system with Point of Sale functionality.

## Features

- **Admin Authentication**: Secure login/logout with Supabase Auth and route protection
- **Product Management**: View, search, filter, and manage product inventory with inline editing
- **Inventory Tracking**: Monitor stock levels, low-stock alerts, and inventory adjustments
- **Order Management**: Complete order processing with filtering, status management, and detailed order views
- **Point of Sale (Checkout)**: Full-featured POS system for processing customer orders
- **Payment Processing**: Support for card, cash, and gift card payments with mock payment gateway
- **Sync & Settings**: Data synchronization, Clover POS integration, feature flags, and merchant profile management
- **Comprehensive Testing**: Full test coverage with Jest and React Testing Library
- **CI/CD Pipeline**: Automated testing, building, and deployment verification

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Next.js 15+

### Installation

1. Clone the repository
2. Navigate to the web directory:
   ```bash
   cd web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

Build the application for production:
```bash
npm run build
```

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Usage

### Authentication

The application uses Supabase authentication with route protection. All admin pages require authentication.

1. Navigate to `/auth/login`
2. Sign in with your credentials
3. Access the admin dashboard

### Admin Dashboard

Access the main dashboard at `/` to:
- View system overview
- Navigate to different modules
- Access quick actions

### Product Management (`/products`)

- View all products in the system
- Search and filter products by name, category, or SKU
- Toggle product visibility in kiosk
- Edit product details inline
- Bulk operations support

### Inventory Management (`/inventory`)

- Monitor stock levels for all products
- View low-stock alerts
- Track inventory changes
- Adjust inventory levels

### Order Management (`/orders`)

- View all orders with comprehensive filtering
- Filter by status, customer, date range
- Update order status
- View detailed order information
- Track order timeline

### Point of Sale (`/checkout`)

The checkout system provides a complete POS interface:

1. **Product Selection**: Browse available products and add them to cart
2. **Cart Management**: 
   - Add/remove items
   - Adjust quantities
   - View itemized pricing
3. **Order Calculation**:
   - Automatic subtotal calculation
   - Tax calculation (8.75%)
   - Total computation
4. **Payment Processing**:
   - Select payment method (Card, Cash, Gift Card)
   - Process payment through secure backend
   - Handle payment success/failure scenarios
5. **Order Completion**:
   - Generate order confirmation
   - Clear cart for next customer
   - Toast notifications for status updates

#### Checkout Workflow

1. Navigate to `/checkout`
2. Select products from the available list by clicking the `+` button
3. Review items in the shopping cart
4. Adjust quantities using `+`/`-` buttons or remove items with trash icon
5. Select preferred payment method
6. Click "Checkout" to process the order
7. Wait for payment confirmation
8. Order complete - cart automatically clears

### Sync & Settings (`/sync`)

- **Data Synchronization**: Sync products and inventory with external systems
- **Clover POS Integration**: Connect and sync with Clover POS systems
- **Feature Flags**: Enable/disable system features
- **Merchant Profile**: Manage business information and settings

## API Endpoints

### Orders API (`/api/orders`)

#### POST `/api/orders`
Create a new order

**Request Body:**
```json
{
  "items": [
    {
      "clover_item_id": "itm_1001",
      "name": "Product Name",
      "price": 3999,
      "quantity": 2,
      "category": "Category"
    }
  ],
  "subtotal": 7998,
  "tax": 699,
  "total": 8697,
  "payment_method": "card"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "status": "paid",
    "items": [...],
    "total": 8697,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Order processed successfully"
}
```

#### GET `/api/orders`
Retrieve orders with optional filtering

**Query Parameters:**
- `status` - Filter by order status
- `customer` - Search customer name/email
- `from_date` - Filter orders from date
- `to_date` - Filter orders to date

## Architecture

- **Frontend**: Next.js 15 with TypeScript and React 19
- **Authentication**: Supabase Auth with route guards
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks + React Query for server state
- **API**: Next.js API routes with TypeScript
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── orders/        # Order management endpoints
│   ├── auth/login/        # Authentication pages
│   ├── checkout/          # POS/Checkout system
│   ├── orders/            # Order management
│   ├── products/          # Product management
│   ├── inventory/         # Inventory management
│   └── sync/              # Sync & Settings
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (sidebar, header)
│   ├── orders/            # Order-related components
│   ├── products/          # Product-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and configuration
│   ├── auth-context.tsx   # Authentication context
│   ├── supabase.ts        # Supabase client
│   ├── types.ts           # TypeScript type definitions
│   └── api.ts             # API client
└── __tests__/             # Test files
```

## Testing

The application includes comprehensive test coverage for:
- Authentication flow and route guards
- Checkout functionality and user interactions
- Order management and status updates
- Product management features
- API endpoints and data validation
- UI components and user interactions

### Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: Feature workflow testing  
- **API Tests**: Endpoint validation and error handling
- **UI Tests**: User interaction and accessibility

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration with the following stages:

1. **Lint**: ESLint code quality checks
2. **Type Check**: TypeScript compilation verification  
3. **Test**: Jest unit and integration tests with coverage
4. **Build**: Next.js production build verification

### Matrix Testing

Tests run on multiple Node.js versions (18, 20) to ensure compatibility.

## Development Notes

- The application uses mock data for demonstration purposes
- Payment processing includes simulated success/failure scenarios
- All monetary values are stored in cents for precision
- Tax rate is currently set to 8.75% (configurable)
- Authentication requires Supabase configuration for full functionality

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Ensure build succeeds: `npm run build`
6. Create a pull request

The CI pipeline will automatically run tests, linting, and build verification on all pull requests.
