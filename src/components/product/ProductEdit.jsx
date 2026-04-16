import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import useToast from '../../hooks/useToast';

const ProductEdit = ({ product, onSave, onCancel, isOpen, isAddingProduct }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    actual_price: '',
    offer_price: '',
    category_id: '',
    subcategory_id: '',
    super_category: 'grocery',
    unit: '',
    percent_off: '',
    is_trending: false,
    is_cafe: false,
    is_available: true,
    discountType: 'percent', // 'percent' or 'fixed'
    image: null,
    imageUrl: null,
    image2: null,
    imageUrl2: null,
    image3: null,
    imageUrl3: null,
    image4: null,
    imageUrl4: null
  });
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  // Fetch categories and subcategories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/zeggo/categories');
        let categoriesData = [];
        if (response.data?.data) {
          categoriesData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await api.get('/api/zeggo/subcategories');
        let subCategoriesData = [];
        if (response.data?.data) {
          subCategoriesData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (Array.isArray(response.data)) {
          subCategoriesData = response.data;
        }
        setSubCategories(subCategoriesData);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };
    
    fetchCategories();
    fetchSubCategories();
  }, []);
  
  const { showSuccess, showError } = useToast();

  // Update the form when product prop changes or when switching between add/edit modes
  useEffect(() => {
    console.log('ProductEdit - product prop:', product);
    console.log('ProductEdit - isAddingProduct:', isAddingProduct);
    
    if (isAddingProduct) {
      // Clear the form for adding a new product
      setEditedProduct({
        name: '',
        description: '',
        actual_price: '',
        offer_price: '',
        category_id: '',
        subcategory_id: '',
        super_category: 'grocery',
        unit: '',
        percent_off: '',
        is_trending: false,
        is_cafe: false,
        is_available: true,
        discountType: 'percent',
        image: null,
        imageUrl: null,
        image2: null,
        imageUrl2: null,
        image3: null,
        imageUrl3: null,
        image4: null,
        imageUrl4: null
      });
    } else if (product) {
      // Populate the form with existing product data for editing
      // Construct full image URL
      let imageUrl = null;
      if (product.img) {
        imageUrl = product.img.startsWith('http') 
          ? product.img 
          : `https://zegapi.zeggo.in/${product.img.replace(/^\//, '')}`;
      } else if (product.image) {
        imageUrl = product.image.startsWith('http') 
          ? product.image 
          : `https://zegapi.zeggo.in/${product.image.replace(/^\//, '')}`;
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }
      
      console.log('ProductEdit - Constructed imageUrl:', imageUrl);

      // Get category_id and subcategory_id from product data
      const categoryId = product.category_id || product.categoryId || (product.category && typeof product.category === 'object' ? product.category.id : product.category) || '';
      const subcategoryId = product.subcategory_id || product.subCategoryId || (product.sub_category && typeof product.sub_category === 'object' ? product.sub_category.id : product.sub_category) || '';
      
      // Determine discount type based on available data
      const discountType = product.percent_off ? 'percent' : 'fixed';
      
      setEditedProduct({
        name: product.name || '',
        description: product.product_details || product.des || product.description || '',
        actual_price: product.actual_price || '',
        offer_price: product.offer_price || '',
        category_id: categoryId,
        subcategory_id: subcategoryId,
        super_category: product.super_category || 'grocery',
        unit: product.unit || '',
        percent_off: product.percent_off || '',
        is_trending: product.is_trending || false,
        is_cafe: product.is_cafe || false,
        is_available: product.is_available !== undefined ? product.is_available : true,
        discountType: discountType,
        image: product.image || product.img || null,
        imageUrl: imageUrl,
        image2: product.img2 || null,
        imageUrl2: product.img2 ? (product.img2.startsWith('http') ? product.img2 : `https://zegapi.zeggo.in/${product.img2.replace(/^\//, '')}`) : null,
        image3: product.img3 || null,
        imageUrl3: product.img3 ? (product.img3.startsWith('http') ? product.img3 : `https://zegapi.zeggo.in/${product.img3.replace(/^\//, '')}`) : null,
        image4: product.img4 || null,
        imageUrl4: product.img4 ? (product.img4.startsWith('http') ? product.img4 : `https://zegapi.zeggo.in/${product.img4.replace(/^\//, '')}`) : null
      });
    }
  }, [product, isAddingProduct, categories, subCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-calculate offer_price when actual_price or percent_off changes (only in percent mode)
      if (prev.discountType === 'percent' && (name === 'actual_price' || name === 'percent_off') && updated.actual_price && updated.percent_off) {
        const actualPrice = parseFloat(updated.actual_price);
        // Remove % sign if present before parsing
        const percentOffStr = updated.percent_off.toString().replace('%', '');
        const percentOff = parseFloat(percentOffStr);
        
        if (!isNaN(actualPrice) && !isNaN(percentOff)) {
          const discountAmount = (actualPrice * percentOff) / 100;
          const offerPrice = actualPrice - discountAmount;
          // Round to whole number (no decimals)
          updated.offer_price = Math.round(offerPrice).toString();
        }
      }

      // Auto-calculate percent_off when offer_price changes in fixed mode
      if (prev.discountType === 'fixed' && name === 'offer_price' && updated.actual_price && updated.offer_price) {
        const actualPrice = parseFloat(updated.actual_price);
        const offerPrice = parseFloat(updated.offer_price);
        
        if (!isNaN(actualPrice) && !isNaN(offerPrice) && actualPrice > 0) {
          const discountPercent = ((actualPrice - offerPrice) / actualPrice) * 100;
          updated.percent_off = Math.round(discountPercent).toString() + '%';
        }
      }

      return updated;
    });
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
        
        setEditedProduct(prev => ({
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
    try {
      if (isAddingProduct) {
        // POST - Create new product
        const formData = new FormData();
        formData.append('name', editedProduct.name);
        formData.append('product_details', editedProduct.description);
        formData.append('actual_price', editedProduct.actual_price);
        formData.append('offer_price', editedProduct.offer_price);
        formData.append('category_id', editedProduct.category_id);
        formData.append('subcategory_id', editedProduct.subcategory_id);
        formData.append('super_category', editedProduct.super_category || 'grocery');
        if (editedProduct.unit && editedProduct.unit !== '') {
          formData.append('unit', editedProduct.unit);
        }
        if (editedProduct.percent_off && editedProduct.percent_off !== '') {
          formData.append('percent_off', editedProduct.percent_off);
        }
        formData.append('is_trending', editedProduct.is_trending ? 1 : 0);
        formData.append('is_cafe', editedProduct.is_cafe ? 1 : 0);
        formData.append('is_available', editedProduct.is_available ? 1 : 0);
        
        // Only append image if a file is actually selected
        if (editedProduct.image instanceof File) {
          formData.append('img', editedProduct.image);
          console.log('✅ Image file attached:', editedProduct.image.name, 'Type:', editedProduct.image.type, 'Size:', editedProduct.image.size);
        } else {
          console.log('⚠️ No image file attached. Image value:', editedProduct.image, 'Type:', typeof editedProduct.image);
        }
        
        // Append additional images
        if (editedProduct.image2 instanceof File) {
          formData.append('img2', editedProduct.image2);
        }
        if (editedProduct.image3 instanceof File) {
          formData.append('img3', editedProduct.image3);
        }
        if (editedProduct.image4 instanceof File) {
          formData.append('img4', editedProduct.image4);
        }

        console.log('Sending POST request with FormData:', {
          name: editedProduct.name,
          product_details: editedProduct.description,
          actual_price: editedProduct.actual_price,
          offer_price: editedProduct.offer_price,
          category_id: editedProduct.category_id,
          subcategory_id: editedProduct.subcategory_id,
          super_category: editedProduct.super_category || 'grocery',
          unit: editedProduct.unit || '(not sent if empty)',
          percent_off: editedProduct.percent_off || '(not sent if empty)',
          is_trending: editedProduct.is_trending ? 1 : 0,
          is_cafe: editedProduct.is_cafe ? 1 : 0,
          is_available: editedProduct.is_available ? 1 : 0,
          hasImage: !!(editedProduct.image && typeof editedProduct.image !== 'string')
        });

        const response = await api.post('/api/zeggo/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds for large uploads
        });
        
        console.log('POST Product Response:', response.data);
        
        const successMessage = response.data?.message || 'Product created successfully!';
        showSuccess(successMessage);
        onSave({ ...editedProduct, id: response.data?.data?.id || response.data?.id || response.data?.data?._id });
      } else {
        // PUT - Update existing product
        const productId = product.id || product._id;
        const formData = new FormData();
        formData.append('name', editedProduct.name);
        formData.append('product_details', editedProduct.description);
        formData.append('actual_price', editedProduct.actual_price);
        formData.append('offer_price', editedProduct.offer_price);
        formData.append('category_id', editedProduct.category_id);
        formData.append('subcategory_id', editedProduct.subcategory_id);
        formData.append('super_category', editedProduct.super_category || 'grocery');
        if (editedProduct.unit && editedProduct.unit !== '') {
          formData.append('unit', editedProduct.unit);
        }
        if (editedProduct.percent_off && editedProduct.percent_off !== '') {
          formData.append('percent_off', editedProduct.percent_off);
        }
        formData.append('is_trending', editedProduct.is_trending ? 1 : 0);
        formData.append('is_cafe', editedProduct.is_cafe ? 1 : 0);
        formData.append('is_available', editedProduct.is_available ? 1 : 0);
        
        // Only append image if a file is actually selected
        if (editedProduct.image instanceof File) {
          formData.append('img', editedProduct.image);
          console.log('✅ Image file attached:', editedProduct.image.name, 'Type:', editedProduct.image.type, 'Size:', editedProduct.image.size);
        } else {
          console.log('⚠️ No image file attached. Image value:', editedProduct.image, 'Type:', typeof editedProduct.image);
        }
        
        // Append additional images
        if (editedProduct.image2 instanceof File) {
          formData.append('img2', editedProduct.image2);
        }
        if (editedProduct.image3 instanceof File) {
          formData.append('img3', editedProduct.image3);
        }
        if (editedProduct.image4 instanceof File) {
          formData.append('img4', editedProduct.image4);
        }

        console.log('Sending PUT request to:', `/api/zeggo/products/${productId}`);
        console.log('FormData:', {
          name: editedProduct.name,
          product_details: editedProduct.description,
          actual_price: editedProduct.actual_price,
          offer_price: editedProduct.offer_price,
          category_id: editedProduct.category_id,
          subcategory_id: editedProduct.subcategory_id,
          super_category: editedProduct.super_category || 'grocery',
          unit: editedProduct.unit || '(not sent if empty)',
          percent_off: editedProduct.percent_off || '(not sent if empty)',
          is_trending: editedProduct.is_trending ? 1 : 0,
          is_cafe: editedProduct.is_cafe ? 1 : 0,
          is_available: editedProduct.is_available ? 1 : 0,
          hasImage: !!(editedProduct.image && typeof editedProduct.image !== 'string')
        });

        const response = await api.put(`/api/zeggo/products/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds for large uploads
        });
        
        console.log('PUT Product Response:', response.data);
        
        const successMessage = response.data?.message || 'Product updated successfully!';
        showSuccess(successMessage);
        onSave(editedProduct);
      }
    } catch (err) {
      console.error('❌ Error saving product:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Failed to save product';
      
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
    }
  };

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
              {isAddingProduct ? 'Add Product' : 'Edit Product'}
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
                Product Images <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-3">First image is mandatory. Additional images are optional.</p>
              
              {/* Image 1 - Mandatory */}
              <div className="mb-3">
                <p className="text-xs text-white mb-1">Image 1 (Required)</p>
                {renderImageUploadBox(1, editedProduct.imageUrl, editedProduct.image, handleImageChange)}
              </div>

              {/* Image 2 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 2 (Optional)</p>
                {renderImageUploadBox(2, editedProduct.imageUrl2, editedProduct.image2, handleImageChange)}
              </div>

              {/* Image 3 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 3 (Optional)</p>
                {renderImageUploadBox(3, editedProduct.imageUrl3, editedProduct.image3, handleImageChange)}
              </div>

              {/* Image 4 - Optional */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Image 4 (Optional)</p>
                {renderImageUploadBox(4, editedProduct.imageUrl4, editedProduct.image4, handleImageChange)}
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 Supports all image types and sizes • Camera photos accepted
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedProduct.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter product name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={editedProduct.description}
                onChange={handleChange}
                rows="3"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter product description"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="actual_price" className="block text-sm font-medium text-white mb-1">
                Actual Price (₹)
              </label>
              <input
                type="number"
                name="actual_price"
                id="actual_price"
                value={editedProduct.actual_price}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter actual price"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="offer_price" className="block text-sm font-medium text-white mb-1">
                Offer Price (₹)
              </label>
              <input
                type="number"
                name="offer_price"
                id="offer_price"
                value={editedProduct.offer_price}
                readOnly={editedProduct.discountType === 'percent'}
                onChange={editedProduct.discountType === 'fixed' ? handleChange : undefined}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border ${editedProduct.discountType === 'percent' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-white'}`}
                placeholder={editedProduct.discountType === 'percent' ? 'Auto-calculated from Percent Off' : 'Enter offer price'}
              />
              <p className="text-xs text-gray-400 mt-1">
                {editedProduct.discountType === 'percent' 
                  ? '💡 Auto-calculated based on Actual Price and Percent Off' 
                  : '💡 Enter offer price manually (Percent Off will be auto-calculated)'}
              </p>
            </div>

            {/* Discount Type Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Discount Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="percent"
                    checked={editedProduct.discountType === 'percent'}
                    onChange={(e) => {
                      setEditedProduct(prev => ({
                        ...prev,
                        discountType: e.target.value,
                        offer_price: '', // Reset offer price when switching to percent
                        percent_off: '' // Reset percent when switching
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Percent Off</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="fixed"
                    checked={editedProduct.discountType === 'fixed'}
                    onChange={(e) => {
                      setEditedProduct(prev => ({
                        ...prev,
                        discountType: e.target.value,
                        percent_off: '', // Reset percent when switching to fixed
                        offer_price: '' // Reset offer price when switching
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Fixed Price</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="category_id" className="block text-sm font-medium text-white mb-1">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={editedProduct.category_id}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="subcategory_id" className="block text-sm font-medium text-white mb-1">
                Subcategory
              </label>
              <select
                id="subcategory_id"
                name="subcategory_id"
                value={editedProduct.subcategory_id}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subcat) => (
                  <option key={subcat.id || subcat._id} value={subcat.id || subcat._id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="super_category" className="block text-sm font-medium text-white mb-1">
                Super Category
              </label>
              <input
                type="text"
                name="super_category"
                id="super_category"
                value={editedProduct.super_category}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="e.g., grocery"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="unit" className="block text-sm font-medium text-white mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                id="unit"
                value={editedProduct.unit}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="e.g., 1 kg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="percent_off" className="block text-sm font-medium text-white mb-1">
                Percent Off (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="percent_off"
                  id="percent_off"
                  value={editedProduct.percent_off ? editedProduct.percent_off.toString().replace('%', '') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Store with % sign for API, but display without it
                    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                      const percentOffValue = value === '' ? '' : `${value}%`;
                      
                      setEditedProduct(prev => {
                        const updated = {
                          ...prev,
                          percent_off: percentOffValue
                        };

                        // Auto-calculate offer_price when percent_off changes
                        if (updated.actual_price && updated.percent_off) {
                          const actualPrice = parseFloat(updated.actual_price);
                          const percentOffStr = updated.percent_off.toString().replace('%', '');
                          const percentOff = parseFloat(percentOffStr);
                          
                          if (!isNaN(actualPrice) && !isNaN(percentOff)) {
                            const discountAmount = (actualPrice * percentOff) / 100;
                            const offerPrice = actualPrice - discountAmount;
                            updated.offer_price = Math.round(offerPrice).toString();
                          }
                        }

                        return updated;
                      });
                    }
                  }}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 pr-8 border bg-gray-700 text-white"
                  placeholder="e.g., 10"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-gray-400 pointer-events-none">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                💡 Enter discount percentage (Offer Price will be auto-calculated)
              </p>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_trending"
                  checked={editedProduct.is_trending}
                  onChange={(e) => setEditedProduct(prev => ({ ...prev, is_trending: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-white">Is Trending</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_cafe"
                  checked={editedProduct.is_cafe}
                  onChange={(e) => setEditedProduct(prev => ({ ...prev, is_cafe: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-white">Is Cafe Product</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={editedProduct.is_available}
                  onChange={(e) => setEditedProduct(prev => ({ ...prev, is_available: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-white">Is Available</span>
              </label>
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
              {isAddingProduct ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductEdit;