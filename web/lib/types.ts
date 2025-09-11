
export type Product = {
  clover_item_id: string;
  name: string;
  category?: string | null;
  sku?: string | null;
  upc?: string | null;
  visible_in_kiosk?: boolean;
  price?: number | null;
};
export type InventoryRow = {
  clover_item_id: string;
  name?: string;
  quantity: number;
  low_stock?: boolean;
};
