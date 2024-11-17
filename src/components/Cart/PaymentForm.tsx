import React, { useState } from 'react';
import { Lock, ArrowLeft, Banknote, CreditCard as CardIcon } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

interface PaymentFormProps {
  total: number;
  onBack: () => void;
  onComplete: () => void;
  shippingData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    countryCode: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export function PaymentForm({ total, onBack, onComplete, shippingData }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create order payload
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          street: shippingData.address,
          city: shippingData.city,
          zipCode: shippingData.postalCode,
          country: 'US'
        },
        customerInfo: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          mobile: `${shippingData.countryCode}${shippingData.mobile.replace(/\D/g, '')}`
        },
        paymentMethod,
        totalAmount: total
      };

      // Send order to backend
      const response = await api.post('/orders', orderData);
      
      setOrderNumber(response.data.order.orderNumber);
      setShowConfirmation(true);
      clearCart(); // Clear cart after successful order
      toast.success('Order placed successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      toast.error(errorMessage);
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showConfirmation) {
    return (
      <OrderConfirmation
        orderNumber={orderNumber}
        email={shippingData.email}
        mobile={`${shippingData.countryCode} ${shippingData.mobile}`}
        onClose={onComplete}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                paymentMethod === 'card'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CardIcon className="w-5 h-5" />
              <span className="font-medium">Credit Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                paymentMethod === 'cod'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="font-medium">Cash on Delivery</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                required
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  required
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  required
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              Pay with cash upon delivery. Our delivery partner will collect the payment of ${total.toFixed(2)} when your order arrives.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              {paymentMethod === 'card' ? 'Pay' : 'Place Order'} ${total.toFixed(2)}
              <Lock className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}