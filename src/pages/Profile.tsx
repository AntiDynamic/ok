import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-8">
            <img
              src={user?.photoURL || 'https://via.placeholder.com/100x100'}
              alt="Profile"
              className="rounded-full w-24 h-24 mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold">{user?.displayName || 'User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={user?.displayName || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={user?.email || ''}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
