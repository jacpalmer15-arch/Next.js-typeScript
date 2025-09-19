'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authState, signOut } = useAuth();
  const { user, loading } = authState;
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/login');
    }
  }, [user, loading, isLoginPage, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page without layout
  if (isLoginPage || !user) {
    return <>{children}</>;
  }

  // Show authenticated layout with universal header
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Universal Header */}
      <header className="border-b bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold text-xl text-gray-900">
              Zenith Admin
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link 
                href="/" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/products" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/products' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Products
              </Link>
              <Link 
                href="/inventory" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/inventory' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Inventory
              </Link>
              <Link 
                href="/orders" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/orders' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Orders
              </Link>
              <Link 
                href="/checkout" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/checkout' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Checkout
              </Link>
              <Link 
                href="/sync" 
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === '/sync' ? 'font-medium text-gray-900' : ''
                }`}
              >
                Sync & Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}