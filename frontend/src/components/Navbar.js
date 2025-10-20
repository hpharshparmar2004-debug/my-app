import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthModal from './AuthModal';

const Navbar = ({ user, cartCount, onLogout, onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = (userData) => {
    onLogin(userData);
    setShowAuthModal(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-effect shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Asha Medical
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors" data-testid="nav-home">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium transition-colors" data-testid="nav-products">
                Products
              </Link>
              <Link to="/prescription" className="text-gray-700 hover:text-green-600 font-medium transition-colors" data-testid="nav-prescription">
                Prescription
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors" data-testid="nav-about">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors" data-testid="nav-contact">
                Contact
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative" data-testid="cart-icon">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" data-testid="user-menu">
                      <User className="w-6 h-6 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/orders')} data-testid="my-orders-link">
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} data-testid="logout-button">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  data-testid="login-button"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
            <div className="px-4 py-3 space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="block text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/prescription" className="block text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Prescription
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Navbar;
