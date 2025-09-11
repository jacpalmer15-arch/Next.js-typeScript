import { NextRequest } from 'next/server';
import { mockProducts } from '@/lib/mock';

const useMock = process.env.USE_MOCK_API === 'true';
const BASE = process.env.BACKEND_BASE;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (useMock || !BASE) {
    const prod = mockProducts.find(p => p.clover_item_id === id);
    if (!prod) return new Response('Not found', { status: 404 });
    return Response.json(prod);
  }
  const upstream = await fetch(`${BASE}/api/products/${id}`, { cache: 'no-store' });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await req.json();

  if (useMock || !BASE) {
    const idx = mockProducts.findIndex(p => p.clover_item_id === id);
    if (idx === -1) return new Response('Not found', { status: 404 });
    const updated = { ...mockProducts[idx], ...body };
    mockProducts[idx] = updated;
    return Response.json(updated);
  }

  const upstream = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
