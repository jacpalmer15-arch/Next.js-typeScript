/**
 * @jest-environment node
 */

import { api } from '@/lib/api';
import { InventoryAdjustment } from '@/lib/types';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Client - Inventory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('inventory.all', () => {
    it('fetches all inventory items', async () => {
      const mockResponse = [
        {
          clover_item_id: 'item1',
          name: 'Test Item',
          on_hand: 10,
          reorder_level: 5,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await api.inventory.all();
      
      expect(mockFetch).toHaveBeenCalledWith('/api/inventory', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error'),
      });

      await expect(api.inventory.all()).rejects.toThrow('HTTP 500 Internal Server Error');
    });
  });

  describe('inventory.lowStock', () => {
    it('fetches low stock items', async () => {
      const mockResponse = [
        {
          clover_item_id: 'item1',
          name: 'Low Stock Item',
          on_hand: 2,
          reorder_level: 5,
          low_stock: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await api.inventory.lowStock();
      
      expect(mockFetch).toHaveBeenCalledWith('/api/inventory/low-stock', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('inventory.adjust', () => {
    it('adjusts inventory successfully', async () => {
      const adjustment: InventoryAdjustment = {
        clover_item_id: 'item1',
        adjustment: 5,
        reason: 'Stock received',
      };

      const mockResponse = {
        success: true,
        new_quantity: 15,
        message: 'Inventory adjusted successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await api.inventory.adjust(adjustment);
      
      expect(mockFetch).toHaveBeenCalledWith('/api/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify(adjustment),
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles adjustment errors', async () => {
      const adjustment: InventoryAdjustment = {
        clover_item_id: 'item1',
        adjustment: 5,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid adjustment'),
      });

      await expect(api.inventory.adjust(adjustment)).rejects.toThrow('HTTP 400 Bad Request');
    });

    it('handles non-JSON responses for successful adjustments', async () => {
      const adjustment: InventoryAdjustment = {
        clover_item_id: 'item1',
        adjustment: 5,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('Success'),
      });

      const result = await api.inventory.adjust(adjustment);
      expect(result).toBe('Success');
    });
  });
});