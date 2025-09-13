'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { createOrderColumns } from '@/components/orders/columns';
import { OrderDetailDrawer } from '@/components/orders/order-detail-drawer';
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

  const columns = createOrderColumns(handleViewDetails);

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
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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

        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="text-sm"
          >
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border">
        {isLoading && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        )}
        
        {isError && (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">
              Error loading orders: {(error as Error).message}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        )}
        
        {!isLoading && !isError && orders.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No orders found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
        
        {!isLoading && !isError && orders.length > 0 && (
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <DataTable columns={columns} data={orders} />
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </main>
  );
}