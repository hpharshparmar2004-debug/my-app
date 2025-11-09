import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Clock, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const categories = [
    { name: 'Medicines', icon: '💊', link: '/products?category=Medicines' },
    { name: 'Vitamins & Supplements', icon: '🌿', link: '/products?category=Vitamins & Supplements' },
    { name: 'Personal Care', icon: '🧴', link: '/products?category=Personal Care' },
    { name: 'Medical Devices', icon: '🩺', link: '/products?category=Medical Devices' },
    { name: 'Baby Care', icon: '👶', link: '/products?category=Baby Care' },
    { name: 'First Aid', icon: '🏥', link: '/products?category=First Aid' },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Authentic Products',
      description: '100% genuine medicines from trusted manufacturers',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
    },
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <span className="block bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Order medicines online with ease. Get authentic products delivered to your doorstep with prescription upload and multiple payment options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full"
                    data-testid="shop-now-button"
                  >
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/prescription">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-6 text-lg rounded-full"
                    data-testid="upload-prescription-button"
                  >
                    <FileText className="mr-2 w-5 h-5" />
                    Upload Prescription
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative floating">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop"
                  alt="Medical supplies"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-green-200 to-teal-300 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`category-${category.name.toLowerCase().replace(/ /g, '-')}`}
              >
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm text-gray-800 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Choose Asha Medical?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="slide-up bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.15}s` }}
                data-testid={`feature-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Need Help with Your Order?</h2>
          <p className="text-lg mb-8 opacity-90">
            Our team is available 24/7 to assist you. Connect with us via WhatsApp or call us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919193835311"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              data-testid="whatsapp-cta"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+919193835311"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors"
              data-testid="call-cta"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
