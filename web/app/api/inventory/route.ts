const BASE = process.env.BACKEND_BASE!;

function normalizeRow(x: any) {
  return {
    clover_item_id: x.clover_item_id ?? x.id ?? x.itemId ?? String(x.upc ?? ''),
    name: x.name ?? x.product_name ?? null,
    quantity: typeof x.quantity === 'number' ? x.quantity : Number(x.quantity ?? 0),
  };
}

export async function GET() {
  const upstream = await fetch(`${BASE}/api/inventory`, { cache: 'no-store' });
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });

  try {
    const json = JSON.parse(text);
    const arr = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
    return Response.json(arr.map(normalizeRow));
  } catch {
    return Response.json([]);
  }
}
