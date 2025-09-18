import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const kioskOnly = searchParams.get('kiosk_only') === 'true';

    // Start building the query
    let query = supabase.from('products').select('*');

    // Apply filters based on search parameters
    if (search) {
      // Search across name, sku, and upc fields
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,upc.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (kioskOnly) {
      query = query.eq('visible_in_kiosk', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    }

    // Transform data to match the expected Product type format
    const products: Product[] = (data || []).map((row) => ({
      clover_item_id: row.clover_item_id || '',
      name: row.name || 'Unnamed',
      category: row.category || null,
      sku: row.sku || null,
      upc: row.upc || null,
      visible_in_kiosk: row.visible_in_kiosk || false,
      price: row.price || null, // assuming price is stored directly in cents
    }));

    return Response.json(products);
  } catch (err) {
    console.error('Products API error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}