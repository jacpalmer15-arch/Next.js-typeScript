'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [kioskOnly, setKioskOnly] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', { search, kioskOnly }],
    queryFn: () => api.products.list({ search, kiosk_only: kioskOnly }),
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold">Products</h1>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="w-72">
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Name, SKU, UPC…" value={search}
                 onChange={(e) => setSearch(e.target.value)} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={kioskOnly} onChange={e => setKioskOnly(e.target.checked)} />
          Show kiosk-visible only
        </label>

        <button
          onClick={() => refetch()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-gray-500">Loading…</p>}
      {isError && <p className="mt-6 text-sm text-red-600">{(error as Error).message}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">UPC</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Kiosk</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p: Product) => (
              <tr key={p.clover_item_id} className="border-b">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.category ?? '-'}</td>
                <td className="px-3 py-2">{p.upc ?? '-'}</td>
                <td className="px-3 py-2">{p.sku ?? '-'}</td>
                <td className="px-3 py-2">{p.visible_in_kiosk ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.length === 0 && !isLoading && (
          <p className="mt-4 text-sm text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}
