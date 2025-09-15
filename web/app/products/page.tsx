'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { enhancedProductColumns } from '@/components/products/enhanced-columns';
import { EnhancedDataTable } from '@/components/products/enhanced-data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [kioskOnly, setKioskOnly] = useState(false);
  const [category, setCategory] = useState<string>('all');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

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
    <main className="mx-auto max-w-7xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="text-sm text-gray-500">
          {data.length} {data.length === 1 ? 'product' : 'products'}
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2">
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
            <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(categories ?? []).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 text-sm mt-6">
            <input
              type="checkbox"
              checked={kioskOnly}
              onChange={(e) => setKioskOnly(e.target.checked)}
            />
            Show kiosk-visible only
          </label>
        </div>

        <div className="flex items-end">
          <button 
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 transition-colors" 
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-gray-500">Loading products…</p>
        </div>
      )}
      
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Failed to load products</p>
          <p className="text-sm text-gray-500">{(error as Error).message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 className="font-semibold text-gray-900">Product Catalog</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on any cell to edit inline, or use the eye icon to view details
            </p>
          </div>
          <div className="p-4">
            <EnhancedDataTable columns={enhancedProductColumns} data={data} />
          </div>
        </div>
      )}
    </main>
  );
}
