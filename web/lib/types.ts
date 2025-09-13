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

export type CloverConnection = {
  isConnected: boolean;
  merchantId?: string;
  lastSyncAt?: Date;
  apiKey?: string;
};

export type FeatureFlags = {
  enableKioskMode: boolean;
  enableInventoryTracking: boolean;
  enableLowStockAlerts: boolean;
  enableProductRecommendations: boolean;
  enableReports: boolean;
};

export type MerchantProfile = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  timezone: string;
  currency: string;
};
