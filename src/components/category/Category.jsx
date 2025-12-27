import React, { useState } from 'react';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import CategoryEdit from './CategoryEdit';

const Category = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleDeleteClick = (itemName) => {
    setItemToDelete(itemName);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Perform the actual delete operation here
    console.log(`Deleting ${itemToDelete}`);
    // Reset state after deletion
    setShowDeleteModal(false);
    setItemToDelete(null);
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
    // Perform the actual save operation here
    console.log('Saving category:', updatedCategory);
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

  // Sample category data - in a real app this would come from an API
  const categories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets', image: 'electronics.jpg' },
    { name: 'Clothing', description: 'Apparel and fashion items', image: 'clothing.jpg' },
    { name: 'Books', description: 'Books and educational materials', image: 'books.jpg' },
    { name: 'Home & Kitchen', description: 'Home appliances and kitchenware', image: 'home.jpg' },
    { name: 'Sports', description: 'Sports equipment and accessories', image: 'sports.jpg' }
  ];

  return (
    <>
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
            {categories.map((category, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                <h3 className="font-semibold text-white">{category.name}</h3>
                <p className="text-gray-300 text-sm">{category.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <button 
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteClick(category.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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