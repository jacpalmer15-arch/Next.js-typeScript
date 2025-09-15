import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function Home() {
  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="space-x-2">
            <Button>New</Button>
            <Button variant="outline">Sync</Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/products" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Products</CardTitle></CardHeader>
              <CardContent>List, search, and toggle kiosk visibility.</CardContent>
            </Card>
          </Link>
          <Link href="/inventory" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
              <CardContent>Stock levels and low-stock alerts.</CardContent>
            </Card>
          </Link>
          <Link href="/orders" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
              <CardContent>Manage orders and order status.</CardContent>
            </Card>
          </Link>
          <Link href="/checkout" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Checkout</CardTitle></CardHeader>
              <CardContent>Point of Sale system for processing orders.</CardContent>
            </Card>
          </Link>
          <Link href="/sync" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Sync & Settings</CardTitle></CardHeader>
              <CardContent>Run product / inventory syncs and manage settings.</CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}
