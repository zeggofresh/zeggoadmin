import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import SubcategoryEdit from './SubcategoryEdit';
import Toast from '../Toast';

const Subcategory = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  
  // API state
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // For dropdown
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch subcategories and categories on component mount
  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId = null) => {
    try {
      setLoading(true);
      let url = '/api/zeggo/subcategories';
      if (categoryId) {
        url = `/api/zeggo/subcategories/category/${categoryId}`;
      }
      
      const response = await api.get(url);
      console.log('GET Subcategories Response:', response.data);
      
      // Handle different API response structures
      let subcategoriesData = [];
      if (response.data?.data) {
        subcategoriesData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        subcategoriesData = response.data;
      }
      
      console.log('Parsed Subcategories:', subcategoriesData);
      setSubcategories(subcategoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError(err.response?.data?.message || 'Failed to load subcategories');
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/zeggo/categories');
      console.log('GET Categories for Dropdown:', response.data);
      
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

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      fetchSubcategories();
    }
  };

  const handleDeleteClick = (subcategoryId) => {
    setItemToDelete(subcategoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const subcategoryId = itemToDelete;
      console.log('Deleting subcategory with ID:', subcategoryId);
      
      await api.delete(`/api/zeggo/subcategories/${subcategoryId}`);
      
      // Refresh the subcategories list after successful deletion
      if (selectedCategoryId) {
        fetchSubcategories(selectedCategoryId);
      } else {
        fetchSubcategories();
      }
      
      // Show success message
      setToast({ message: 'Subcategory deleted successfully', type: 'success' });
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete subcategory';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      // Reset state after deletion
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEditClick = (subcategory) => {
    setCurrentSubcategory(subcategory);
    setIsEditSidebarOpen(true);
    setIsAddingSubcategory(false);
  };

  const handleSaveSubcategory = (updatedSubcategory) => {
    // Refresh subcategories list after save (API call happens in edit component)
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    } else {
      fetchSubcategories();
    }
    // Close the sidebar after saving
    setIsEditSidebarOpen(false);
    setCurrentSubcategory(null);
    setIsAddingSubcategory(false);
  };

  const handleCancelEdit = () => {
    setIsEditSidebarOpen(false);
    setCurrentSubcategory(null);
    setIsAddingSubcategory(false);
  };

  const handleAddSubcategory = () => {
    setCurrentSubcategory(null);
    setIsEditSidebarOpen(true);
    setIsAddingSubcategory(true);
  };

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
      
      <div className="p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Subcategory Management</h1>
              <p className="text-gray-300">Manage subcategories here. Organize products under categories.</p>
            </div>
            <button 
              onClick={handleAddSubcategory}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Add Subcategory
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full md:w-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id || category._id} value={category.id || category._id}>
                  {category.name || 'Untitled'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Loading subcategories...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-400">
                {error}
              </div>
            ) : subcategories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No subcategories found. Add your first subcategory above.
              </div>
            ) : (
              subcategories.map((subcategory) => {
                console.log('Subcategory Data:', subcategory); // Debug log
                
                // Construct full image URL from API
                let imageUrl = null;
                
                // Try different possible field names
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
                
                console.log('Image URL for this subcategory:', imageUrl);
                
                return (
                  <div key={subcategory.id || subcategory._id} className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                    {/* Subcategory Image */}
                    <div className="mb-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={subcategory.name || 'Subcategory'}
                          className="w-16 h-16 object-cover rounded-xl"
                          onError={(e) => {
                            console.error('Failed to load image:', imageUrl);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-white">{subcategory.name || 'Untitled'}</h3>
                    <p className="text-gray-300 text-sm">{subcategory.des || subcategory.description || 'No description'}</p>
                    {subcategory.categoryName && (
                      <p className="text-gray-400 text-xs mt-1">Category: {subcategory.categoryName}</p>
                    )}
                    
                    <div className="mt-2 flex justify-between items-center">
                      <button 
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => handleEditClick(subcategory)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteClick(subcategory.id || subcategory._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
      
      <SubcategoryEdit
        subcategory={currentSubcategory}
        categories={categories}
        isOpen={isEditSidebarOpen}
        onSave={handleSaveSubcategory}
        onCancel={handleCancelEdit}
        isAddingSubcategory={isAddingSubcategory}
      />
    </>
  );
};

export default Subcategory;
