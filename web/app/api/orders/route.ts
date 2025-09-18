import { NextRequest, NextResponse } from 'next/server';
import { CartItem, PaymentMethod, Order } from '@/lib/types';

// Mock data for orders since there's no backend yet
let mockOrders: Order[] = [
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
    total_amount: 1799, // $17.99
    items: [
      {
        id: 'item_003',
        clover_item_id: 'clv_789',
        name: 'Latte',
        quantity: 1,
        unit_price: 549,
        total_price: 549,
      },
      {
        id: 'item_004',
        clover_item_id: 'clv_101',
        name: 'Muffin',
        quantity: 1,
        unit_price: 1250,
        total_price: 1250,
      }
    ],
    notes: null,
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, tax, total, payment_method } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!payment_method || !total) {
      return NextResponse.json(
        { error: 'Payment method and total are required' },
        { status: 400 }
      );
    }

    // Generate new order ID
    const orderId = `ord_${Date.now()}`;
    
    // Create order items
    const orderItems = items.map((item: any, index: number) => ({
      id: `item_${Date.now()}_${index}`,
      clover_item_id: item.clover_item_id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    // Create new order
    const newOrder: Order = {
      id: orderId,
      customer_name: null,
      customer_email: null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_amount: total,
      items: orderItems,
      notes: null,
    };

    // Add to mock storage
    mockOrders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      orders: mockOrders.slice(-20), // Return last 20 orders
      count: mockOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}