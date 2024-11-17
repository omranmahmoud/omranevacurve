import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    // Load wishlist items from localStorage on initial render
    const savedItems = localStorage.getItem('wishlistItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((currentItems) => {
      if (!currentItems.some((i) => i.id === item.id)) {
        return [...currentItems, item];
      }
      return currentItems;
    });
  };

  const removeFromWishlist = (id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}