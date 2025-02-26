import React from 'react';
import { useParams } from 'react-router-dom';

const ServiceDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Service Title</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="https://via.placeholder.com/600x400"
              alt="Service"
              className="rounded-lg w-full"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-4">
              Detailed service description goes here...
            </p>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Provider</h2>
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/50x50"
                  alt="Provider"
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <p className="font-semibold">Provider Name</p>
                  <p className="text-gray-600">Rating: 4.5/5</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Price</h2>
              <p className="text-3xl font-bold text-blue-600">$99</p>
            </div>
            <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
