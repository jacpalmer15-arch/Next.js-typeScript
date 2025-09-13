# Next.js-typeScript
# Self-Checkout Admin System

Front end of Self Checkout App - A Next.js TypeScript application for managing a self-checkout system with Point of Sale functionality.

## Features

- **Product Management**: View, search, and manage product inventory
- **Inventory Tracking**: Monitor stock levels and low-stock alerts
- **Point of Sale (Checkout)**: Complete POS system for processing orders
- **Payment Processing**: Support for card, cash, and gift card payments
- **Order Management**: Track and process customer orders
- **Sync Operations**: Synchronize data with external systems

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

## Usage

### Admin Dashboard

Access the main dashboard at `/` to:
- View system overview
- Navigate to different modules
- Access quick actions

### Product Management (`/products`)

- View all products in the system
- Search and filter products
- Toggle product visibility in kiosk
- Edit product details

### Inventory Management (`/inventory`)

- Monitor stock levels
- View low-stock alerts
- Track inventory changes

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

### Sync Operations (`/sync`)

- Synchronize product data
- Update inventory levels
- Import/export data

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
    "status": "completed",
    "items": [...],
    "total": 8697,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Order processed successfully"
}
```

#### GET `/api/orders`
Retrieve recent orders

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "count": 10
}
```

## Architecture

- **Frontend**: Next.js 15 with TypeScript and React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **API**: Next.js API routes
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── orders/        # Order management endpoints
│   ├── checkout/          # POS/Checkout page
│   ├── products/          # Product management
│   ├── inventory/         # Inventory management
│   └── sync/              # Data synchronization
├── components/            # Reusable UI components
├── lib/                   # Utilities and types
├── __tests__/             # Test files
└── public/                # Static assets
```

## Development Notes

- The application uses mock data for demonstration purposes
- Payment processing includes simulated success/failure scenarios
- All monetary values are stored in cents for precision
- Tax rate is currently set to 8.75% (configurable)

## Testing

The application includes comprehensive test coverage for:
- Checkout functionality and user interactions
- API endpoints and data validation
- Order processing and payment handling
- Cart management and calculations

Tests use Jest with React Testing Library for frontend testing and Node.js environment for API testing.
