/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { mockProducts } from '@/lib/mock';

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
    
    expect(screen.getByText('Point of Sale - Checkout')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('displays available products', () => {
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price);
    
    // Check that product names are displayed
    availableProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
    
    // Check that add buttons are present
    const addButtons = screen.getAllByRole('button');
    const plusButtons = addButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-plus');
    });
    expect(plusButtons.length).toBeGreaterThan(0);
  });

  it('adds product to cart when clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Find and click first add button
    const addButtons = screen.getAllByRole('button');
    const plusButtons = addButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-plus');
    });
    
    await user.click(plusButtons[0]);
    
    // Verify item was added to cart
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('Tax (8.75%):')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('shows payment options when cart has items', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add item to cart first
    const addButtons = screen.getAllByRole('button');
    const plusButtons = addButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-plus');
    });
    
    await user.click(plusButtons[0]);
    
    // Check payment method selection is visible
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Check checkout button is present
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });

  it('clears cart when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add item to cart first
    const addButtons = screen.getAllByRole('button');
    const plusButtons = addButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-plus');
    });
    
    await user.click(plusButtons[0]);
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    
    // Clear cart
    const clearButton = screen.getByText('Clear Cart');
    await user.click(clearButton);
    
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });
});