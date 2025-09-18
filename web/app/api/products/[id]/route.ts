import { NextRequest } from 'next/server';
import { createBackendHeaders, validateAuthHeader, unauthorizedResponse } from '@/lib/auth-utils';

const BASE = process.env.BACKEND_BASE!;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Validate authentication
  if (!validateAuthHeader(req)) {
    return unauthorizedResponse();
  }

  const { id } = await params
  const upstream = await fetch(`${BASE}/api/products/${id}`, { 
    cache: 'no-store',
    headers: createBackendHeaders(req)
  });
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });

  try {
    const x = JSON.parse(text);
    const price = typeof x.price === 'number'
      ? x.price
      : typeof x.price_cents === 'number'
      ? x.price_cents
      : null;
    return Response.json({
      clover_item_id: x.clover_item_id ?? x.id ?? String(x.upc ?? ''),
      name: x.name ?? 'Unnamed',
      category: x.category ?? null,
      sku: x.sku ?? null,
      upc: x.upc ?? null,
      visible_in_kiosk: x.visible_in_kiosk ?? false,
      price,
    });
  } catch {
    return new Response('Bad upstream JSON', { status: 502 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Validate authentication
  if (!validateAuthHeader(req)) {
    return unauthorizedResponse();
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}));
  const payload = {
    ...body,
    // map UI 'price' -> server 'price_cents' when present
    ...(body.price !== undefined ? { price_cents: Number(body.price) } : {}),
  };

  const upstream = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PATCH',
    headers: createBackendHeaders(req),
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });

  // return normalized product back to UI
  try {
    const x = JSON.parse(text);
    const price = typeof x.price === 'number'
      ? x.price
      : typeof x.price_cents === 'number'
      ? x.price_cents
      : null;
    return Response.json({
      clover_item_id: x.clover_item_id ?? x.id ?? String(x.upc ?? ''),
      name: x.name ?? 'Unnamed',
      category: x.category ?? null,
      sku: x.sku ?? null,
      upc: x.upc ?? null,
      visible_in_kiosk: x.visible_in_kiosk ?? false,
      price,
    });
  } catch {
    return new Response('Bad upstream JSON', { status: 502 });
  }
}
