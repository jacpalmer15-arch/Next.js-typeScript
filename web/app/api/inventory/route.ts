const BASE = process.env.BACKEND_BASE!;

function toNumber(v: any, def = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : def;
}

function toNullableNumber(v: any) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeRow(x: any) {
  const on_hand = toNumber(x?.on_hand ?? x?.quantity ?? 0, 0);
  const reorder_level = toNullableNumber(x?.reorder_level ?? x?.min ?? null);
  return {
    clover_item_id: x?.clover_item_id ?? x?.id ?? x?.itemId ?? String(x?.upc ?? ''),
    name: x?.name ?? x?.product_name ?? null,
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
    const rows = arr.map(normalizeRow);
    return Response.json(rows);
  } catch {
    return Response.json([]);
  }
}
