
import { Product, InventoryRow } from './types';

function withQS(path: string, params?: Record<string, any>) {
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
  if (!res.ok) throw new Error(await res.text());
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  // allow plain text for sync responses
  return (await res.text()) as unknown as T;
}

export const api = {
  products: {
    list: (opts?: { kiosk_only?: boolean; search?: string; category?: string }) =>
      request<Product[]>(withQS('/api/products', opts)),
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
};
