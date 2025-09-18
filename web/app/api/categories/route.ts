import { Product } from '@/lib/types';
import { NextRequest } from 'next/server';
import { createBackendHeaders, validateAuthHeader, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  // Validate authentication
  if (!validateAuthHeader(req)) {
    return unauthorizedResponse();
  }

  const res = await fetch(`${process.env.BACKEND_BASE}/api/products`, { 
    cache: 'no-store',
    headers: createBackendHeaders(req)
  });
  const text = await res.text();
  if (!res.ok) return new Response(text, { status: res.status });


  let items: Product[] = [];
  try { items = JSON.parse(text); } catch { return Response.json([]); }

  const set = new Set<string>();
  for (const p of items) {
    if (p && typeof p === 'object' && 'category' in p && p.category) {
      set.add(String(p.category));
    }
  }
  return Response.json(Array.from(set).sort());
}
