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

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'canceled';

export type OrderItem = {
  id: string;
  clover_item_id: string;
  name: string;
  quantity: number;
  unit_price: number; // cents
  total_price: number; // cents
};

export type Order = {
  id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  total_amount: number; // cents
  items: OrderItem[];
  notes?: string | null;
};
