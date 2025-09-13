import { NextRequest } from 'next/server';
import { Order } from '@/lib/types';

// Mock data for orders since there's no backend yet
const mockOrders: Order[] = [
  {
    id: 'ord_001',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    status: 'paid',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:35:00Z',
    total_amount: 2599, // $25.99
    items: [
      {
        id: 'item_001',
        clover_item_id: 'clv_123',
        name: 'Organic Coffee',
        quantity: 2,
        unit_price: 999,
        total_price: 1998,
      },
      {
        id: 'item_002',
        clover_item_id: 'clv_456',
        name: 'Croissant',
        quantity: 1,
        unit_price: 601,
        total_price: 601,
      }
    ],
    notes: 'Customer requested extra hot coffee',
  },
  {
    id: 'ord_002',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    status: 'pending',
    created_at: '2024-01-15T11:15:00Z',
    updated_at: '2024-01-15T11:15:00Z',
    total_amount: 1299, // $12.99
    items: [
      {
        id: 'item_003',
        clover_item_id: 'clv_789',
        name: 'Green Tea',
        quantity: 1,
        unit_price: 599,
        total_price: 599,
      },
      {
        id: 'item_004',
        clover_item_id: 'clv_101',
        name: 'Muffin',
        quantity: 1,
        unit_price: 700,
        total_price: 700,
      }
    ],
  },
  {
    id: 'ord_003',
    customer_name: 'Bob Wilson',
    customer_email: 'bob@example.com',
    status: 'fulfilled',
    created_at: '2024-01-14T09:45:00Z',
    updated_at: '2024-01-14T10:20:00Z',
    total_amount: 3499, // $34.99
    items: [
      {
        id: 'item_005',
        clover_item_id: 'clv_112',
        name: 'Sandwich',
        quantity: 1,
        unit_price: 1299,
        total_price: 1299,
      },
      {
        id: 'item_006',
        clover_item_id: 'clv_113',
        name: 'Soup',
        quantity: 1,
        unit_price: 899,
        total_price: 899,
      },
      {
        id: 'item_007',
        clover_item_id: 'clv_114',
        name: 'Side Salad',
        quantity: 1,
        unit_price: 699,
        total_price: 699,
      },
      {
        id: 'item_008',
        clover_item_id: 'clv_115',
        name: 'Drink',
        quantity: 1,
        unit_price: 602,
        total_price: 602,
      }
    ],
    notes: 'Lunch combo order',
  },
  {
    id: 'ord_004',
    customer_name: 'Alice Johnson',
    customer_email: 'alice@example.com',
    status: 'canceled',
    created_at: '2024-01-13T14:20:00Z',
    updated_at: '2024-01-13T14:25:00Z',
    total_amount: 899, // $8.99
    items: [
      {
        id: 'item_009',
        clover_item_id: 'clv_116',
        name: 'Espresso',
        quantity: 2,
        unit_price: 449,
        total_price: 898,
      }
    ],
    notes: 'Customer canceled due to wait time',
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const customer = searchParams.get('customer');
  const fromDate = searchParams.get('from_date');
  const toDate = searchParams.get('to_date');

  let filteredOrders = [...mockOrders];

  // Filter by status
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  // Filter by customer
  if (customer) {
    const searchTerm = customer.toLowerCase();
    filteredOrders = filteredOrders.filter(order => 
      order.customer_name?.toLowerCase().includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by date range
  if (fromDate) {
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.created_at) >= new Date(fromDate)
    );
  }

  if (toDate) {
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.created_at) <= new Date(toDate + 'T23:59:59Z')
    );
  }

  // Sort by created_at descending (newest first)
  filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return Response.json(filteredOrders);
}