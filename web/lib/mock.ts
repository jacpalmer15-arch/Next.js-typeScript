import { Product, InventoryRow } from './types';

export const mockProducts: Product[] = [
  {
    clover_item_id: 'itm_1001',
    name: 'Rule 1 Whey Blend - Chocolate',
    category: 'Protein',
    upc: '111111111111',
    sku: 'R1-WHEY-CHOC',
    visible_in_kiosk: true,
    price: 3999,
    cost: 2400,
  },
  {
    clover_item_id: 'itm_1002',
    name: 'After Dark VOiD Preworkout',
    category: 'Pre-Workout',
    upc: '222222222222',
    sku: 'AD-VOID',
    visible_in_kiosk: true,
    price: 4499,
    cost: 2700,
  },
  {
    clover_item_id: 'itm_1003',
    name: 'Zenith Shaker Bottle',
    category: 'Accessories',
    upc: '333333333333',
    sku: null,
    visible_in_kiosk: false,
    price: 1299,
    cost: 650,
  },
  {
    clover_item_id: 'itm_1004',
    name: 'R1 Mass Gainer',
    category: 'Protein',
    upc: '444444444444',
    sku: 'R1-GAIN',
    visible_in_kiosk: true,
    price: 5999,
    cost: 3600,
  },
];
export const mockInventory: InventoryRow[] = [
  { clover_item_id: 'itm_1001', name: 'Rule 1 Whey Blend - Chocolate', on_hand: 12, reorder_level: 5 },
  { clover_item_id: 'itm_1002', name: 'After Dark VOiD Preworkout', on_hand: 2, reorder_level: 5, low_stock: true },
  { clover_item_id: 'itm_1003', name: 'Zenith Shaker Bottle', on_hand: 0, reorder_level: 10, low_stock: true },
  { clover_item_id: 'itm_1004', name: 'R1 Mass Gainer', on_hand: 7, reorder_level: 3 },
];
