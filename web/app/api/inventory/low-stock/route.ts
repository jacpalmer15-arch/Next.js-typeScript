
import { NextRequest } from 'next/server';
import { mockInventory } from '@/lib/mock';

const useMock = process.env.USE_MOCK_API === 'true';
const BASE = process.env.BACKEND_BASE;

export async function GET(_req: NextRequest) {
  if (useMock || !BASE) {
    const data = mockInventory.filter(r => r.low_stock || r.quantity <= 2);
    return Response.json(data);
  }
  const upstream = await fetch(`${BASE}/api/inventory/low-stock`, { cache: 'no-store' });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
