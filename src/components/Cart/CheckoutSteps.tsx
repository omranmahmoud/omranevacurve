import React from 'react';
import { CreditCard, Truck } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: 'shipping' | 'payment';
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex gap-4 px-8 py-4 bg-gray-50">
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          currentStep === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'
        }`}
      >
        <Truck className="w-4 h-4" />
        Shipping
      </div>
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          currentStep === 'payment' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'
        }`}
      >
        <CreditCard className="w-4 h-4" />
        Payment
      </div>
    </div>
  );
}