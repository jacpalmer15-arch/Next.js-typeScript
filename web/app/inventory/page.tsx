'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { InventoryRow } from '@/lib/types';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { AdminLayout } from '@/components/layout/AdminLayout';

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
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor stock levels and adjust inventory quantities.
        </p>
      </div>

      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Low Stock Items</h2>
          {l2 && <p className="text-sm text-gray-500 mb-4">Loading low stock items...</p>}
          {e2 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
              <p className="text-sm text-red-600">{String(er2)}</p>
            </div>
          )}
          <InventoryTable 
            rows={Array.isArray(low) ? low : []} 
            empty="No low-stock items. All inventory levels are sufficient!" 
          />
        </div>
      </section>

      <section>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">All Inventory</h2>
          {l1 && <p className="text-sm text-gray-500 mb-4">Loading inventory...</p>}
          {e1 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
              <p className="text-sm text-red-600">{String(er1)}</p>
            </div>
          )}
          <InventoryTable 
            rows={Array.isArray(all) ? all : []} 
            empty="No inventory items found."
            showFilter={true}
          />
        </div>
      </section>
    </main>
    <AdminLayout>
      <div className="max-w-6xl">
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
      </div>
    </AdminLayout>
  );
}
