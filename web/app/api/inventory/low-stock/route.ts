const BASE = process.env.BACKEND_BASE!;
export async function GET() {
  const upstream = await fetch(`${BASE}/api/inventory/low-stock`, { cache: 'no-store' });
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text, { status: upstream.status });
  try { return Response.json(JSON.parse(text)); } catch { return Response.json([]); }
}
