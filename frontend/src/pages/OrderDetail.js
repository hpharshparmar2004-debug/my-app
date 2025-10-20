import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Phone, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '../App';
import { toast } from 'sonner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="order-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="mb-6"
          data-testid="back-to-orders-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                  <p className="text-gray-500">Order ID: {order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`} data-testid="order-status">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4 last:border-b-0" data-testid={`order-item-${index}`}>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">x {item.quantity}</p>
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment & Delivery Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold" data-testid="payment-method">{order.payment_method}</p>
                    {order.upi_id && (
                      <p className="text-sm text-gray-500">UPI: {order.upi_id}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold" data-testid="phone-number">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-semibold" data-testid="delivery-address">{order.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Price Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600" data-testid="order-total">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-6">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Contact us for any queries regarding your order</p>
              <div className="space-y-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  data-testid="whatsapp-support"
                >
                  WhatsApp Support
                </a>
                <a
                  href="tel:+919876543210"
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  data-testid="call-support"
                >
                  Call Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
