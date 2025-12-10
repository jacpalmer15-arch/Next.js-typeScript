import { NextRequest, NextResponse } from 'next/server';
import { createBackendHeaders, validateAuthHeader, unauthorizedResponse } from '@/lib/auth-utils';
import { Order } from '@/lib/types';

const BASE = process.env.BACKEND_BASE;

// Mock data for orders when no backend is configured
const mockOrders: Order[] = [
  {
    id: 'ord_001',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    status: 'paid',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:35:00Z',
    total_amount: 2599,
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
];

export async function POST(request: NextRequest) {
  if (!validateAuthHeader(request)) {
    return unauthorizedResponse();
  }

  const body = await request.text();

  if (!BASE) {
    // Simulate order creation when no backend is configured
    try {
      // Validate JSON format
      const data = JSON.parse(body);
      const orderId = `ord_${Date.now()}`;
      
      // Simple validation: ensure orderCart.lineItems exists
      if (!data.orderCart || !Array.isArray(data.orderCart.lineItems)) {
        return new Response(JSON.stringify({ success: false, message: 'Invalid orderCart format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const newOrder: Order = {
        id: orderId,
        customer_name: null,
        customer_email: null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_amount: 0,
        items: [],
        notes: null,
      };

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: 'Order created successfully (simulated - no BACKEND_BASE configured)'
      });
    } catch {
      return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    const upstream = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: createBackendHeaders(request),
      body,
      cache: 'no-store',
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error) {
    console.error('Failed to forward /api/orders to upstream:', error);
    return new Response(JSON.stringify({ success: false, message: 'Upstream request failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  // Return mock orders when no backend is configured
  if (!BASE) {
    return NextResponse.json({
      success: true,
      orders: mockOrders,
      count: mockOrders.length
    });
  }

  // For GET requests with backend, we could proxy here too
  // For now, keeping the mock behavior
  return NextResponse.json({
    success: true,
    orders: mockOrders,
    count: mockOrders.length
  });
}