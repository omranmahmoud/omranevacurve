import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/currency';

interface CartSummaryProps {
  subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { currency } = useCurrency();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className="border-t bg-gray-50 px-6 py-6">
        <div className="space-y-4">
          <div className="flex justify-between text-base text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-base text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping, currency)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total, currency)}</span>
          </div>

          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
          >
            <span>Checkout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </>
  );
}