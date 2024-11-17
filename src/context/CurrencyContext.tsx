import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  setCurrency: (currency: string) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState(() => 
    localStorage.getItem('currency') || 'USD'
  );

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    ILS: '₪',
    EUR: '€'
  };

  useEffect(() => {
    // Load initial currency from server settings
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        const serverCurrency = response.data.currency;
        if (serverCurrency && serverCurrency !== currency) {
          setCurrencyState(serverCurrency);
          localStorage.setItem('currency', serverCurrency);
        }
      } catch (error) {
        console.error('Failed to load currency settings:', error);
      }
    };

    loadSettings();
  }, []);

  const setCurrency = async (newCurrency: string) => {
    try {
      // Update server settings
      await api.put('/settings', { currency: newCurrency });
      
      // Update local state and storage
      setCurrencyState(newCurrency);
      localStorage.setItem('currency', newCurrency);
      
      toast.success('Currency updated successfully');
    } catch (error) {
      toast.error('Failed to update currency');
      throw error;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      symbol: currencySymbols[currency],
      setCurrency
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}