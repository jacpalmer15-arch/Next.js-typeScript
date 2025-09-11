import { NextRequest } from 'next/server';

const BASE = process.env.BACKEND_BASE!;

function normalizeProducts(payload: any): any[] {
  const arr = Array.isArray(payload) ? payload
    : Array.isArray(payload?.products) ? payload.products
    : Array.isArray(payload?.data) ? payload.data
    : Array.isArray(payload?.items) ? payload.items
    : [];
  // map price_cents -> price if needed
  return arr.map((x: any) => ({
    clover_item_id: x.clover_item_id ?? x.id ?? x.itemId ?? String(x.upc ?? ''),
    name: x.name ?? x.title ?? 'Unnamed',
    category: x.category ?? x.category_name ?? null,
    sku: x.sku ?? null,
    upc: x.upc ?? null,
    visible_in_kiosk: x.visible_in_kiosk ?? x.kiosk ?? x.visible ?? false,
    price: typeof x.price === 'number'
      ? x.price
      : typeof x.price_cents === 'number'
      ? x.price_cents
      : typeof x.priceInCents === 'number'
      ? x.priceInCents
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
