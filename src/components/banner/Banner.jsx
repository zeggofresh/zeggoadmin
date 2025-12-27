import React from 'react';

const Banner = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Banners</h1>
        <p className="text-gray-600 mb-4">Manage banners here. Create promotional banners for your website.</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Upload Banner</h3>
          <p className="text-gray-600 text-sm mb-4">Click to upload or drag and drop</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Select File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;