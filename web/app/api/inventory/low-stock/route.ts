import { InventoryRow } from '@/lib/types';

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

function normalizeRow(x: Record<string, unknown>): InventoryRow {
  const on_hand = toNumber(x?.on_hand ?? x?.quantity ?? 0, 0);
  const reorder_level = toNullableNumber(x?.reorder_level ?? x?.min ?? null);
  return {
    clover_item_id: String(x?.clover_item_id ?? x?.id ?? x?.itemId ?? x?.upc ?? ''),
    name: x?.name ? String(x.name) : x?.product_name ? String(x.product_name) : null,
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
