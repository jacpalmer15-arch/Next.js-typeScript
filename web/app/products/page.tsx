'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { productColumns } from '@/components/products/enhanced-columns';
import { EnhancedDataTable } from '@/components/products/enhanced-data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [kioskOnly, setKioskOnly] = useState(false);
  const [category, setCategory] = useState<string>('all');

  // Fetch categories from /api/categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  // Fetch products (pass category id)
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', { search, kioskOnly, category }],
    queryFn: () =>
      api.products.list({
        search: search || undefined,
        kiosk_only: kioskOnly || undefined,
        category: category !== 'all' ? category : undefined,
      }),
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Products</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Name, SKU, UPC…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={kioskOnly}
            onChange={(e) => setKioskOnly(e.target.checked)}
          />
          Show kiosk-visible only
        </label>
      </div>

      <div className="flex gap-3 mb-6">
        <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => refetch()}>
          Refresh
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
      {isError && <p className="text-sm text-red-600">{(error as Error).message}</p>}
      {!isLoading && !isError && (
        <div>
          <EnhancedDataTable columns={productColumns} data={data} />
        </div>
      )} 
    </div>
  );
}