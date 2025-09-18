
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
  // Return mock data if no backend base is configured
  if (!BASE) {
    return Response.json(mockInventoryData);
  }

  try {
    const json: unknown = JSON.parse(text);
    const arr = Array.isArray(json) ? json : Array.isArray((json as Record<string, unknown>)?.data) ? (json as Record<string, unknown>).data : [];
    const rows = (arr as Record<string, unknown>[]).map(normalizeRow);
    return Response.json(rows);
  } catch {
    console.error('Failed to parse inventory response');
    return Response.json([]);
  }
}
