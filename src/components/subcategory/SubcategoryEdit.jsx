import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Toast from '../Toast';

const SubcategoryEdit = ({ subcategory, categories, onSave, onCancel, isOpen, isAddingSubcategory }) => {
  const [editedSubcategory, setEditedSubcategory] = useState({
    name: '',
    description: '',
    categoryId: '',
    image: null,
    imageUrl: null
  });
  const [toast, setToast] = useState(null);

  // Update the form when subcategory prop changes or when switching between add/edit modes
  useEffect(() => {
    console.log('SubcategoryEdit - subcategory prop:', subcategory);
    console.log('SubcategoryEdit - isAddingSubcategory:', isAddingSubcategory);
    
    if (isAddingSubcategory) {
      // Clear the form for adding a new subcategory
      setEditedSubcategory({
        name: '',
        description: '',
        categoryId: categories[0]?.id || categories[0]?._id || '',
        image: null,
        imageUrl: null
      });
    } else if (subcategory) {
      // Populate the form with existing subcategory data for editing
      // Construct full image URL
      let imageUrl = null;
      if (subcategory.img) {
        imageUrl = subcategory.img.startsWith('http') 
          ? subcategory.img 
          : `https://zegapi.zeggo.in/${subcategory.img.replace(/^\//, '')}`;
      } else if (subcategory.image) {
        imageUrl = subcategory.image.startsWith('http') 
          ? subcategory.image 
          : `https://zegapi.zeggo.in/${subcategory.image.replace(/^\//, '')}`;
      } else if (subcategory.imageUrl) {
        imageUrl = subcategory.imageUrl;
      }
      
      console.log('SubcategoryEdit - Constructed imageUrl:', imageUrl);
      
      setEditedSubcategory({
        name: subcategory.name || '',
        description: subcategory.description || '',
        categoryId: subcategory.categoryId || subcategory.category?.id || subcategory.category?._id || '',
        image: subcategory.image || null,
        imageUrl: imageUrl // Store the full URL for preview
      });
    }
  }, [subcategory, isAddingSubcategory, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSubcategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedSubcategory(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (isAddingSubcategory) {
        // POST - Create new subcategory
        const formData = new FormData();
        formData.append('name', editedSubcategory.name);
        formData.append('description', editedSubcategory.description);
        formData.append('categoryId', editedSubcategory.categoryId);
        if (editedSubcategory.image && typeof editedSubcategory.image !== 'string') {
          formData.append('image', editedSubcategory.image);
        }

        const response = await api.post('/api/zeggo/subcategories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('POST Subcategory Response:', response.data);
        
        const successMessage = response.data?.message || 'Subcategory created successfully!';
        setToast({ message: successMessage, type: 'success' });
        onSave({ ...editedSubcategory, id: response.data?.data?.id || response.data?.id });
      } else {
        // PUT - Update existing subcategory
        const subcategoryId = subcategory.id || subcategory._id;
        const formData = new FormData();
        formData.append('name', editedSubcategory.name);
        formData.append('description', editedSubcategory.description);
        formData.append('categoryId', editedSubcategory.categoryId);
        if (editedSubcategory.image && typeof editedSubcategory.image !== 'string') {
          formData.append('image', editedSubcategory.image);
        }

        const response = await api.put(`/api/zeggo/subcategories/${subcategoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('PUT Subcategory Response:', response.data);
        
        const successMessage = response.data?.message || 'Subcategory updated successfully!';
        setToast({ message: successMessage, type: 'success' });
        onSave(editedSubcategory);
      }
    } catch (err) {
      console.error('Error saving subcategory:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save subcategory';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Fixed positioning container */}
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
              {isAddingSubcategory ? 'Add Subcategory' : 'Edit Subcategory'}
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
            {/* Category Selection */}
            <div className="mb-4">
              <label htmlFor="categoryId" className="block text-sm font-medium text-white mb-1">
                Parent Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={editedSubcategory.categoryId}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id || category._id} value={category.id || category._id}>
                    {category.name || 'Untitled'}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Box */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Subcategory Image
              </label>
              <div className="relative group">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all overflow-hidden">
                    {(() => {
                      console.log('Render check - imageUrl:', editedSubcategory.imageUrl);
                      console.log('Render check - image:', editedSubcategory.image);
                      console.log('Render check - image type:', typeof editedSubcategory.image);
                      
                      if (editedSubcategory.imageUrl) {
                        return (
                          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                            <img 
                              src={editedSubcategory.imageUrl} 
                              alt="Current Subcategory" 
                              className="w-full h-48 object-contain rounded-lg mb-3 shadow-lg"
                              onError={(e) => {
                                console.error('Failed to load image:', editedSubcategory.imageUrl);
                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', editedSubcategory.imageUrl);
                              }}
                            />
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                              <span className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                📷 Click to change image
                              </span>
                            </div>
                          </div>
                        );
                      } else if (editedSubcategory.image && typeof editedSubcategory.image !== 'string') {
                        return (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-16 h-16 mb-4 text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="text-base text-white font-medium">{editedSubcategory.image.name}</p>
                            <p className="text-sm text-gray-400 mt-2">New file selected</p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-16 h-16 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="text-lg font-semibold text-white mb-2">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                        );
                      }
                    })()}
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 Recommended size: 800x600 pixels for best quality
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Subcategory Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedSubcategory.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter subcategory name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={editedSubcategory.description}
                onChange={handleChange}
                rows="3"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter subcategory description"
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
              {isAddingSubcategory ? 'Add Subcategory' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SubcategoryEdit;
