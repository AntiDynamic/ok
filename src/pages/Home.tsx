import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchServices, Service } from '../store/slices/servicesSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { services, isLoading } = useSelector((state: RootState) => state.services);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categories] = useState([
    { id: 'design', name: 'Design & Creative', icon: '🎨' },
    { id: 'development', name: 'Development & IT', icon: '💻' },
    { id: 'marketing', name: 'Marketing', icon: '📊' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🏖️' },
  ]);

  useEffect(() => {
    // @ts-ignore - TODO: Fix dispatch type
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    // Set featured services when services are loaded
    if (services) {
      setFeaturedServices(services.slice(0, 4));
    }
  }, [services]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the Perfect Service for Your Needs
            </h1>
            <p className="text-xl mb-8">
              Connect with skilled professionals and get your projects done
            </p>
            <Link
              to="/services"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <span className="text-4xl mb-4 block">{category.icon}</span>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Services</h2>
          {isLoading ? (
            <div className="text-center">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">${service.price}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-sm text-gray-600">
                          {service.rating} ({service.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl mb-8">Join our community of skilled professionals</p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Become a Provider
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
