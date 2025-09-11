import { NextRequest } from 'next/server';

const useMock = process.env.USE_MOCK_API === 'true';
const BASE = process.env.BACKEND_BASE;

export async function POST(_req: NextRequest) {
  if (useMock || !BASE) {
    // Fake a quick sync
    return Response.json({ success: true, count: 3, message: 'Product sync complete (mock).' });
  }
  const upstream = await fetch(`${BASE}/api/products/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
