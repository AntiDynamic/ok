import React from 'react';

const ServiceListing: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Service cards will be mapped here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Service Title</h2>
          <p className="text-gray-600 mb-4">Service description goes here...</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">$99</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListing;
