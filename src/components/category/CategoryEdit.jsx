import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import useToast from '../../hooks/useToast';

const CategoryEdit = ({ category, onSave, onCancel, isOpen, isAddingCategory }) => {
  const [editedCategory, setEditedCategory] = useState({
    name: '',
    description: '',
    image: null,
    imageUrl: null,
    image2: null,
    imageUrl2: null,
    image3: null,
    imageUrl3: null,
    image4: null,
    imageUrl4: null
  });
  const [saving, setSaving] = useState(false);
  
  const { showSuccess, showError } = useToast();

  // Update the form when category prop changes or when switching between add/edit modes
  useEffect(() => {
    console.log('CategoryEdit - category prop:', category);
    console.log('CategoryEdit - isAddingCategory:', isAddingCategory);
    
    if (isAddingCategory) {
      // Clear the form for adding a new category
      setEditedCategory({
        name: '',
        description: '',
        image: null,
        imageUrl: null,
        image2: null,
        imageUrl2: null,
        image3: null,
        imageUrl3: null,
        image4: null,
        imageUrl4: null
      });
    } else if (category) {
      // Populate the form with existing category data for editing
      // Construct full image URL
      let imageUrl = null;
      if (category.img) {
        imageUrl = category.img.startsWith('http') 
          ? category.img 
          : `https://zegapi.zeggo.in/${category.img.replace(/^\//, '')}`;
      } else if (category.image) {
        imageUrl = category.image.startsWith('http') 
          ? category.image 
          : `https://zegapi.zeggo.in/${category.image.replace(/^\//, '')}`;
      } else if (category.imageUrl) {
        imageUrl = category.imageUrl;
      }
      
      console.log('CategoryEdit - Constructed imageUrl:', imageUrl);
      
      setEditedCategory({
        name: category.name || '',
        description: category.description || '',
        image: category.image || null,
        imageUrl: imageUrl,
        image2: category.img2 || null,
        imageUrl2: category.img2 ? (category.img2.startsWith('http') ? category.img2 : `https://zegapi.zeggo.in/${category.img2.replace(/^\//, '')}`) : null,
        image3: category.img3 || null,
        imageUrl3: category.img3 ? (category.img3.startsWith('http') ? category.img3 : `https://zegapi.zeggo.in/${category.img3.replace(/^\//, '')}`) : null,
        image4: category.img4 || null,
        imageUrl4: category.img4 ? (category.img4.startsWith('http') ? category.img4 : `https://zegapi.zeggo.in/${category.img4.replace(/^\//, '')}`) : null
      });
    }
  }, [category, isAddingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageNumber) => (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // iPhone compatibility: Handle HEIC and all image types
        console.log(`📸 Image ${imageNumber} selected:`, {
          name: file.name,
          type: file.type || 'unknown (will be handled)',
          size: `${(file.size / 1024).toFixed(2)} KB`,
          sizeMB: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          isHEIC: file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic'
        });
        
        // Accept all image types including HEIC from iPhone
        // Modern browsers and backend can handle HEIC
        // Create a local URL for the selected file to show preview
        const localImageUrl = URL.createObjectURL(file);
        
        setEditedCategory(prev => ({
          ...prev,
          [`image${imageNumber === 1 ? '' : imageNumber}`]: file,
          [`imageUrl${imageNumber === 1 ? '' : imageNumber}`]: localImageUrl
        }));
      }
    } catch (error) {
      console.error(`Error loading image ${imageNumber}:`, error);
      showError(`Failed to load image ${imageNumber}. Please try again or use a different image.`);
    }
  };

  // Helper function to render image upload box
  const renderImageUploadBox = (imageNumber, imageUrl, imageData, onChangeHandler) => {
    return (
      <div className="relative group">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all overflow-hidden">
            {(() => {
              if (imageUrl) {
                return (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    <img 
                      src={imageUrl} 
                      alt={`Image ${imageNumber}`} 
                      className="w-full h-32 object-contain rounded-lg mb-2 shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                      }}
                    />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-xs font-medium">
                        📷 Click to change
                      </span>
                    </div>
                  </div>
                );
              } else if (imageData && typeof imageData !== 'string') {
                return (
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <svg className="w-12 h-12 mb-3 text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="text-sm text-white font-medium">{imageData.name}</p>
                    <p className="text-xs text-gray-400 mt-1">New file selected</p>
                  </div>
                );
              } else {
                return (
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <svg className="w-12 h-12 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="text-sm font-semibold text-white mb-1">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">Any image format</p>
                  </div>
                );
              }
            })()}
            <input 
              type="file" 
              className="hidden" 
              onChange={onChangeHandler(imageNumber)}
              accept="image/*,image/heic,image/heif,.heic,.heif"
            />
          </label>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isAddingCategory) {
        // POST - Create new category
        const formData = new FormData();
        formData.append('name', editedCategory.name);
        formData.append('des', editedCategory.description);  // API uses 'des' not 'description'
        if (editedCategory.image && typeof editedCategory.image !== 'string') {
          formData.append('img', editedCategory.image);  // API uses 'img' not 'image'
        }
        if (editedCategory.image2 && typeof editedCategory.image2 !== 'string') {
          formData.append('img2', editedCategory.image2);
        }
        if (editedCategory.image3 && typeof editedCategory.image3 !== 'string') {
          formData.append('img3', editedCategory.image3);
        }
        if (editedCategory.image4 && typeof editedCategory.image4 !== 'string') {
          formData.append('img4', editedCategory.image4);
        }

        console.log('Sending POST request with FormData:', {
          name: editedCategory.name,
          des: editedCategory.description,
          hasImage: !!editedCategory.image && typeof editedCategory.image !== 'string'
        });

        const response = await api.post('/api/zeggo/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds for large uploads
        });
        
        console.log('POST Category Response:', response.data);
        
        const successMessage = response.data?.message || 'Category created successfully!';
        showSuccess(successMessage);
        onSave({ ...editedCategory, id: response.data?.data?.id || response.data?.id || response.data?.data?._id });
      } else {
        // PUT - Update existing category
        const categoryId = category.id || category._id;
        const formData = new FormData();
        formData.append('name', editedCategory.name);
        formData.append('des', editedCategory.description);  // API uses 'des'
        if (editedCategory.image && typeof editedCategory.image !== 'string') {
          formData.append('img', editedCategory.image);  // API uses 'img'
        }
        if (editedCategory.image2 instanceof File) {
          formData.append('img2', editedCategory.image2);
        }
        if (editedCategory.image3 instanceof File) {
          formData.append('img3', editedCategory.image3);
        }
        if (editedCategory.image4 instanceof File) {
          formData.append('img4', editedCategory.image4);
        }

        console.log('Sending PUT request to:', `/api/zeggo/categories/${categoryId}`);
        console.log('FormData:', {
          name: editedCategory.name,
          des: editedCategory.description,
          hasImage: !!editedCategory.image && typeof editedCategory.image !== 'string'
        });

        const response = await api.put(`/api/zeggo/categories/${categoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds for large uploads
        });
        
        console.log('PUT Category Response:', response.data);
        
        const successMessage = response.data?.message || 'Category updated successfully!';
        showSuccess(successMessage);
        onSave(editedCategory);
      }
    } catch (err) {
      console.error('❌ Error saving category:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to save category';
      
      // Network error (no response from server)
      if (!err.response) {
        errorMessage = 'Network error - Please check your internet connection or backend server';
        console.error('⚠️ No response received from server. Possible causes:');
        console.error('  - Backend server is down');
        console.error('  - Network connectivity issue');
        console.error('  - CORS policy blocking the request');
        console.error('  - Upload timeout (large file)');
        console.error('  - Request was cancelled');
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout - Image is too large. Please try a smaller image or check your connection.';
        console.error('⏱️ Request timed out:', err.message);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <>
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
              {isAddingCategory ? 'Add Category' : 'Edit Category'}
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
            {/* Image Upload Boxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Category Images <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-3">First image is mandatory. Additional images are optional.</p>
              
              {/* Image 1 - Mandatory */}
              <div className="mb-3">
                <p className="text-xs text-white mb-1">Image 1 (Required)</p>
                {renderImageUploadBox(1, editedCategory.imageUrl, editedCategory.image, handleImageChange)}
              </div>

              {/* Image 2 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 2 (Optional)</p>
                {renderImageUploadBox(2, editedCategory.imageUrl2, editedCategory.image2, handleImageChange)}
              </div>

              {/* Image 3 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 3 (Optional)</p>
                {renderImageUploadBox(3, editedCategory.imageUrl3, editedCategory.image3, handleImageChange)}
              </div>

              {/* Image 4 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 4 (Optional)</p>
                {renderImageUploadBox(4, editedCategory.imageUrl4, editedCategory.image4, handleImageChange)}
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 Supports all image types and sizes • Camera photos accepted
              </p>
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
              {isAddingCategory ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryEdit;