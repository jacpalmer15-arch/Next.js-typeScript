'use client';

import { useAuth } from '@/lib/auth-context';
import { User } from 'lucide-react';

export default function Home() {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar with Profile */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.email || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to Zenith Admin. Use the navigation above to manage your store.</p>
          </header>
          
          {/* Dashboard content without the center cards */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-600">-</p>
                <p className="text-sm text-gray-500">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">-</p>
                <p className="text-sm text-gray-500">Low Stock Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-600">-</p>
                <p className="text-sm text-gray-500">Recent Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
