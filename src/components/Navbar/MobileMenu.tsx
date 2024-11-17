import React from 'react';
import { Search, User, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { UserIcon } from '../Common/UserIcon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const categories = [
    { name: 'New In', href: '/new-in' },
    { name: 'Women', href: '/women' },
    { name: 'Men', href: '/men' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'Sale', href: '/sale' }
  ];

  const accountLinks = [
    { name: 'My Orders', href: '/orders', icon: ShoppingBag, count: cartCount },
    { name: 'Wishlist', href: '/wishlist', icon: Heart, count: wishlistCount },
    { name: 'Settings', href: '/settings', icon: User }
  ];

  return (
    <div
      className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-xl flex flex-col animate-fadeIn">
        {/* User Section */}
        <div className="p-4 border-b">
          {user ? (
            <div className="flex items-center gap-3">
              <UserIcon name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-900 font-medium"
              onClick={onClose}
            >
              <User className="w-5 h-5" />
              Sign In / Register
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="flex items-center justify-between w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                <span className="font-medium">{category.name}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Account Links */}
          {user && (
            <div className="p-4 border-t space-y-1">
              {accountLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center justify-between w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
                      {link.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>© 2024 LUXE</span>
            <Link to="/contact" className="hover:text-gray-900" onClick={onClose}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}