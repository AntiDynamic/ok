import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // TODO: Replace with actual Redux state type
  const user = useSelector((state: any) => state.auth.user);

  const stats = {
    totalBookings: 0,
    activeServices: 0,
    totalEarnings: 0,
    pendingReviews: 0,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.displayName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Active Services</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.activeServices}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
            <p className="text-2xl font-bold text-gray-800">${stats.totalEarnings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending Reviews</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.pendingReviews}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/create-service"
                className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-600 transition"
              >
                Create Service
              </Link>
              <Link
                to="/messages"
                className="bg-green-500 text-white rounded-lg p-4 text-center hover:bg-green-600 transition"
              >
                Messages
              </Link>
              <Link
                to="/bookings"
                className="bg-purple-500 text-white rounded-lg p-4 text-center hover:bg-purple-600 transition"
              >
                View Bookings
              </Link>
              <Link
                to="/analytics"
                className="bg-yellow-500 text-white rounded-lg p-4 text-center hover:bg-yellow-600 transition"
              >
                Analytics
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-gray-600">No recent activity to show.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;