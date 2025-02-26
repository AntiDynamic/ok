import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with actual booking data fetch
  const booking = {
    id,
    serviceName: 'Web Development',
    providerName: 'John Doe',
    date: '2024-03-01',
    status: 'pending',
    price: 99,
    description: 'Full stack web development service',
    location: 'Remote',
    duration: '2 hours',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Bookings
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{booking.serviceName}</h1>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.providerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.duration}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">${booking.price}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Service Description</h2>
              <p className="text-gray-600">{booking.description}</p>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Message Provider
                  </button>
                  <button className="w-full border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                    Cancel Booking
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

export default BookingDetails;
