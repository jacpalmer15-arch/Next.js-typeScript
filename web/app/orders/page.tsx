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

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from '@/lib/api'
import { Order, OrderStatus } from '@/lib/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Search, Filter, Eye, Calendar } from 'lucide-react'

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'canceled', label: 'Canceled' },
]

const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'paid':
      return 'default'
    case 'fulfilled':
      return 'outline'
    case 'canceled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [customerFilter, setCustomerFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: orders = [], isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ['orders', { status: statusFilter, customer: customerFilter, from_date: fromDate, to_date: toDate }],
    queryFn: () => api.orders.list({
      status: statusFilter !== 'all' ? statusFilter as OrderStatus : undefined,
      customer: customerFilter || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }),
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedOrder(null)
  }

  const clearFilters = () => {
    setStatusFilter('all')
    setCustomerFilter('')
    setFromDate('')
    setToDate('')
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer-filter">Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="customer-filter"
                    placeholder="Search customer..."
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
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

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600">
              Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No orders found with the selected filters.</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateTime(order.created_at)}
                          </div>
                        </div>
                        
                        {order.customer_name && (
                          <div>
                            <p className="text-sm font-medium">{order.customer_name}</p>
                            {order.customer_email && (
                              <p className="text-xs text-gray-500">{order.customer_email}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                        
                        <div className="text-right">
                          <p className="font-bold">
                            {formatCurrency(order.total_amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Note:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Order Detail Drawer */}
        <OrderDetailDrawer
          order={selectedOrder}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </AdminLayout>
  );
}