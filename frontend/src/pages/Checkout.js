import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { axiosInstance } from '../App';

const Checkout = ({ onCartUpdate }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    delivery_address: '',
    upi_id: '',
  });

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'UPI' && !formData.upi_id) {
      toast.error('Please enter UPI ID');
      return;
    }

    // Check if any product requires prescription
    const requiresPrescription = cart.items.some(item => item.product.requires_prescription);
    
    setSubmitting(true);
    try {
      let prescriptionData = null;
      if (prescriptionFile) {
        // Convert file to base64
        const reader = new FileReader();
        prescriptionData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(prescriptionFile);
        });
      }

      const orderData = {
        payment_method: paymentMethod,
        upi_id: paymentMethod === 'UPI' ? formData.upi_id : null,
        delivery_address: formData.delivery_address,
        phone: formData.phone,
        prescription_data: prescriptionData,
      };

      const response = await axiosInstance.post('/orders', orderData);
      toast.success('Order placed successfully!');
      onCartUpdate();
      navigate(`/orders/${response.data.order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setSubmitting(false);
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
    navigate('/cart');
    return null;
  }

  const requiresPrescription = cart.items.some(item => item.product.requires_prescription);

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="checkout-form">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="phone-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      required
                      rows={4}
                      data-testid="address-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} data-testid="payment-method-group">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="COD" id="cod" data-testid="payment-cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive your order</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="UPI" id="upi" data-testid="payment-upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="font-semibold">UPI Payment</div>
                      <div className="text-sm text-gray-500">Pay using UPI ID</div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'UPI' && (
                  <div className="mt-4">
                    <Label htmlFor="upi-id">UPI ID *</Label>
                    <Input
                      id="upi-id"
                      type="text"
                      placeholder="yourname@upi"
                      value={formData.upi_id}
                      onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                      data-testid="upi-id-input"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      You will receive payment confirmation on your registered mobile number
                    </p>
                  </div>
                )}
              </div>

              {/* Prescription Upload */}
              {requiresPrescription && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-md p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <FileText className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h2 className="text-xl font-bold text-yellow-800">Prescription Required</h2>
                      <p className="text-yellow-700 text-sm">
                        Some items in your cart require a valid prescription
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="prescription" className="text-yellow-800">Upload Prescription (Optional)</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="prescription"
                        className="flex items-center justify-center w-full border-2 border-dashed border-yellow-300 rounded-lg p-6 cursor-pointer hover:bg-yellow-100 transition-colors"
                        data-testid="prescription-upload-label"
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <p className="text-sm text-yellow-700">
                            {prescriptionFile ? prescriptionFile.name : 'Click to upload prescription'}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                      </label>
                      <input
                        id="prescription"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        data-testid="prescription-file-input"
                      />
                    </div>
                    <p className="text-xs text-yellow-700 mt-2">
                      You can also upload your prescription later or contact us via WhatsApp
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                data-testid="place-order-button"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-6 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold" data-testid="checkout-subtotal">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600" data-testid="checkout-total">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
