import { Product, InventoryRow } from './types';

const BASE = process.env.NEXT_PUBLIC_API_BASE || '';

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
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
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
    products: () => request<{ success: boolean; count?: number; message?: string }>(
      '/api/products/sync',
      { method: 'POST' }
    ),
  },
};
