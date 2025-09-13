import { NextRequest } from 'next/server';

const BASE = process.env.BACKEND_BASE!;

function normalizeProducts(payload: unknown): unknown[] {
  const arr = Array.isArray(payload) ? payload
    : Array.isArray((payload as any)?.products) ? (payload as any).products
    : Array.isArray((payload as any)?.data) ? (payload as any).data
    : Array.isArray((payload as any)?.items) ? (payload as any).items
    : [];
  // map price_cents -> price if needed
  return arr.map((x: unknown) => ({
    clover_item_id: (x as any).clover_item_id ?? (x as any).id ?? (x as any).itemId ?? String((x as any).upc ?? ''),
    name: (x as any).name ?? (x as any).title ?? 'Unnamed',
    category: (x as any).category ?? (x as any).category_name ?? null,
    sku: (x as any).sku ?? null,
    upc: (x as any).upc ?? null,
    visible_in_kiosk: (x as any).visible_in_kiosk ?? (x as any).kiosk ?? (x as any).visible ?? false,
    price: typeof (x as any).price === 'number'
      ? (x as any).price
      : typeof (x as any).price_cents === 'number'
      ? (x as any).price_cents
      : typeof (x as any).priceInCents === 'number'
      ? (x as any).priceInCents
      : null,
  }));
}

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const upstream = await fetch(`${BASE}/api/products${qs}`, { cache: 'no-store' });
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });

  // Try JSON → normalize → JSON out. If not JSON, return empty array.
  try {
    const json = JSON.parse(text);
    return Response.json(normalizeProducts(json));
  } catch {
    return Response.json([]);
  }
}
