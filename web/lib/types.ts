export type Product = {
  id?: string;
  clover_item_id: string;
  name: string;
  category?: string | null;
  sku?: string | null;
  upc?: string | null;
  visible_in_kiosk?: boolean;
  price?: number | null;
};

export type InventoryRow = {
  product_id?: string;
  clover_item_id: string;
  quantity: number;
  low_stock?: boolean;
  name?: string;
};
