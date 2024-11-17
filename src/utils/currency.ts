import { toast } from 'react-hot-toast';

const exchangeRates = {
  USD: 1,
  ILS: 3.6,
  EUR: 0.92
};

export function convertPrice(price: number, fromCurrency: string, toCurrency: string): number {
  try {
    // Return 0 if price is not a valid number
    if (typeof price !== 'number' || isNaN(price)) {
      console.error('Invalid price value:', price);
      return 0;
    }

    // Return original price if currencies are the same
    if (fromCurrency === toCurrency) return price;
    
    // Check if exchange rates exist for both currencies
    if (!(fromCurrency in exchangeRates) || !(toCurrency in exchangeRates)) {
      console.error('Invalid currency:', { fromCurrency, toCurrency });
      return price;
    }
    
    // Convert to USD first if not already in USD
    const usdAmount = fromCurrency === 'USD' ? price : price / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    
    // Convert from USD to target currency
    return Number((usdAmount * exchangeRates[toCurrency as keyof typeof exchangeRates]).toFixed(2));
  } catch (error) {
    console.error('Currency conversion error:', error);
    return price;
  }
}

export function formatPrice(amount: number, currency: string): string {
  try {
    // Return placeholder if amount is not a valid number
    if (typeof amount !== 'number' || isNaN(amount)) {
      console.error('Invalid amount:', amount);
      return '---';
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  } catch (error) {
    console.error('Price formatting error:', error);
    return `${amount}`;
  }
}