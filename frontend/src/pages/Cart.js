import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { axiosInstance } from '../App';

const Cart = ({ onCartUpdate }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axiosInstance.put('/cart/update', {
        product_id: productId,
        quantity: quantity,
      });
      fetchCart();
      onCartUpdate();
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axiosInstance.put('/cart/update', {
        product_id: productId,
        quantity: 0,
      });
      fetchCart();
      onCartUpdate();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12" data-testid="empty-cart">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to continue</p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow-md p-6 flex gap-6"
                data-testid={`cart-item-${item.product.id}`}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.product.description}</p>
                  <p className="text-green-600 font-bold text-xl">₹{item.product.price}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    data-testid={`remove-item-${item.product.id}`}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      data-testid={`decrease-${item.product.id}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold" data-testid={`quantity-${item.product.id}`}>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      data-testid={`increase-${item.product.id}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold" data-testid="subtotal">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600" data-testid="total">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                data-testid="proceed-to-checkout-button"
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="w-full mt-3"
                data-testid="continue-shopping-button-summary"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
