export type Product = {
  clover_item_id: string;
  name: string;
  category?: string | null;
  sku?: string | null;
  upc?: string | null;
  visible_in_kiosk?: boolean;
  price?: number | null; // cents
};

export type InventoryRow = {
  clover_item_id: string;
  name?: string | null;
  on_hand: number;
  reorder_level: number | null;
  low_stock?: boolean;
};

// Checkout-related types
export type CartItem = {
  clover_item_id: string;
  name: string;
  price: number; // cents
  quantity: number;
  category?: string | null;
  sku?: string | null;
};

export type PaymentMethod = 'card' | 'cash' | 'gift_card';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  items: CartItem[];
  total: number; // cents
  tax: number; // cents
  subtotal: number; // cents
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: Date;
  completed_at?: Date | null;
};
