
import { NextRequest } from 'next/server';
import { mockProducts } from '@/lib/mock';

const useMock = process.env.USE_MOCK_API === 'true';
const BASE = process.env.BACKEND_BASE;

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') || '';
  const kioskOnly = req.nextUrl.searchParams.get('kiosk_only') === 'true';
  const category = req.nextUrl.searchParams.get('category') || '';

  if (useMock || !BASE) {
    let data = mockProducts;
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          (p.sku || '').toLowerCase().includes(s) ||
          (p.upc || '').toLowerCase().includes(s)
      );
    }
    if (kioskOnly) data = data.filter(p => !!p.visible_in_kiosk);
    if (category) data = data.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    return Response.json(data);
  }

  const qs = req.nextUrl.search;
  const upstream = await fetch(`${BASE}/api/products${qs}`, { cache: 'no-store' });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
