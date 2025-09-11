'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Row = {
  clover_item_id: string;
  name?: string;
  quantity: number;
  low_stock?: boolean;
};

export default function InventoryPage() {
  const {
    data: all,
    isLoading: l1,
    isError: e1,
    error: er1,
  } = useQuery<Row[]>({
    queryKey: ['inventory'],
    queryFn: api.inventory.all,
  });

  const {
    data: low,
    isLoading: l2,
    isError: e2,
    error: er2,
  } = useQuery<Row[]>({
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

function InventoryTable({ rows, empty }: { rows: Row[]; empty: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Clover Item</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.clover_item_id} className="border-b">
              <td className="px-3 py-2">{r.name ?? '-'}</td>
              <td className="px-3 py-2">{r.quantity}</td>
              <td className="px-3 py-2">{r.clover_item_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="mt-4 text-sm text-gray-500">{empty}</p>}
    </div>
  );
}
