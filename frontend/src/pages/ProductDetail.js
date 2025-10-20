import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API, axiosInstance } from '../App';

const ProductDetail = ({ onCartUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    setAdding(true);
    try {
      await axiosInstance.post('/cart/add', {
        product_id: product.id,
        quantity: quantity,
      });
      toast.success('Added to cart!');
      onCartUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Product Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              {product.requires_prescription && (
                <span className="inline-block bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full ml-2 mb-3">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Prescription Required
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4" data-testid="product-name">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg" data-testid="product-description">{product.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600" data-testid="product-price">₹{product.price}</span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Availability:</p>
              <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="product-stock">
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'}
              </p>
            </div>

            {product.stock > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Quantity:</p>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center" data-testid="quantity-display">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="increase-quantity"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              data-testid="add-to-cart-button"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {product.requires_prescription && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This product requires a valid prescription. You can upload your prescription during checkout.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
