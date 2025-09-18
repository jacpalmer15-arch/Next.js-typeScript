import { NextRequest } from 'next/server';
import { createBackendHeaders, validateAuthHeader, unauthorizedResponse } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  if (!validateAuthHeader(req)) {
    return unauthorizedResponse();
  }

  const res = await fetch(`${process.env.BACKEND_BASE}/api/categories`, {
    cache: 'no-store',
    headers: createBackendHeaders(req),
  });
  const text = await res.text();
  if (!res.ok) return Response.json([]); // Always return an array

  try {
    const categories = JSON.parse(text);
    if (!Array.isArray(categories)) {
      return Response.json([]); // Defensive: always return an array
    }
    return Response.json(categories);
  } catch {
    return Response.json([]);
  }
}