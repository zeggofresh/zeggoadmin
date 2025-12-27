import React from 'react';

const Notification = () => {
  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-300 mb-4">Manage notifications here. Send alerts and updates to your users.</p>
        
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-900/30 rounded">
            <h3 className="font-semibold text-white">System Update</h3>
            <p className="text-gray-300 text-sm">Scheduled maintenance on Sunday at 2 AM</p>
            <div className="mt-2 text-xs text-gray-400">2 hours ago</div>
          </div>
          
          <div className="p-4 border-l-4 border-green-500 bg-green-900/30 rounded">
            <h3 className="font-semibold text-white">New User Registration</h3>
            <p className="text-gray-300 text-sm">John Doe registered for an account</p>
            <div className="mt-2 text-xs text-gray-400">5 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;