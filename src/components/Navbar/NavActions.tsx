import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Cart } from '../Cart/Cart';
import { WishlistModal } from '../Wishlist/WishlistModal';
import { SearchModal } from './SearchModal';
import { UserDropdown } from './UserDropdown';
import { UserIcon } from '../Common/UserIcon';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { GuestLoginForm } from './GuestLoginForm';

export function NavActions() {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
          aria-label={t('common.search')}
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          aria-label={t('common.wishlist')}
        >
          <Heart className="w-5 h-5 text-gray-600" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-medium">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          aria-label={t('common.cart')}
        >
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <UserIcon 
            name={user?.name}
            image={user?.image}
            size="sm"
            className="ring-2 ring-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
              {user ? (
                <UserDropdown 
                  isOpen={true}
                  onClose={() => setIsDropdownOpen(false)}
                  user={user}
                />
              ) : (
                <GuestLoginForm onClose={() => setIsDropdownOpen(false)} />
              )}
            </div>
          )}
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}