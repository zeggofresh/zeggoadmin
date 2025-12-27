import React, { useState } from 'react';
import TrendingCategoryEdit from './TrendingCategoryEdit';

const TrendingCategory = () => {
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isAddingTrendingCategory, setIsAddingTrendingCategory] = useState(false);

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setIsEditSidebarOpen(true);
    setIsAddingTrendingCategory(false);
  };

  const handleSaveCategory = (updatedCategory) => {
    // Perform the actual save operation here
    console.log('Saving trending category:', updatedCategory);
    // Close the sidebar after saving
    setIsEditSidebarOpen(false);
    setCurrentCategory(null);
    setIsAddingTrendingCategory(false);
  };

  const handleCancelEdit = () => {
    setIsEditSidebarOpen(false);
    setCurrentCategory(null);
    setIsAddingTrendingCategory(false);
  };

  const handleAddTrendingCategory = () => {
    // Open the edit sidebar for adding a new trending category
    setCurrentCategory(null); // No existing category data for a new category
    setIsEditSidebarOpen(true);
    setIsAddingTrendingCategory(true);
  };

  // Sample trending category data - in a real app this would come from an API
  const trendingCategories = [
    { name: 'Electronics', rank: '1', description: '1,248 products', rating: '4.8', image: 'electronics.jpg' },
    { name: 'Clothing', rank: '2', description: '987 products', rating: '4.6', image: 'clothing.jpg' },
    { name: 'Books', rank: '3', description: '756 products', rating: '4.7', image: 'books.jpg' }
  ];

  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Trending Categories</h1>
            <p className="text-gray-300">Manage trending categories here. Highlight popular categories to your users.</p>
          </div>
          <button 
            onClick={handleAddTrendingCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Add Trending Category
          </button>
        </div>
        
        <div className="space-y-4">
          {trendingCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-[#3a3a4b]">
              <div className="flex items-center">
                <div className="bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 mr-4" />
                <div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="text-gray-300 text-sm">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-yellow-400">⭐ {category.rating}</span>
                <button 
                  className="text-blue-400 hover:text-blue-300 mr-2"
                  onClick={() => handleEditClick(category)}
                >
                  Edit
                </button>
                <button className="text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <TrendingCategoryEdit
        category={currentCategory}
        isOpen={isEditSidebarOpen}
        onSave={handleSaveCategory}
        onCancel={handleCancelEdit}
        isAddingTrendingCategory={isAddingTrendingCategory}
      />
    </div>
  );
};

export default TrendingCategory;