import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingAnimation from '../LoadingAnimation';
import useToast from '../../hooks/useToast';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { showSuccess, showError } = useToast();
  
  // View order details state
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/orders');
      console.log('GET Orders Response:', response.data);
      
      // Handle different API response structures
      let ordersData = [];
      if (response.data?.data) {
        ordersData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      }
      
      console.log('Parsed Orders:', ordersData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      setOrderDetailsLoading(true);
      console.log('Fetching order details for:', orderId);
      
      const response = await api.get(`/api/zeggo/orders/${orderId}`);
      console.log('GET Order by ID Response:', response.data);
      
      const orderData = response.data?.data || response.data;
      setViewingOrder(orderData);
      setIsViewModalOpen(true);
      showSuccess('Order details loaded');
    } catch (err) {
      console.error('Error fetching order details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load order details';
      showError(errorMessage);
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      console.log('Deleting order with ID:', orderId);
      console.log('DELETE API Endpoint:', `/api/zeggo/orders/${orderId}`);
      
      const response = await api.delete(`/api/zeggo/orders/${orderId}`);
      console.log('Delete Response:', response.data);
      
      showSuccess('Order deleted successfully');
      
      // Remove the deleted order from the state immediately (optimistic update)
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Close modal if open
      if (isViewModalOpen) {
        setIsViewModalOpen(false);
        setViewingOrder(null);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete order';
      showError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setViewingOrder(null);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'processing': return 'bg-purple-500';
      case 'shipped': return 'bg-indigo-500';
      case 'out for delivery': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'returned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return `₹${numPrice.toFixed(2)}`;
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Order Management</h1>
              <p className="text-gray-300">View and manage all customer orders</p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by order ID, customer name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingAnimation />
            ) : error ? (
              <div className="text-center py-8 text-red-400">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No orders found
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No orders match your search
              </div>
            ) : (
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id || order.order_id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-xs text-gray-400 font-mono">
                          {order.id?.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-400">{order.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-white text-sm truncate">
                            {order.items?.map(item => item.product_name || item.name).join(', ') || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400">Qty: {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">
                          {formatPrice(order.total_amount || order.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order.id || order.order_id);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id || order.order_id);
                            }}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Summary Stats */}
          {!loading && orders.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-blue-400">
                  {orders.filter(o => ['processing', 'confirmed'].includes(o.status?.toLowerCase())).length}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-400">
                  {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {isViewModalOpen && viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-75" 
              onClick={handleCloseModal}
            />

            {/* Modal panel */}
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#464859] shadow-xl rounded-lg relative z-10">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
                <h3 className="text-2xl font-bold text-white">
                  Order Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              {orderDetailsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-2">Loading order details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Order ID</h4>
                      <p className="text-white font-mono text-sm">{viewingOrder.id || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Order Date</h4>
                      <p className="text-white">{formatDate(viewingOrder.createdAt)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Order Status</h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(viewingOrder.status)}`}>
                        {viewingOrder.status || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Payment Method</h4>
                      <p className="text-white">{viewingOrder.payment_method || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white">{viewingOrder.user?.name || viewingOrder.customer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{viewingOrder.user?.email || viewingOrder.customer_email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{viewingOrder.user?.phone || viewingOrder.customer_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {viewingOrder.delivery_address && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Delivery Address</h4>
                      <p className="text-white">{viewingOrder.delivery_address}</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Order Items</h4>
                    {viewingOrder.items && viewingOrder.items.length > 0 ? (
                      <div className="space-y-3">
                        {viewingOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-2 last:border-0">
                            <div>
                              <p className="text-white font-medium">{item.product_name || item.name || 'Product'}</p>
                              <p className="text-sm text-gray-400">Qty: {item.quantity || 1} × {formatPrice(item.price || item.unit_price)}</p>
                            </div>
                            <p className="text-white font-semibold">{formatPrice((item.price || item.unit_price) * (item.quantity || 1))}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No items found</p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">{formatPrice(viewingOrder.subtotal || viewingOrder.total_amount)}</span>
                    </div>
                    {viewingOrder.discount && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-green-400">-{formatPrice(viewingOrder.discount)}</span>
                      </div>
                    )}
                    {viewingOrder.delivery_charge && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Delivery Charge:</span>
                        <span className="text-white">{formatPrice(viewingOrder.delivery_charge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
                      <span className="text-lg font-bold text-white">Total Amount:</span>
                      <span className="text-xl font-bold text-green-400">{formatPrice(viewingOrder.total_amount || viewingOrder.amount)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(viewingOrder.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
