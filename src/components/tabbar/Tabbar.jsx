import React from 'react';

const Tabbar = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tab Bar Settings</h1>
        <p className="text-gray-600 mb-4">Configure tab bar here. Customize navigation tabs for mobile users.</p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-around">
            {['Home', 'Search', 'Profile', 'Settings'].map((tab, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mb-1" />
                <span className="text-xs">{tab}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Home</span>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <button className="text-blue-600 hover:text-blue-900 ml-2">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabbar;