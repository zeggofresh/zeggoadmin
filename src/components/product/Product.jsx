import React, { useState } from 'react';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import ProductEdit from './ProductEdit';

const Product = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsEditSidebarOpen(true);
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (updatedProduct) => {
    // Perform the actual save operation here
    console.log('Saving product:', updatedProduct);
    // Close the sidebar after saving
    setIsEditSidebarOpen(false);
    setCurrentProduct(null);
    setIsAddingProduct(false);
  };

  const handleCancelEdit = () => {
    setIsEditSidebarOpen(false);
    setCurrentProduct(null);
    setIsAddingProduct(false);
  };

  const handleAddProduct = () => {
    // Open the edit sidebar for adding a new product
    setCurrentProduct(null); // No existing product data for a new product
    setIsEditSidebarOpen(true);
    setIsAddingProduct(true);
  };

  // Sample product data - in a real app this would come from an API
  const products = [
    { name: 'Product Name', description: 'Product description goes here...', price: '$29.99', category: 'Electronics' },
    { name: 'Another Product', description: 'Product description goes here...', price: '$49.99', category: 'Clothing' }
  ];

  return (
    <>
      <div className="p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-gray-300">Manage your products here. You can add, edit, or remove products from the system.</p>
            </div>
            <button 
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Add Product
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                <h3 className="font-semibold text-white">{product.name}</h3>
                <p className="text-gray-300 text-sm">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-white">{product.price}</span>
                  <div>
                    <button 
                      className="text-blue-400 hover:text-blue-300 mr-2"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteClick(product.name)}
                    >
                      Delete
                    </button>
                  </div>
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
      
      <ProductEdit
        product={currentProduct}
        isOpen={isEditSidebarOpen}
        onSave={handleSaveProduct}
        onCancel={handleCancelEdit}
        isAddingProduct={isAddingProduct}
      />
    </>
  );
};

export default Product;