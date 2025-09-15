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

          {/* Sonner toaster */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
