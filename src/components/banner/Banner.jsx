import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingAnimation from '../LoadingAnimation';
import useToast from '../../hooks/useToast';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bannerName, setBannerName] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  
  const { showSuccess, showError } = useToast();
  
  // Edit mode state
  const [editingBanner, setEditingBanner] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/banners');
      
      console.log('GET Response:', response.data); // Debug log
      
      // Handle different API response structures
      let bannersData = [];
      
      if (response.data) {
        // If response has data property (like {status: true, data: [...]})
        if (Array.isArray(response.data.data)) {
          bannersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // If response is directly an array
          bannersData = response.data;
        } else if (response.data.banners && Array.isArray(response.data.banners)) {
          // If response has banners property
          bannersData = response.data.banners;
        }
      }
      
      console.log('Parsed Banners:', bannersData); // Debug log
      
      // Add full image URL if img is just a filename/path
      const bannersWithFullUrl = bannersData.map(banner => ({
        ...banner,
        fullImageUrl: banner.img 
          ? (banner.img.startsWith('http') ? banner.img : `https://zegapi.zeggo.in/${banner.img.replace(/^\//, '')}`)
          : null,
        // Store original banner data for debugging
        _originalData: banner
      }));
      
      setBanners(bannersWithFullUrl);
      setError(null);
    } catch (err) {
      console.error('Error fetching banners:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load banners';
      setError(errorMessage);
      setBanners([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // iPhone compatibility: Handle HEIC and all image types
      console.log('📸 Banner image selected:', {
        name: file.name,
        type: file.type || 'unknown (will be handled)',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        isHEIC: file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic'
      });
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('name', bannerName || 'Banner');
      formData.append('description', bannerDescription || '');
      formData.append('img', selectedFile);

      const response = await api.post('/api/zeggo/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('POST Response:', response.data); // Debug log
      const successMessage = response.data?.message || 'Banner uploaded successfully!';
      showSuccess(successMessage);
      setSelectedFile(null);
      setPreviewUrl(null);
      setBannerName('');
      setBannerDescription('');
      fetchBanners(); // Refresh banner list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error uploading banner:', err);
      setError(err.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      await api.delete(`/api/zeggo/banners/${bannerId}`);
      
      console.log('DELETE Response:', response?.data); // Debug log
      showSuccess('Banner deleted successfully!');
      fetchBanners(); // Refresh banner list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting banner:', err);
      setError(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.name || banner.title || 'Untitled Banner');
    setEditDescription(banner.description || '');
    setEditActive(banner.active !== false);
    setShowEditModal(true);
  };

  const handleUpdateBanner = async () => {
    if (!editingBanner) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      // If there's a new file, send as multipart/form-data (PATCH)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('name', editTitle);
        formData.append('description', editDescription);
        formData.append('active', editActive);
        formData.append('img', selectedFile);

        await api.patch(`/api/zeggo/banners/${editingBanner.id || editingBanner._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Send only the fields that changed (partial update with PATCH)
        const updateData = {};
        if (editTitle !== (editingBanner.name || editingBanner.title)) {
          updateData.name = editTitle;
        }
        if (editDescription !== (editingBanner.description || '')) {
          updateData.description = editDescription;
        }
        if (editActive !== (editingBanner.active !== false)) {
          updateData.active = editActive;
        }

        await api.patch(`/api/zeggo/banners/${editingBanner.id || editingBanner._id}`, updateData);
      }
      
      console.log('PATCH Response:', response.data); // Debug log
      
      // Extract banner ID from response
      const bannerId = response.data?.data?.id || response.data?.id;
      if (!bannerId) {
        throw new Error('Banner ID not found in response');
      }
      
      showSuccess(response.data?.message || 'Banner updated successfully!');
      setShowEditModal(false);
      setEditingBanner(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchBanners(); // Refresh banner list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating banner:', err);
      setError(err.response?.data?.message || 'Failed to update banner');
    } finally {
      setUploading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingBanner(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  return (
    <>
      <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Banner Management</h1>
        <p className="text-gray-300">Manage promotional banners for your website.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500 text-white px-4 py-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upload New Banner</h2>
        
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Banner Name
            </label>
            <input
              type="text"
              value={bannerName}
              onChange={(e) => setBannerName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter banner name (e.g., Home Top Banner)"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={bannerDescription}
              onChange={(e) => setBannerDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter banner description"
            />
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*,image/heic,image/heif,.heic,.heif"
              onChange={handleFileSelect}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="cursor-pointer inline-flex items-center justify-center"
            >
              <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-gray-400 text-2xl">+</span>
                )}
              </div>
            </label>
            
            {selectedFile && (
              <div className="mt-4">
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            
            <p className="text-gray-400 text-sm mb-4 mt-4">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Accepted formats: All image types supported • No size limit
            </p>
            
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                uploading || !selectedFile
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Uploading...
                </span>
              ) : (
                'Upload Banner'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Existing Banners</h2>
        
        {loading ? (
          <LoadingAnimation />
        ) : banners.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No banners found. Upload your first banner above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => {
              console.log('Banner Data:', banner); // Debug each banner
              return (
                <div key={banner.id || banner._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
                  <div className="relative">
                    {/* Display image with proper URL handling */}
                    <img
                      src={banner.fullImageUrl || (banner.img ? `https://zegapi.zeggo.in${banner.img}` : '') || banner.imageUrl || banner.image || banner.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={banner.name || banner.title || 'Banner'}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        console.error('❌ Image failed to load for banner:', banner.name);
                        console.error('Image src attempted:', banner.fullImageUrl || banner.img);
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', banner.name);
                      }}
                    />
                    
                    {/* Edit & Delete Buttons */}
                    <button
                      onClick={() => handleEditClick(banner)}
                      className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all"
                      title="Edit banner"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id || banner.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                      title="Delete banner"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">
                    {banner.name || banner.title || 'Untitled Banner'}
                  </h3>
                  {(banner.description || banner.message) && (
                    <p className="text-gray-400 text-sm mb-2">
                      {banner.description || banner.message}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(banner.updatedAt || banner.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      banner.active !== false 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {banner.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Edit Sidebar - Slides from left */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"
            onClick={closeEditModal}
          ></div>
          
          {/* Sidebar panel - slides from left */}
          <div 
            className={`absolute top-0 left-0 h-full w-96 bg-[#464859] shadow-xl transform transition-transform duration-300 ease-in-out pointer-events-auto ${
              showEditModal ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 bg-[#464859] flex justify-between items-center border-b border-gray-600">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Edit Banner
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-white hover:text-gray-300 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-5 flex-grow overflow-y-auto scrollbar-hide">
                {/* Banner Preview */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Banner Image
                  </label>
                  <div className="relative group">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all overflow-hidden">
                        {(() => {
                          const currentImageUrl = previewUrl || editingBanner?.fullImageUrl || (editingBanner?.img ? `https://zegapi.zeggo.in/${editingBanner.img.replace(/^\//, '')}` : null) || editingBanner?.imageUrl || editingBanner?.image;
                          
                          if (currentImageUrl) {
                            return (
                              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                                <img 
                                  src={currentImageUrl} 
                                  alt={previewUrl ? "New Preview" : "Current Banner"} 
                                  className="w-full h-48 object-contain rounded-lg mb-3 shadow-lg"
                                  onError={(e) => {
                                    console.error('Failed to load banner:', currentImageUrl);
                                    e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                                  }}
                                />
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                                  <span className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    📷 Click to change image
                                  </span>
                                </div>
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
                          onChange={handleFileSelect}
                          accept="image/*,image/heic,image/heif,.heic,.heif"
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    💡 Supports all image types and sizes • Camera photos accepted
                  </p>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                    placeholder="Enter banner title"
                  />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="3"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                    placeholder="Enter banner description"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between py-2 mb-4">
                  <div>
                    <h3 className="font-medium text-white">Active</h3>
                    <p className="text-gray-400 text-sm">Show this banner on the website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-[#464859] flex justify-end space-x-3 border-t border-gray-600">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateBanner}
                  disabled={uploading}
                  className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Updating...
                    </span>
                  ) : (
                    'Update Banner'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Banner;