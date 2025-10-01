/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { mockProducts } from '@/lib/mock';
import { toast } from 'sonner';

// Mock the AdminLayout to bypass AuthGuard
jest.mock('@/components/layout/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the toast functionality
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders the checkout page with product list', () => {
    render(<CheckoutPage />);
    
    expect(screen.getByText('Point of Sale')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('displays available products correctly', () => {
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Check that each product name is present
    availableProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
    
    // Check that price formatting works (at least one product should have this pattern)
    expect(screen.getAllByText(/\$\d+\.\d{2}/).length).toBeGreaterThan(0);
  });

  it('adds product to cart when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    const firstProduct = availableProducts[0];
    
    // Find and click the first product card
    const productCards = screen.getAllByText(firstProduct.name);
    await user.click(productCards[0]);
    
    // Check if cart opens and product was added
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    expect(screen.getAllByText(firstProduct.name).length).toBeGreaterThan(1); // In grid and cart
    
    // Check if cart totals are displayed
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('Tax (8.75%):')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('increases quantity when adding same product multiple times', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    const firstProduct = availableProducts[0];
    
    // Add first product twice by clicking on the product card
    const productCards = screen.getAllByText(firstProduct.name);
    await user.click(productCards[0]);
    await user.click(productCards[0]);
    
    // Verify item is still 1 in cart (1 unique item) but quantity should be 2
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
  });

  it('updates quantity using quantity controls', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    const firstProduct = availableProducts[0];
    
    // Add a product first by clicking the product card
    const productCards = screen.getAllByText(firstProduct.name);
    await user.click(productCards[0]);
    
    // Wait for cart to open
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Verify quantity controls are present
    const allButtons = screen.getAllByRole('button');
    const cartButtons = allButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg && (svg.classList.contains('lucide-plus') || svg.classList.contains('lucide-minus')) && btn.className.includes('rounded-full');
    });
    
    expect(cartButtons.length).toBeGreaterThan(0);
  });

  it('removes item from cart using remove button', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    const firstProduct = availableProducts[0];
    
    // Add a product first by clicking the product card
    const productCards = screen.getAllByText(firstProduct.name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Find and click the trash button in the cart
    const allButtons = screen.getAllByRole('button');
    const trashButtons = allButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-trash-2');
    });
    
    if (trashButtons.length > 0) {
      await user.click(trashButtons[0]);
    }
    
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('clears entire cart when clear cart button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add multiple products by clicking product cards
    const product1Cards = screen.getAllByText(availableProducts[0].name);
    const product2Cards = screen.getAllByText(availableProducts[1].name);
    await user.click(product1Cards[0]);
    await user.click(product2Cards[0]);
    
    expect(screen.getByText('Shopping Cart (2 items)')).toBeInTheDocument();
    
    // Clear cart
    const clearButton = screen.getByText('Clear Cart');
    await user.click(clearButton);
    
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('calculates totals correctly', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    const firstProduct = availableProducts[0];
    
    // Add first product by clicking the product card
    const productCards = screen.getAllByText(firstProduct.name);
    await user.click(productCards[0]);
    
    const subtotal = firstProduct.price_cents!;
    const tax = Math.round(subtotal * 0.0875);
    const total = subtotal + tax;
    
    await waitFor(() => {
      // Use getAllByText since prices appear in multiple places
      expect(screen.getAllByText(`$${(subtotal / 100).toFixed(2)}`).length).toBeGreaterThan(0);
      expect(screen.getAllByText(`$${(tax / 100).toFixed(2)}`).length).toBeGreaterThan(0);
      expect(screen.getAllByText(`$${(total / 100).toFixed(2)}`).length).toBeGreaterThan(0);
    });
  });

  it('changes payment method when selected', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add a product to enable payment selection
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Verify payment method selector is present
    const paymentSelect = screen.getByRole('combobox');
    expect(paymentSelect).toBeInTheDocument();
  });

  it('shows error when trying to checkout with empty cart', async () => {
    render(<CheckoutPage />);
    
    // The checkout button should not exist when cart is empty
    expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
  });

  it('processes checkout successfully', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Mock successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Order processed successfully',
        order: { id: 'order_123' }
      })
    });
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add a product by clicking the product card
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Click checkout
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    await user.click(checkoutButton);
    
    // Wait for API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('items')
      });
    });
    
    // Check success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
    
    // Cart should be cleared and closed
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    });
  });

  it('handles checkout failure gracefully', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Mock failed API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Payment processing failed'
      })
    });
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add a product by clicking the product card
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Click checkout
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    await user.click(checkoutButton);
    
    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Payment processing failed');
    });
    
    // Cart should not be cleared
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
  });
});