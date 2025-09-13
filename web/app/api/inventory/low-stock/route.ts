import type { InventoryRow } from '@/lib/types';

const BASE = process.env.BACKEND_BASE!;

function toNumber(v: unknown, def = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : def;
}

function toNullableNumber(v: unknown) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeRow(x: unknown): InventoryRow {
  const item = x as any; // TODO: Define proper interface
  const on_hand = toNumber(item?.on_hand ?? item?.quantity ?? 0, 0);
  const reorder_level = toNullableNumber(item?.reorder_level ?? item?.min ?? null);
  return {
    clover_item_id: item?.clover_item_id ?? item?.id ?? item?.itemId ?? String(item?.upc ?? ''),
    name: item?.name ?? item?.product_name ?? null,
    on_hand,
    reorder_level,
  };
}

export async function GET() {
  const upstream = await fetch(`${BASE}/api/inventory`, { cache: 'no-store' });
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });

  try {
    const json = JSON.parse(text);
    const arr = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
    const rows: InventoryRow[] = arr.map(normalizeRow);

    const low = rows.filter((r) => {
      const rl = r.reorder_level ?? 0;
      return r.on_hand - rl <= 0;
    });

    return Response.json(low.map((r) => ({ ...r, low_stock: true })));
  } catch {
    return Response.json([]);
  }
}
