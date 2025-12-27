import React, { useState, useEffect } from 'react';

const TrendingCategoryEdit = ({ category, onSave, onCancel, isOpen, isAddingTrendingCategory }) => {
  const [editedCategory, setEditedCategory] = useState({
    name: '',
    rank: '',
    description: '',
    image: null
  });

  // Update the form when category prop changes or when switching between add/edit modes
  useEffect(() => {
    if (isAddingTrendingCategory) {
      // Clear the form for adding a new trending category
      setEditedCategory({
        name: '',
        rank: '',
        description: '',
        image: null
      });
    } else if (category) {
      // Populate the form with existing category data for editing
      setEditedCategory({
        name: category.name || '',
        rank: category.rank || '',
        description: category.description || '',
        image: category.image || null
      });
    }
  }, [category, isAddingTrendingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedCategory(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSave = () => {
    onSave(editedCategory);
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    // Fixed positioning container
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Sidebar panel - slides from right */}
      <div 
        className={`absolute top-0 right-0 h-full w-96 bg-[#464859] shadow-xl transform transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-[#464859] flex justify-between items-center border-b border-gray-600">
            <h3 className="text-lg leading-6 font-medium text-white">
              {isAddingTrendingCategory ? 'Add Trending Category' : 'Edit Trending Category'}
            </h3>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-300 text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-5 flex-grow overflow-y-auto scrollbar-hide">
            {/* Image Upload Box */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                Category Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                  {editedCategory.image ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-sm text-white">
                        {typeof editedCategory.image === 'string' 
                          ? editedCategory.image 
                          : editedCategory.image.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedCategory.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter category name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="rank" className="block text-sm font-medium text-white mb-1">
                Rank
              </label>
              <input
                type="number"
                name="rank"
                id="rank"
                value={editedCategory.rank}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter rank"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={editedCategory.description}
                onChange={handleChange}
                rows="3"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter category description"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-[#464859] flex justify-end space-x-3 border-t border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {isAddingTrendingCategory ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCategoryEdit;