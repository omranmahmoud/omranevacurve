import React, { useState, useEffect } from 'react';
import { Save, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

interface StoreSettings {
  name: string;
  email: string;
  currency: string;
  timezone: string;
}

export function AdminSettings() {
  const { currency: currentCurrency, setCurrency } = useCurrency();
  const [settings, setSettings] = useState<StoreSettings>({
    name: 'Eva Curves Fashion Store',
    email: 'contact@evacurves.com',
    currency: currentCurrency,
    timezone: 'UTC-5'
  });
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const timezones = [
    { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
    { value: 'UTC+0', label: 'UTC+0 (GMT)' },
    { value: 'UTC+2', label: 'UTC+2 (Israel Standard Time)' },
    { value: 'UTC+1', label: 'UTC+1 (Central European Time)' }
  ];

  useEffect(() => {
    // Load initial settings
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (error) {
        toast.error('Failed to load settings');
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/settings', settings);
      // Update currency context if currency changed
      if (settings.currency !== currentCurrency) {
        await setCurrency(settings.currency);
      }
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Store Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency and Localization */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">
                Currency & Localization
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  This will be used for all product prices and orders
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {timezones.map((timezone) => (
                    <option key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end rounded-b-xl">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}