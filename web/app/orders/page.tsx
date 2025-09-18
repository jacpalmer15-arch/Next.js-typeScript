'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { DataTable } from '@/components/products/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: orders = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders', { 
      customer: customerSearch, 
      status: statusFilter, 
      from_date: fromDate, 
      to_date: toDate 
    }],
    queryFn: () =>
      api.orders.list({
        customer: customerSearch || undefined,
        status: statusFilter !== 'all' ? statusFilter as OrderStatus : undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      }),
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  };

  const clearFilters = () => {
    setCustomerSearch('');
    setStatusFilter('all');
    setFromDate('');
    setToDate('');
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button onClick={() => refetch()} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="customer-search">Customer</Label>
            <Input
              id="customer-search"
              placeholder="Search by name or email..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="from-date">From Date</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="to-date">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear Filters
          </Button>
          <Button onClick={() => refetch()} size="sm">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      {!isLoading && (
        <div className="mb-6 text-sm text-gray-600">
          Showing {orders.length} orders
        </div>
      )}

      {/* Orders Table */}
      {isLoading && <div className="text-center py-8">Loading orders...</div>}
      
      {isError && (
        <div className="text-center py-8 text-red-600">
          <p>Failed to load orders</p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      )}
      
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 font-mono text-sm">{order.id}</td>
                        <td className="py-3">
                          {order.customer_name || order.customer_email || 'Guest'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono">
                          ${(order.total_amount / 100).toFixed(2)}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <Button
                            onClick={() => handleViewDetails(order)}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}