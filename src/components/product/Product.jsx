import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import ProductEdit from './ProductEdit';
import LoadingAnimation from '../LoadingAnimation';
import useToast from '../../hooks/useToast';

const Product = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const { showSuccess, showError } = useToast();
  
  // API state
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]); // For filter dropdown
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');

  // Fetch products and subcategories on component mount
  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/products');
      console.log('GET Products Response:', response.data); // Debug log
      
      // Handle different API response structures
      let productsData = [];
      if (response.data?.data) {
        productsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      console.log('Parsed Products:', productsData);
      setAllProducts(productsData); // Store all products
      setProducts(productsData); // Initially show all
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/api/zeggo/subcategories');
      console.log('GET Subcategories for Filter:', response.data);
      
      let subcategoriesData = [];
      if (response.data?.data) {
        subcategoriesData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        subcategoriesData = response.data;
      }
      
      setSubcategories(subcategoriesData);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleSubcategoryFilter = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    
    if (!subcategoryId) {
      // Show all products if no filter selected
      setProducts(allProducts);
    } else {
      // Filter products by subcategory_id
      const filtered = allProducts.filter(product => 
        product.subcategory_id === subcategoryId || product.subCategoryId === subcategoryId
      );
      setProducts(filtered);
    }
  };

  const handleDeleteClick = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const productId = itemToDelete;
      console.log('Deleting product with ID:', productId);
      
      await api.delete(`/api/zeggo/products/${productId}`);
      
      // Refresh the products list after successful deletion
      fetchProducts();
      
      // Show success message
      showSuccess('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      showError(errorMessage);
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

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsEditSidebarOpen(true);
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (updatedProduct) => {
    // Refresh products list after save (API call happens in ProductEdit component)
    fetchProducts();
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
          
          {/* Subcategory Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-1">
              Filter by Subcategory
            </label>
            <select
              value={selectedSubcategoryId}
              onChange={(e) => handleSubcategoryFilter(e.target.value)}
              className="w-full md:w-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id || subcategory._id} value={subcategory.id || subcategory._id}>
                  {subcategory.name || 'Untitled'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full">
                <LoadingAnimation />
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-400">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No products found. Add your first product above.
              </div>
            ) : (
              products.map((product) => {
                console.log('Product Data:', product); // Debug log
                console.log('Product Offer Price:', product.offer_price);
                console.log('Product Actual Price:', product.actual_price);
                                
                // Construct full image URL from API
                let imageUrl = null;
                                
                // Try different possible field names
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
                                
                console.log('Image URL for this product:', imageUrl);
                                
                return (
                  <div key={product.id || product._id} className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                    {/* Product Image */}
                    <div className="mb-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name || 'Product'}
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
                                  
                    <h3 className="font-semibold text-white">{product.name || 'Untitled'}</h3>
                    <p className="text-gray-300 text-sm">{product.product_details || product.des || product.description || 'No description'}</p>
                    {product.percent_off && (
                      <p className="text-green-400 text-xs mt-1">Off: {product.percent_off}</p>
                    )}
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-white">
                        {product.offer_price !== undefined && product.offer_price !== null && product.offer_price !== '' 
                          ? `₹${Number(product.offer_price).toFixed(2)}` 
                          : product.actual_price !== undefined && product.actual_price !== null && product.actual_price !== '' 
                            ? `₹${Number(product.actual_price).toFixed(2)}` 
                            : '₹0.00'}
                      </span>
                      <div>
                        <button 
                          className="text-blue-400 hover:text-blue-300 mr-2"
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteClick(product.id || product._id)}
                        >
                          Delete
                        </button>
                      </div>
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