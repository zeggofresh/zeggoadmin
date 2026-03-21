import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import CategoryEdit from './CategoryEdit';
import Toast from '../Toast';

const Category = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [toast, setToast] = useState(null);
  
  // API state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/categories');
      console.log('GET Categories Response:', response.data); // Debug log
      
      // Handle different API response structures
      let categoriesData = [];
      if (response.data?.data) {
        categoriesData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      }
      
      console.log('Parsed Categories:', categoriesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (categoryId) => {
    setItemToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const categoryId = itemToDelete;
      console.log('Deleting category with ID:', categoryId);
      
      await api.delete(`/api/zeggo/categories/${categoryId}`);
      
      // Refresh the categories list after successful deletion
      fetchCategories();
      
      // Show success message
      setToast({ message: 'Category deleted successfully', type: 'success' });
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete category';
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

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setIsEditSidebarOpen(true);
    setIsAddingCategory(false);
  };

  const handleSaveCategory = (updatedCategory) => {
    // Refresh categories list after save (API call happens in CategoryEdit component)
    fetchCategories();
    // Close the sidebar after saving
    setIsEditSidebarOpen(false);
    setCurrentCategory(null);
    setIsAddingCategory(false);
  };

  const handleCancelEdit = () => {
    setIsEditSidebarOpen(false);
    setCurrentCategory(null);
    setIsAddingCategory(false);
  };

  const handleAddCategory = () => {
    // Open the edit sidebar for adding a new category
    setCurrentCategory(null); // No existing category data for a new category
    setIsEditSidebarOpen(true);
    setIsAddingCategory(true);
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
              <h1 className="text-2xl font-bold text-white mb-2">Category Management</h1>
              <p className="text-gray-300">Manage categories here. Organize your products into different categories.</p>
            </div>
            <button 
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Add Category
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Loading categories...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-400">
                {error}
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No categories found. Add your first category above.
              </div>
            ) : (
              categories.map((category) => {
                console.log('Category Data:', category); // Debug log
                              
                // Construct full image URL from API
                let imageUrl = null;
                              
                // Try different possible field names
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
                              
                console.log('Image URL for this category:', imageUrl);
                              
                return (
                  <div key={category.id || category._id} className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                    {/* Category Image */}
                    <div className="mb-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={category.name || 'Category'}
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
                                  
                    <h3 className="font-semibold text-white">{category.name || 'Untitled'}</h3>
                    <p className="text-gray-300 text-sm">{category.des || category.description || 'No description'}</p>
                                  
                    <div className="mt-2 flex justify-between items-center">
                      <button 
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteClick(category.id || category._id)}
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
      
      <CategoryEdit
        category={currentCategory}
        isOpen={isEditSidebarOpen}
        onSave={handleSaveCategory}
        onCancel={handleCancelEdit}
        isAddingCategory={isAddingCategory}
      />
    </>
  );
};

export default Category;