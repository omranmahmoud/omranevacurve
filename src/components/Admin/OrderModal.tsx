import React from 'react';
import { X, MapPin, CreditCard, Package, Phone, Mail, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '../../context/CurrencyContext';
import { convertPrice, formatPrice } from '../../utils/currency';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export function OrderModal({ isOpen, onClose, order, onUpdateStatus }: OrderModalProps) {
  const { currency } = useCurrency();

  if (!isOpen || !order) return null;

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const handlePrint = () => {
    // Convert total amount to selected currency
    const convertedTotal = convertPrice(order.totalAmount, 'USD', currency);
    const formattedTotal = formatPrice(convertedTotal, currency);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate print-friendly HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.orderNumber}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order #${order.orderNumber}</h1>
            <p>Date: ${format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
          </div>

          <div class="grid">
            <div class="section">
              <h3>Customer Information</h3>
              <p>${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
              <p>Email: ${order.customerInfo.email}</p>
              <p>Phone: ${order.customerInfo.mobile}</p>
            </div>

            <div class="section">
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress.street}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
              <p>${order.shippingAddress.country}</p>
            </div>

            <div class="section">
              <h3>Payment Information</h3>
              <p>Method: ${order.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}</p>
              <p>Status: ${order.paymentStatus}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => {
                const itemPrice = convertPrice(item.price, 'USD', currency);
                const itemTotal = itemPrice * item.quantity;
                return `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(itemPrice, currency)}</td>
                    <td>${formatPrice(itemTotal, currency)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total Amount: ${formattedTotal}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Order {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on {format(new Date(order.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Print order"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Customer
              </h4>
              <p className="text-sm text-gray-600">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {order.customerInfo.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {order.customerInfo.mobile}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Shipping Address
              </h4>
              <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
            </div>

            {/* Payment Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                Payment Method
              </h4>
              <p className="text-sm text-gray-600">
                {order.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: any) => {
                  const itemPrice = convertPrice(item.price, 'USD', currency);
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <tr key={item.product._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </p>
                            {item.size && (
                              <p className="text-sm text-gray-500">Size: {item.size}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(itemPrice, currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(itemTotal, currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(convertPrice(order.totalAmount, 'USD', currency), currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Order Status */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-4">
              <Package className="w-5 h-5 text-gray-400" />
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  statusColors[order.status as keyof typeof statusColors]
                }`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}