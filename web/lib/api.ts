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

  const raw = await res.text();               // read once
  if (!res.ok) {
    // include body text in the thrown error for visibility
    throw new Error(`HTTP ${res.status} ${res.statusText}\n${raw}`);
  }

  // Prefer header, but still try to parse JSON even if header is wrong/missing
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw) as T; } catch { /* fall through */ }
  }
  try { return JSON.parse(raw) as T; } catch { /* not JSON */ }
  return raw as unknown as T;                 // final fallback
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
};
