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
  },
  {
    clover_item_id: 'itm_1002',
    name: 'After Dark VOiD Preworkout',
    category: 'Pre-Workout',
    upc: '222222222222',
    sku: 'AD-VOID',
    visible_in_kiosk: true,
    price: 4499,
  },
  {
    clover_item_id: 'itm_1003',
    name: 'Zenith Shaker Bottle',
    category: 'Accessories',
    upc: '333333333333',
    sku: null,
    visible_in_kiosk: false,
    price: 1299,
  },
  {
    clover_item_id: 'itm_1004',
    name: 'R1 Mass Gainer',
    category: 'Protein',
    upc: '444444444444',
    sku: 'R1-GAIN',
    visible_in_kiosk: true,
    price: 5999,
  },
];
export const mockInventory: InventoryRow[] = [
  { clover_item_id: 'itm_1001', name: 'Rule 1 Whey Blend - Chocolate', quantity: 12 },
  { clover_item_id: 'itm_1002', name: 'After Dark VOiD Preworkout', quantity: 2, low_stock: true },
  { clover_item_id: 'itm_1003', name: 'Zenith Shaker Bottle', quantity: 0, low_stock: true },
  { clover_item_id: 'itm_1004', name: 'R1 Mass Gainer', quantity: 7 },
];
