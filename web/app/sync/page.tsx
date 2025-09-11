'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function SyncPage() {
  const [status, setStatus] = useState<string>('');

  async function runProductSync() {
    setStatus('Running product sync…');
    try {
      const res = await api.sync.products();
      setStatus(res?.message ?? (res.success ? 'Product sync complete.' : 'Product sync finished with warnings.'));
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold">Sync</h1>

      <div className="mt-4 flex gap-3">
        <button onClick={runProductSync} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
          Run Product Sync
        </button>
      </div>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </main>
  );
}
