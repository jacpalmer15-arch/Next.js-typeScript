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

  // Show authenticated layout
  return (
    <>
      <header className="border-b bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold text-lg">Xeinth Admin</Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link href="/inventory" className="text-gray-600 hover:text-gray-900 transition-colors">
              Inventory
            </Link>
            <Link href="/sync" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sync
            </Link>
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
      {children}
    </>
  );
}