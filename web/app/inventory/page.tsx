'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { InventoryRow } from '@/lib/types';
import { InventoryTable } from '@/components/inventory/inventory-table';

export default function InventoryPage() {
  const { data: all, isLoading: l1, isError: e1, error: er1 } = useQuery<InventoryRow[]>({
    queryKey: ['inventory'],
    queryFn: api.inventory.all,
  });

  const { data: low, isLoading: l2, isError: e2, error: er2 } = useQuery<InventoryRow[]>({
    queryKey: ['inventory-low'],
    queryFn: api.inventory.lowStock,
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold">Inventory</h1>

      <section className="mt-6">
        <h2 className="mb-2 font-medium">Low Stock</h2>
        {l2 && <p className="text-sm text-gray-500">Loading…</p>}
        {e2 && <p className="text-sm text-red-600">{String(er2)}</p>}
        <InventoryTable rows={Array.isArray(low) ? low : []} empty="No low-stock items." />
      </section>

      <section className="mt-10">
        <h2 className="mb-2 font-medium">All Inventory</h2>
        {l1 && <p className="text-sm text-gray-500">Loading…</p>}
        {e1 && <p className="text-sm text-red-600">{String(er1)}</p>}
        <InventoryTable rows={Array.isArray(all) ? all : []} empty="No inventory rows." />
      </section>
    </main>
  );
}
