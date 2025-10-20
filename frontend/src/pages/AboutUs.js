import { Shield, Users, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Assured',
      description: 'We only stock genuine medicines from authorized distributors and manufacturers.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Your health and satisfaction are our top priorities. We\'re here to serve you 24/7.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Expert Team',
      description: 'Our team of licensed pharmacists ensures you get the right medication and guidance.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Community Care',
      description: 'We believe in making healthcare accessible and affordable for everyone.',
    },
  ];

  return (
    <div className="min-h-screen" data-testid="about-us-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Asha Medical</span>
            </h1>
            <p className="text-xl text-gray-600">
              Your trusted partner in healthcare, delivering quality medicines and care to your doorstep since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Asha Medical Store was founded with a simple mission: to make quality healthcare accessible to everyone. 
                We understand the importance of timely access to medicines and healthcare products, which is why we've 
                built a platform that brings them directly to your doorstep.
              </p>
              <p className="text-gray-600 mb-4">
                Starting as a small neighborhood pharmacy, we've grown to serve thousands of customers across the region. 
                Our commitment to quality, authenticity, and customer service has remained unchanged.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and expand our services to better serve your healthcare needs, making it 
                easier than ever to order medicines online with the same trust you'd have walking into a physical pharmacy.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"
                alt="Pharmacy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow" data-testid={`value-${index}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">5000+</p>
              <p className="text-green-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">10,000+</p>
              <p className="text-green-100">Orders Delivered</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-green-100">Products</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">24/7</p>
              <p className="text-green-100">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Commitment</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-6">
              At Asha Medical, we're committed to providing you with authentic medicines, expert guidance, and 
              exceptional service. Every product we sell is sourced directly from authorized distributors, and our 
              licensed pharmacists are always available to answer your questions.
            </p>
            <p className="text-lg text-gray-600">
              We believe that everyone deserves access to quality healthcare, and we're working every day to make 
              that a reality. Thank you for trusting us with your health.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
