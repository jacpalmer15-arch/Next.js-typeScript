import { NextRequest } from 'next/server';
import { Product } from '@/lib/types';

const BASE = process.env.BACKEND_BASE!;


function normalizeProducts(payload: unknown): Product[] {
  const p = payload as Record<string, unknown>
  const arr = Array.isArray(payload) ? payload
    : Array.isArray(p?.products) ? p.products
    : Array.isArray(p?.data) ? p.data
    : Array.isArray(p?.items) ? p.items
    : [];
  // map price_cents -> price if needed
  return arr.map((x: Record<string, unknown>): Product => ({
    clover_item_id: String(x.clover_item_id ?? x.id ?? x.itemId ?? x.upc ?? ''),
    name: String(x.name ?? x.title ?? 'Unnamed'),
    category: x.category ? String(x.category) : x.category_name ? String(x.category_name) : null,
    sku: x.sku ? String(x.sku) : null,
    upc: x.upc ? String(x.upc) : null,
    visible_in_kiosk: Boolean(x.visible_in_kiosk ?? x.kiosk ?? x.visible ?? false),
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
