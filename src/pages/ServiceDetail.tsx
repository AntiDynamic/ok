import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceById } from '../features/services/servicesSlice';
import { createBooking } from '../features/bookings/bookingsSlice';
import { RootState } from '../features/store';
import { Service, Review } from '../types';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentService, isLoading, error } = useSelector((state: RootState) => state.services);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookingNote, setBookingNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [dispatch, id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedDate) {
      alert('Please select a date for your booking');
      return;
    }
    
    try {
      if (currentService) {
        await dispatch(createBooking({
          serviceId: currentService.id,
          providerId: currentService.providerId,
          customerId: user.uid,
          date: selectedDate,
          status: 'pending',
          price: currentService.price,
          note: bookingNote,
          createdAt: new Date().toISOString()
        }));
        
        alert('Booking request sent successfully!');
        setSelectedDate('');
        setBookingNote('');
        setShowBookingForm(false);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Service not found</h2>
          <p className="mt-4 text-lg text-gray-500">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-96 w-full object-cover md:w-96"
                src={currentService.imageUrl || 'https://via.placeholder.com/400x600'}
                alt={currentService.title}
              />
            </div>
            <div className="p-8 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {currentService.category}
                  </span>
                  <h1 className="mt-2 text-3xl font-bold text-gray-900">{currentService.title}</h1>
                </div>
                <div className="text-2xl font-bold text-blue-600">${currentService.price}</div>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(currentService.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {currentService.rating.toFixed(1)} ({currentService.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({currentService.reviewCount})
                  </button>
                </div>
                
                <div className="mt-4">
                  {activeTab === 'description' ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{currentService.description}</p>
                      
                      {currentService.features && currentService.features.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-gray-900">What's included:</h3>
                          <ul className="mt-2 space-y-2">
                            {currentService.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {currentService.reviews && currentService.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {currentService.reviews.map((review: Review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-6">
                              <div className="flex items-center mb-2">
                                <img
                                  src={review.userPhotoURL || 'https://via.placeholder.com/40'}
                                  alt={review.userName}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">{review.userName}</h4>
                                  <div className="flex items-center">
                                    <div className="flex text-yellow-400">
                                      {[...Array(5)].map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                          }`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No reviews yet for this service.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                {!showBookingForm ? (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition duration-300"
                  >
                    Book This Service
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Book This Service</h3>
                    <form onSubmit={handleBookingSubmit}>
                      <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          min={minDate}
                          max={maxDateStr}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          id="note"
                          rows={3}
                          value={bookingNote}
                          onChange={(e) => setBookingNote(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Any special requirements or information for the service provider..."
                        ></textarea>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-blue-600">Total: ${currentService.price}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-300"
                          >
                            Confirm Booking
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Provider Info */}
          <div className="border-t border-gray-200 px-8 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">About the Service Provider</h3>
            <div className="flex items-start">
              <img
                src={currentService.providerPhotoURL || 'https://via.placeholder.com/60'}
                alt={currentService.providerName}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-medium text-gray-900">{currentService.providerName}</h4>
                <p className="text-gray-500 text-sm">Member since {new Date(currentService.providerJoinDate || Date.now()).toLocaleDateString()}</p>
                <div className="mt-2">
                  <button
                    onClick={() => navigate(`/chat/${currentService.providerId}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Contact Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
