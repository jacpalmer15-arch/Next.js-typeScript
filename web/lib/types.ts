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
