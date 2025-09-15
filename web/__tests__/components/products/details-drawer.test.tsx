import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductDetailsDrawer } from '@/components/products/details-drawer'
import { api } from '@/lib/api'

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    products: {
      get: jest.fn(),
    },
  },
}))

const mockApi = api as jest.Mocked<typeof api>

describe('ProductDetailsDrawer', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockApi.products.get.mockClear()
  })

  const mockProduct = {
    clover_item_id: 'test-id',
    name: 'Test Product',
    category: 'Electronics',
    sku: 'TEST-001',
    upc: '123456789',
    visible_in_kiosk: true,
    price: 1999,
  }

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('does not render when closed', () => {
    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={false} 
        onClose={jest.fn()} 
      />
    )
    
    expect(screen.queryByText('Product Details')).not.toBeInTheDocument()
  })

  it('renders loading state when open', async () => {
    mockApi.products.get.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    expect(screen.getByText('Product Details')).toBeInTheDocument()
    expect(screen.getByText('Loading product details...')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    mockApi.products.get.mockRejectedValue(new Error('Failed to load'))

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Error loading product details')).toBeInTheDocument()
    })
  })

  it('renders product details', async () => {
    mockApi.products.get.mockResolvedValue(mockProduct)

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('test-id')).toBeInTheDocument()
      expect(screen.getByText('Electronics')).toBeInTheDocument()
      expect(screen.getByText('TEST-001')).toBeInTheDocument()
      expect(screen.getByText('123456789')).toBeInTheDocument()
      expect(screen.getByText('$19.99')).toBeInTheDocument()
      expect(screen.getByText('Visible')).toBeInTheDocument()
    })
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = jest.fn()
    mockApi.products.get.mockResolvedValue(mockProduct)

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={onClose} 
      />
    )
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', async () => {
    const onClose = jest.fn()
    mockApi.products.get.mockResolvedValue(mockProduct)

    const { container } = renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={onClose} 
      />
    )
    
    const overlay = container.querySelector('.fixed.inset-0.bg-black')
    expect(overlay).toBeInTheDocument()
    
    if (overlay) {
      fireEvent.click(overlay)
    }
    
    expect(onClose).toHaveBeenCalled()
  })

  it('shows edit product link', async () => {
    mockApi.products.get.mockResolvedValue(mockProduct)

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    await waitFor(() => {
      const editLink = screen.getByText('Edit Product')
      expect(editLink).toBeInTheDocument()
      expect(editLink.closest('a')).toHaveAttribute('href', '/products/test-id')
    })
  })

  it('handles missing optional fields', async () => {
    const productWithoutOptionals = {
      ...mockProduct,
      category: null,
      sku: null,
      upc: null,
      price: null,
      visible_in_kiosk: false,
    }
    
    mockApi.products.get.mockResolvedValue(productWithoutOptionals)

    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId="test-id" 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    await waitFor(() => {
      // Should show em dashes for missing values
      const dashElements = screen.getAllByText('—')
      expect(dashElements).toHaveLength(4) // category, price, sku, upc
      
      // Should show "Hidden" for kiosk visibility
      expect(screen.getByText('Hidden')).toBeInTheDocument()
    })
  })

  it('does not make API call when no productId provided', () => {
    renderWithQueryClient(
      <ProductDetailsDrawer 
        productId={null} 
        isOpen={true} 
        onClose={jest.fn()} 
      />
    )
    
    expect(mockApi.products.get).not.toHaveBeenCalled()
  })
})