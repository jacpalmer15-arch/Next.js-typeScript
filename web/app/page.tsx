'use client';

export default function Home() {
  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to Zenith Admin. Use the sidebar navigation to manage your store.</p>
        </header>
        
        {/* Dashboard content */}
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
  );
}
