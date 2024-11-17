import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, Users, Settings, LogOut, Image, Star, MessageSquare, FolderTree } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon } from '../Common/UserIcon';
import { Dashboard } from './Dashboard';
import { Products } from './Products';
import { Orders } from './Orders';
import { AdminSettings } from './AdminSettings';
import { Hero } from './Hero';
import { FeaturedCollection } from './FeaturedCollection';
import { Reviews } from './Reviews';
import { Categories } from './Categories';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutGrid, to: '/admin' },
    { name: 'Products', icon: Package, to: '/admin/products' },
    { name: 'Categories', icon: FolderTree, to: '/admin/categories' },
    { name: 'Featured', icon: Star, to: '/admin/featured' },
    { name: 'Hero', icon: Image, to: '/admin/hero' },
    { name: 'Orders', icon: Users, to: '/admin/orders' },
    { name: 'Reviews', icon: MessageSquare, to: '/admin/reviews' },
    { name: 'Settings', icon: Settings, to: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 h-16 px-6 border-b">
            <UserIcon name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'Admin'}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/featured" element={<FeaturedCollection />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}