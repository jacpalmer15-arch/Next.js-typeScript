'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from '@/components/layout/AdminLayout';
import { mockProducts } from '@/lib/mock';
import { CartItem, PaymentMethod } from '@/lib/types';
import { Plus, Minus, Trash2, CreditCard, Banknote, Gift } from 'lucide-react';
import { toast } from "sonner";
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Add item to cart or increase quantity
  const addToCart = (productId: string) => {
    const product = mockProducts.find(p => p.clover_item_id === productId && p.visible_in_kiosk);
    if (!product || !product.price) return;

    const existingItem = cart.find(item => item.clover_item_id === productId);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.clover_item_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        clover_item_id: product.clover_item_id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        sku: product.sku
      }]);
    }
  };

  // Update item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.clover_item_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.clover_item_id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.0875); // 8.75% tax
  const total = subtotal + tax;

  // Process checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order via API
      const orderData = {
        items: cart,
        subtotal,
        tax,
        total,
        payment_method: paymentMethod,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment processing failed');
      }

      toast.success(`${result.message} - Total: ${formatCurrency(total)}`);
      clearCart();
      setPaymentMethod('card');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price);

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Point of Sale - Checkout</h1>
          <Button 
            variant="outline" 
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {availableProducts.map((product) => (
                  <div
                    key={product.clover_item_id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.category} • {formatCurrency(product.price!)}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.clover_item_id)}
                      className="ml-4"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart & Checkout */}
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart ({cart.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.clover_item_id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.clover_item_id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.clover_item_id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.clover_item_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="w-20 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Order Summary */}
                {cart.length > 0 && (
                  <>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8.75%):</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium mb-2">
                        Payment Method
                      </label>
                      <Select
                        value={paymentMethod}
                        onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Credit/Debit Card
                            </div>
                          </SelectItem>
                          <SelectItem value="cash">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Cash
                            </div>
                          </SelectItem>
                          <SelectItem value="gift_card">
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4" />
                              Gift Card
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Checkout - ${formatCurrency(total)}`}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}