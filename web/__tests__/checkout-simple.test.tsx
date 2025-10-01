/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { mockProducts } from '@/lib/mock';

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

describe('Checkout Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders the checkout page', () => {
    render(<CheckoutPage />);
    
    expect(screen.getByText('Point of Sale')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('displays available products', () => {
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Check that product names are displayed
    availableProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('adds product to cart when clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Find and click first product card
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    // Verify item was added to cart and cart opened
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
      expect(screen.getByText('Subtotal:')).toBeInTheDocument();
      expect(screen.getByText('Tax (8.75%):')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
    });
  });

  it('shows payment options when cart has items', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add item to cart first
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      // Check payment method selection is visible
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      
      // Check checkout button is present
      expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
    });
  });

  it('clears cart when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price_cents);
    
    // Add item to cart first
    const productCards = screen.getAllByText(availableProducts[0].name);
    await user.click(productCards[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    });
    
    // Clear cart
    const clearButton = screen.getByText('Clear Cart');
    await user.click(clearButton);
    
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });
});