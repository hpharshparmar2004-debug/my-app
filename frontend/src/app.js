import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import '@/App.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import PrescriptionUpload from './pages/PrescriptionUpload';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Create axios instance with auth
export const axiosInstance = axios.create({
  baseURL: API,
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
      fetchCartCount();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCartCount(0);
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? children : <Navigate to="/" />;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar user={user} cartCount={cartCount} onLogout={logout} onLogin={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail onCartUpdate={fetchCartCount} />} />
          <Route path="/cart" element={<ProtectedRoute><Cart onCartUpdate={fetchCartCount} /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout onCartUpdate={fetchCartCount} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/prescription" element={<PrescriptionUpload />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
