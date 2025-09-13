import { Product, InventoryRow, CloverConnection, FeatureFlags, MerchantProfile } from './types';

function withQS(path: string, params?: Record<string, unknown>) {
  if (!params) return path;
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  );
  const q = qs.toString();
  return q ? `${path}?${q}` : path;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });

  const raw = await res.text(); // read once so we can parse or show errors
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}\n${raw}`);

  try {
    return JSON.parse(raw) as T;
  } catch {
    // allow plain text responses (e.g., sync message)
    return raw as unknown as T;
  }
}

export const api = {
  products: {
    list: (opts?: { kiosk_only?: boolean; search?: string; category?: string }) =>
      request<Product[]>(withQS('/api/products', opts)),
    get: (id: string) => request<Product>(`/api/products/${id}`),
    update: (id: string, patch: Partial<Product>) =>
      request<Product>(`/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
  },
  inventory: {
    all: () => request<InventoryRow[]>('/api/inventory'),
    lowStock: () => request<InventoryRow[]>('/api/inventory/low-stock'),
  },
  sync: {
    products: () =>
      request<{ success: boolean; count?: number; message?: string }>(
        '/api/products/sync',
        { method: 'POST' }
      ),
  },
  categories: {
    list: () => request<string[]>('/api/categories'),
  },
  clover: {
    getConnection: () => request<CloverConnection>('/api/clover/connection'),
    connect: (apiKey: string) =>
      request<CloverConnection>('/api/clover/connect', {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
      }),
    disconnect: () =>
      request<{ success: boolean }>('/api/clover/disconnect', {
        method: 'POST',
      }),
  },
  settings: {
    getFeatureFlags: () => request<FeatureFlags>('/api/settings/feature-flags'),
    updateFeatureFlags: (flags: FeatureFlags) =>
      request<FeatureFlags>('/api/settings/feature-flags', {
        method: 'PUT',
        body: JSON.stringify(flags),
      }),
    getMerchantProfile: () => request<MerchantProfile>('/api/settings/merchant-profile'),
    updateMerchantProfile: (profile: MerchantProfile) =>
      request<MerchantProfile>('/api/settings/merchant-profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),
  },
};
