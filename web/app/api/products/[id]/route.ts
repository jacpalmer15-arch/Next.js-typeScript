import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/lib/types';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('clover_item_id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return new Response('Product not found', { status: 404 });
      }
      console.error('Supabase error:', error);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    }

    // Transform data to match the expected Product type format
    const product: Product = {
      clover_item_id: data.clover_item_id || '',
      name: data.name || 'Unnamed',
      category: data.category || null,
      sku: data.sku || null,
      upc: data.upc || null,
      visible_in_kiosk: data.visible_in_kiosk || false,
      price: data.price || null,
    };

    return Response.json(product);
  } catch (err) {
    console.error('Product GET error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Prepare update object, ensuring only valid Product fields are updated
    const updateData: Partial<Omit<Product, 'clover_item_id'>> = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.upc !== undefined) updateData.upc = body.upc;
    if (body.visible_in_kiosk !== undefined) updateData.visible_in_kiosk = body.visible_in_kiosk;
    if (body.price !== undefined) updateData.price = Number(body.price);

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('clover_item_id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response('Product not found', { status: 404 });
      }
      console.error('Supabase update error:', error);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    }

    // Return normalized product data
    const product: Product = {
      clover_item_id: data.clover_item_id || '',
      name: data.name || 'Unnamed',
      category: data.category || null,
      sku: data.sku || null,
      upc: data.upc || null,
      visible_in_kiosk: data.visible_in_kiosk || false,
      price: data.price || null,
    };

    return Response.json(product);
  } catch (err) {
    console.error('Product PATCH error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
