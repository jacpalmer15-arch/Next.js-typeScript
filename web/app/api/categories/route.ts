export async function GET() {
  const res = await fetch(`${process.env.BACKEND_BASE}/api/products`, { cache: 'no-store' });
  const text = await res.text();
  if (!res.ok) return new Response(text, { status: res.status });

  let items: any[] = [];
  try { items = JSON.parse(text); } catch { return Response.json([]); }

  const set = new Set<string>();
  for (const p of items) if (p.category) set.add(String(p.category));
  return Response.json(Array.from(set).sort());
}
