import React from 'react';

const Setting = () => {
  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300 mb-4">General settings here. Configure your application preferences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">Account Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" defaultValue="Admin User" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" defaultValue="admin@example.com" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">Security</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;