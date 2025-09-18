import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import { AdminLayout } from '@/components/admin-layout';
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: 'Xeinth Admin',
  description: 'Self-checkout admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 p-4 text-sm">
              <Link href="/" className="font-semibold">Xeinth Admin</Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/inventory" className="text-gray-600 hover:text-gray-900">Inventory</Link>
              <Link href="/checkout" className="text-gray-600 hover:text-gray-900">Checkout</Link>
              <Link href="/sync" className="text-gray-600 hover:text-gray-900">Sync</Link>
            </nav>
          </header>
          <AdminLayout>
            {children}
          </AdminLayout>
          {/* Sonner toaster */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
