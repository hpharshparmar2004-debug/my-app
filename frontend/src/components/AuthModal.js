import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '../App';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginData);
      localStorage.setItem('token', response.data.token);
      onSuccess(response.data.user);
      toast.success('Login successful!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, registerData);
      localStorage.setItem('token', response.data.token);
      onSuccess(response.data.user);
      toast.success('Registration successful!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle>Welcome to Asha Medical</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
            <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  data-testid="login-email-input"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="********"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  data-testid="login-password-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4" data-testid="register-form">
              <div>
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                  data-testid="register-name-input"
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  data-testid="register-email-input"
                />
              </div>
              <div>
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                  data-testid="register-phone-input"
                />
              </div>
              <div>
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="********"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  data-testid="register-password-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600"
                disabled={loading}
                data-testid="register-submit-button"
              >
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
