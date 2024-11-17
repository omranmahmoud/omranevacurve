import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface Hero {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  isActive: boolean;
}

interface StoreContextType {
  hero: Hero | null;
  loading: boolean;
  error: string | null;
  updateHero: (heroData: Partial<Hero>) => Promise<void>;
  refreshHero: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hero/active');
      setHero(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load hero section';
      setError(errorMessage);
      console.error('Error fetching hero:', err);
      
      // Set default hero if none exists
      setHero({
        _id: 'default',
        title: 'Welcome to LUXE',
        subtitle: 'Discover our latest collection of premium fashion items.',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
        primaryButtonText: 'Shop Collection',
        secondaryButtonText: 'Explore Lookbook',
        isActive: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
    const interval = setInterval(fetchHero, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateHero = async (heroData: Partial<Hero>) => {
    try {
      setLoading(true);
      if (hero?._id && hero._id !== 'default') {
        await api.put(`/hero/${hero._id}`, heroData);
        toast.success('Hero section updated successfully');
      } else {
        await api.post('/hero', heroData);
        toast.success('Hero section created successfully');
      }
      await fetchHero();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hero section';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshHero = async () => {
    setLoading(true);
    await fetchHero();
  };

  return (
    <StoreContext.Provider
      value={{
        hero,
        loading,
        error,
        updateHero,
        refreshHero
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}