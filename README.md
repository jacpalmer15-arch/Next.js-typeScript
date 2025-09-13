# Next.js-typeScript
Front end of Self Checkout App

## Features

### Products Management
- View and manage product catalog
- Filter by category and kiosk visibility
- Edit product details and pricing
- Sync products from external systems

### Orders Management
- View all orders in a sortable table
- Filter orders by:
  - Customer name or email
  - Order status (Pending, Paid, Fulfilled, Canceled)
  - Date range (From/To dates)
- Order status management:
  - Mark pending orders as paid or canceled
  - Mark paid orders as fulfilled
- Detailed order view with:
  - Customer information
  - Itemized list with quantities and prices
  - Order total and notes
  - Status-appropriate actions

### Inventory Tracking
- Monitor stock levels
- Track low stock items
- View reorder levels

## Usage Instructions

### Orders Page
1. Navigate to **Orders** from the main navigation
2. Use the filter section to narrow down orders:
   - **Customer**: Search by customer name or email
   - **Status**: Filter by order status (All, Pending, Paid, Fulfilled, Canceled)
   - **Date Range**: Filter by creation date using From/To date pickers
3. Click **Clear All Filters** to reset all filters
4. Use the **View Details** button (eye icon) to open order details
5. For pending orders: Use **Mark Paid** or **Cancel** buttons
6. For paid orders: Use **Mark Fulfilled** button
7. Click **Refresh** to reload data

### Order Details Drawer
- Opens when clicking the view details button on any order
- Shows comprehensive order information including customer details, items, and totals
- Provides status-appropriate action buttons
- Click the **X** button or click outside to close

## Development

### Setup
```bash
cd web
npm install
npm run dev
```

### Building
```bash
npm run build
```

The application uses Next.js 15 with TypeScript, React Query for data fetching, and Tailwind CSS for styling.
