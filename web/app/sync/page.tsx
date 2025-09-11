'use client';

import { useState } from 'react';

export default function SyncPage() {
  const [status, setStatus] = useState<string>('');

  async function runProductSync() {
    setStatus('Running product sync…');
    try {
      const res = await fetch('/api/products/sync', { method: 'POST' });
      const text = await res.text();
      if (!res.ok) {
        setStatus(`Error ${res.status}: ${text}`);
      } else {
        try {
          const json = JSON.parse(text);
          setStatus(json.message ?? 'Product sync complete.');
        } catch {
          setStatus(text || 'Product sync complete.');
        }
      }
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
      {status && <pre className="mt-4 whitespace-pre-wrap rounded border bg-gray-50 p-3 text-sm">{status}</pre>}
    </main>
  );
}
