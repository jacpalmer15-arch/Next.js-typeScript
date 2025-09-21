'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailsDrawerProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsDrawer({
  productId,
  isOpen,
  onClose,
}: ProductDetailsDrawerProps) {
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => (productId ? api.products.get(productId) : null),
    enabled: !!productId && isOpen,
  });

  // Fetch categories to resolve category name from category_id
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
    enabled: !!productId && isOpen,
  });

  // Find category name based on category_id
  const categoryName = product?.category_id 
    ? categories.find((cat: { id: string; name: string }) => cat.id === product.category_id)?.name || '—'
    : '—';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading product details...</p>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading product details</p>
              <p className="text-sm text-gray-500 mt-1">{String(error)}</p>
            </div>
          )}
          
          {product && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {product.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clover Item ID
                </label>
                <div className="p-3 bg-gray-50 rounded border text-xs font-mono">
                  {product.clover_item_id}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {categoryName}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {product.price_cents ? formatCurrency(product.price_cents) : '—'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {product.sku || '—'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPC
                  </label>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {product.upc || '—'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiosk Visibility
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.visible_in_kiosk 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.visible_in_kiosk ? 'Visible' : 'Hidden'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <a
                  href={`/products/${product.clover_item_id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  onClick={onClose}
                >
                  Edit Product
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}