import { mockInventoryData } from '@/lib/mock-data';

const BASE = process.env.BACKEND_BASE!;

function toNumber(v: unknown, def = 0): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : def;
}

function toNullableNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeRow(x: Record<string, unknown>) {
  const on_hand = toNumber(x?.on_hand ?? x?.quantity ?? 0, 0);
  const reorder_level = toNullableNumber(x?.reorder_level ?? x?.min ?? null);
  return {
    clover_item_id: String(x?.clover_item_id ?? x?.id ?? x?.itemId ?? x?.upc ?? ''),
    name: typeof x?.name === 'string' ? x.name : typeof x?.product_name === 'string' ? x.product_name : null,
    on_hand,
    reorder_level,
  };
}

export async function GET() {
  // Return mock data if no backend base is configured
  if (!BASE) {
    return Response.json(mockInventoryData);
  }

  try {
    const upstream = await fetch(`${BASE}/api/inventory`, { cache: 'no-store' });
    const text = await upstream.text();
    if (!upstream.ok) return new Response(text, { status: upstream.status });

    try {
      const json = JSON.parse(text);
      const arr = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
      const rows = arr.map(normalizeRow);
      return Response.json(rows);
    } catch {
      return Response.json([]);
    }
  } catch {
    // Fallback to mock data if backend is not available
    return Response.json(mockInventoryData);
  }
}
