import { NextRequest } from 'next/server';
import { createBackendHeaders, validateAuthHeader, unauthorizedResponse } from '@/lib/auth-utils';

const BASE = process.env.BACKEND_BASE!;
const SYNC_TIMEOUT_MS = Number(process.env.SYNC_TIMEOUT_MS ?? 60000);

export async function POST(request: NextRequest) {
  // Validate authentication
  if (!validateAuthHeader(request)) {
    return unauthorizedResponse();
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);

  try {
    const upstream = await fetch(`${BASE}/api/products/sync`, {
      method: 'POST',
      headers: createBackendHeaders(request),
      signal: controller.signal,
      cache: 'no-store',
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  } catch (e: unknown) {

    const err = e as Error;
    const msg = err?.name === 'AbortError'
      ? `Upstream sync timed out after ${SYNC_TIMEOUT_MS}ms`
      : (err?.message || 'Upstream sync failed');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 504,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    clearTimeout(t);
  }
}
