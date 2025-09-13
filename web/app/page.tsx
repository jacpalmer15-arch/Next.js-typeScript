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

        <section className="grid gap-4 md:grid-cols-3">
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
          <Link href="/sync" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>Sync</CardTitle></CardHeader>
              <CardContent>Run product / inventory syncs.</CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}
