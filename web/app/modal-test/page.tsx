'use client';

import { useState } from 'react';
import { ProductDetailsModal } from '@/components/products/details-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a mock query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function ModalTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product Details Modal Test</h1>
        <p className="mb-4 text-gray-600">
          This page demonstrates the new product details modal functionality.
          Click the button below to open the modal with a test product ID.
        </p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Open Product Details Modal
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Changes Made:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Created new ProductDetailsModal component using shadcn/ui Dialog</li>
            <li>Converted drawer layout to centered modal popup</li>
            <li>Maintained identical view/edit functionality</li>
            <li>Fixed category field value handling (null vs empty string)</li>
            <li>Updated enhanced-data-table to use modal instead of drawer</li>
          </ul>
        </div>

        <ProductDetailsModal
          productId="test-product-id"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </QueryClientProvider>
  );
}