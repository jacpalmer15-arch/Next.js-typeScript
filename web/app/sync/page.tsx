'use client';

import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function SyncPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>('');
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function runProductSync() {
    setStatus('Starting product sync…'); setRunning(true);
    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/products/sync', { method: 'POST', signal: abortRef.current.signal });
      const text = await res.text();
      if (!res.ok) setStatus(`Error ${res.status}: ${text}`);
      else {
        setStatus(text || 'Product sync complete.');
        // 🔄 refresh lists after a successful sync
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['inventory'] });
        qc.invalidateQueries({ queryKey: ['inventory-low'] });
      }
    } catch (e: unknown) {
      setStatus((e as Error)?.name === 'AbortError' ? 'Canceled.' : String((e as Error)?.message || e));
    } finally { setRunning(false); abortRef.current = null; }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-xl font-semibold">Sync</h1>
      <div className="mt-4 flex gap-3">
        <button onClick={runProductSync} disabled={running}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
          {running ? 'Running…' : 'Run Product Sync'}
        </button>
      </div>
      {status && <pre className="mt-4 whitespace-pre-wrap rounded border bg-gray-50 p-3 text-sm">{status}</pre>}
    </main>
  );
}
