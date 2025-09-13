import { NextRequest, NextResponse } from 'next/server';
import { CartItem, PaymentMethod, Order } from '@/lib/types';

// Mock order storage (in a real app, this would be a database)
const orders: Order[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, tax, total, payment_method } = body as {
      items: CartItem[];
      subtotal: number;
      tax: number;
      total: number;
      payment_method: PaymentMethod;
    };

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!payment_method || !['card', 'cash', 'gift_card'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items,
      subtotal,
      tax,
      total,
      payment_method,
      status: 'pending',
      created_at: new Date(),
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate payment processing (in a real app, integrate with payment processor)
    const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

    if (paymentSuccess) {
      newOrder.status = 'completed';
      newOrder.completed_at = new Date();
      orders.push(newOrder);

      return NextResponse.json(
        {
          success: true,
          order: newOrder,
          message: 'Order processed successfully'
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Payment processing failed. Please try again.' },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Order processing error:', error);
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
      orders: orders.slice(-20), // Return last 20 orders
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}