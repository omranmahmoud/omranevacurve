import React from 'react';
import { Users, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Total Sales', value: '$24,563', change: '+12%', icon: CreditCard },
    { name: 'Active Users', value: '2,345', change: '+5.3%', icon: Users },
    { name: 'Orders', value: '456', change: '+8.2%', icon: ShoppingBag },
    { name: 'Growth', value: '23%', change: '+2.4%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div>
                    <p className="font-medium text-gray-900">Order #{order}234</p>
                    <p className="text-sm text-gray-600">2 items • $156.00</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Delivered
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Products
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((product) => (
              <div key={product} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Product {product}</p>
                  <p className="text-sm text-gray-600">23 sales this week</p>
                </div>
                <p className="font-medium text-gray-900">$99.00</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}