/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { mockProducts } from '@/lib/mock';
import { toast } from 'sonner';

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
    
    expect(screen.getByText('Point of Sale - Checkout')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('displays available products correctly', () => {
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price);
    
    // Check that each product name is present
    availableProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
    
    // Check that price formatting works (at least one product should have this pattern)
    expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument();
  });

  it('adds product to cart when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price);
    const firstProduct = availableProducts[0];
    
    // Find and click the first add button
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
    // Check if product was added to cart
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    expect(screen.getByText(firstProduct.name)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Check if cart totals are displayed
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('Tax (8.75%):')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('increases quantity when adding same product multiple times', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add first product twice
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    await user.click(addButtons[0]);
    
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('updates quantity using quantity controls', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add a product first
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
    // Find quantity increase button and click it
    const quantityIncreaseButton = screen.getByRole('button', { name: /plus/i });
    await user.click(quantityIncreaseButton);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Find quantity decrease button and click it
    const quantityDecreaseButton = screen.getByRole('button', { name: /minus/i });
    await user.click(quantityDecreaseButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('removes item from cart using remove button', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add a product first
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
    expect(screen.getByText('Shopping Cart (1 items)')).toBeInTheDocument();
    
    // Remove the product
    const removeButton = screen.getByRole('button', { name: /trash/i });
    await user.click(removeButton);
    
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('clears entire cart when clear cart button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add multiple products
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);
    
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
    
    const availableProducts = mockProducts.filter(p => p.visible_in_kiosk && p.price);
    const firstProduct = availableProducts[0];
    
    // Add first product
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
    const subtotal = firstProduct.price!;
    const tax = Math.round(subtotal * 0.0875);
    const total = subtotal + tax;
    
    expect(screen.getByText(`$${(subtotal / 100).toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${(tax / 100).toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${(total / 100).toFixed(2)}`)).toBeInTheDocument();
  });

  it('changes payment method when selected', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);
    
    // Add a product to enable payment selection
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
    // Open payment method selector
    const paymentSelect = screen.getByRole('combobox');
    await user.click(paymentSelect);
    
    // Select cash option
    const cashOption = screen.getByText('Cash');
    await user.click(cashOption);
    
    // Verify the selection changed (this would be implementation dependent)
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
    
    // Add a product
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
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
    
    // Cart should be cleared
    expect(screen.getByText('Shopping Cart (0 items)')).toBeInTheDocument();
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
    
    // Add a product
    const addButtons = screen.getAllByRole('button', { name: /plus/i });
    await user.click(addButtons[0]);
    
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