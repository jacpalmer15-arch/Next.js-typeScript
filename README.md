# Next.js-TypeScript

Front end of Self Checkout App

## Features

### Inventory Management

The application includes a comprehensive inventory management system with the following features:

#### Inventory Page (`/inventory`)

- **Real-time inventory tracking**: View current stock levels for all items
- **Low stock monitoring**: Automatically identifies and highlights items below reorder levels
- **Search and filtering**: Find items by name or Clover item ID
- **Stock level adjustments**: Easily increase or decrease inventory quantities
- **Reason tracking**: Record reasons for inventory adjustments (e.g., "Stock received", "Damaged items")

#### Key Components

1. **InventoryTable**: Enhanced table component with:
   - Sortable columns (Name, On Hand, Reorder Level, Status)
   - Visual indicators for low stock items
   - Search functionality
   - Filter for low stock items only
   - Action buttons for each inventory item

2. **AdjustInventoryDialog**: Modal dialog for inventory adjustments:
   - Input field for adjustment amount (positive/negative)
   - Optional reason field
   - Form validation
   - Real-time feedback with toast notifications

#### Usage Instructions

1. **Viewing Inventory**:
   - Navigate to `/inventory` to see all inventory items
   - Low stock items are highlighted in red and marked with "Low Stock" badge
   - Use the search bar to find specific items

2. **Adjusting Inventory**:
   - Click the "Adjust" button next to any item
   - Enter a positive number to add inventory (e.g., +10)
   - Enter a negative number to subtract inventory (e.g., -5)
   - Optionally add a reason for the adjustment
   - Click "Adjust Inventory" to save changes

3. **Filtering and Search**:
   - Use the search box to filter by item name or Clover ID
   - Check "Show low stock only" to view items needing attention
   - View count shows filtered vs. total items

#### API Endpoints

- `GET /api/inventory` - Fetch all inventory items
- `GET /api/inventory/low-stock` - Fetch only low stock items  
- `POST /api/inventory/adjust` - Adjust inventory quantity

#### Technical Details

- Built with **Next.js 15** and **TypeScript**
- Uses **React Query** for data fetching and caching
- **Radix UI** components for accessible dialogs
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Toast notifications** for user feedback

## Development

### Setup

```bash
cd web
npm install
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
npm run build
```

## Environment Variables

Make sure to set the following environment variables:

- `BACKEND_BASE` - Base URL for the backend API service
