import React, { useState, useEffect } from 'react';
// Import useOutletContext to receive props from Layout
import { useOutletContext } from 'react-router-dom';
import api from '../../config/api';
import LoadingAnimation from '../LoadingAnimation';

// Multi-segment circular progress component
const MultiSegmentCircularProgress = ({ segments, size = 150, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  let cumulativePercentage = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Segment circles */}
        {segments.map((segment, index) => {
          const segmentPercentage = segment.percentage;
          const offset = circumference - ((cumulativePercentage + segmentPercentage) / 100) * circumference;
          const dashArray = (segmentPercentage / 100) * circumference;
          
          const result = (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          );
          
          cumulativePercentage += segmentPercentage;
          return result;
        })}
      </svg>
      
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-semibold">Sales</p>
          <p className="text-gray-400 text-xs">by Category</p>
        </div>
      </div>
    </div>
  );
};

// Simple circular progress component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = '#4ade80' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Get activeComponent and setActiveComponent from Layout context
  const [activeComponent, setActiveComponent] = useOutletContext();
  
  // Fallback in case context is not provided
  const [localActiveComponent, setLocalActiveComponent] = useState('dashboard');
  
  // Use context value if available, otherwise use local state
  const effectiveActiveComponent = activeComponent || localActiveComponent;
  const effectiveSetActiveComponent = setActiveComponent || setLocalActiveComponent;

  // Dashboard statistics state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalCategories: 0,
    totalPayments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        api.get('/api/zeggo/users/getall'),
        api.get('/api/zeggo/products'),
        api.get('/api/zeggo/orders'),
        api.get('/api/zeggo/categories')
      ]);

      console.log('Products API Response:', productsRes.data);
      console.log('Orders API Response:', ordersRes.data);
      console.log('Products Response Structure:', {
        hasData: !!productsRes.data?.data,
        isArray: Array.isArray(productsRes.data),
        dataLength: productsRes.data?.data?.length,
        directLength: Array.isArray(productsRes.data) ? productsRes.data.length : 0
      });
      console.log('Orders Response Structure:', {
        hasData: !!ordersRes.data?.data,
        isArray: Array.isArray(ordersRes.data),
        dataLength: ordersRes.data?.data?.length,
        directLength: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0
      });

      // Process users data
      const usersData = usersRes.data?.data || usersRes.data || [];
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

      // Process products data - handle multiple response structures
      let productsData = [];
      if (productsRes.data?.data && Array.isArray(productsRes.data.data)) {
        productsData = productsRes.data.data;
      } else if (Array.isArray(productsRes.data)) {
        productsData = productsRes.data;
      } else if (productsRes.data?.products && Array.isArray(productsRes.data.products)) {
        productsData = productsRes.data.products;
      }
      
      console.log('Parsed Products Data:', productsData);
      console.log('Total Products Count:', productsData.length);
      
      const totalProducts = productsData.length;

      // Process orders data - handle multiple response structures
      let ordersData = [];
      if (ordersRes.data?.data && Array.isArray(ordersRes.data.data)) {
        ordersData = ordersRes.data.data;
      } else if (Array.isArray(ordersRes.data)) {
        ordersData = ordersRes.data;
      } else if (ordersRes.data?.orders && Array.isArray(ordersRes.data.orders)) {
        ordersData = ordersRes.data.orders;
      }
      
      console.log('Parsed Orders Data:', ordersData);
      console.log('Total Orders Count:', ordersData.length);
      
      const totalOrders = ordersData.length;
      
      // Calculate order statistics
      const pendingOrders = ordersData.filter(o => o.status?.toLowerCase() === 'pending').length;
      const deliveredOrders = ordersData.filter(o => o.status?.toLowerCase() === 'delivered').length;
      const cancelledOrders = ordersData.filter(o => o.status?.toLowerCase() === 'cancelled').length;
      
      // Calculate total revenue
      const totalRevenue = ordersData.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount || order.amount) || 0);
      }, 0);

      // Process categories data
      const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
      const totalCategories = Array.isArray(categoriesData) ? categoriesData.length : 0;

      // Get recent orders (last 5)
      const recentOrdersList = Array.isArray(ordersData) 
        ? ordersData.slice(-5).reverse() 
        : [];

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalCategories,
        totalPayments: totalOrders // Assuming all orders have payments
      });

      setRecentOrders(recentOrdersList);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (effectiveActiveComponent) {
      case 'dashboard':
        return (
          <div className="p-6 h-full">
            <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Zeggo Admin Dashboard</h1>
              <p className="text-gray-300">Welcome! Monitor your business performance and analytics.</p>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {loading ? (
                <div className="col-span-full">
                  <LoadingAnimation />
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
                    <h3 className="text-base font-semibold mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs mt-1">From all orders</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
                    <h3 className="text-base font-semibold mb-2">Total Orders</h3>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    <p className="text-xs mt-1">All time orders</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
                    <h3 className="text-base font-semibold mb-2">Total Products</h3>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    <p className="text-xs mt-1">Active products</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-md p-4 text-white">
                    <h3 className="text-base font-semibold mb-2">Total Users</h3>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs mt-1">Registered customers</p>
                  </div>
                </>
              )}
            </div>

            {/* Order Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#464859] rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-400 text-xs font-semibold mb-1">Pending Orders</h3>
                    <p className="text-xl font-bold text-white">{stats.pendingOrders}</p>
                  </div>
                  <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#464859] rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-400 text-xs font-semibold mb-1">Delivered Orders</h3>
                    <p className="text-xl font-bold text-white">{stats.deliveredOrders}</p>
                  </div>
                  <div className="bg-green-500 bg-opacity-20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#464859] rounded-lg shadow-md p-4 border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-400 text-xs font-semibold mb-1">Cancelled Orders</h3>
                    <p className="text-xl font-bold text-white">{stats.cancelledOrders}</p>
                  </div>
                  <div className="bg-red-500 bg-opacity-20 p-3 rounded-full">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Orders */}
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No recent orders found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
                    <thead className="bg-[#464859]">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Order ID</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Customer</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Amount</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Status</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {recentOrders.map((order) => {
                        const getStatusColor = (status) => {
                          switch(status?.toLowerCase()) {
                            case 'pending': return 'bg-yellow-500';
                            case 'confirmed': return 'bg-blue-500';
                            case 'processing': return 'bg-purple-500';
                            case 'shipped': return 'bg-indigo-500';
                            case 'delivered': return 'bg-green-500';
                            case 'cancelled': return 'bg-red-500';
                            default: return 'bg-gray-500';
                          }
                        };

                        const formatDate = (dateString) => {
                          if (!dateString) return 'N/A';
                          const date = new Date(dateString);
                          return date.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });
                        };

                        return (
                          <tr key={order.id}>
                            <td className="py-3 px-4 text-white text-xs font-mono">
                              {order.id?.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4 text-white">
                              {order.user?.name || order.customer_name || 'Guest'}
                            </td>
                            <td className="py-3 px-4 text-white font-semibold">
                              ₹{(parseFloat(order.total_amount || order.amount) || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 ${getStatusColor(order.status)} text-white rounded-full text-xs`}>
                                {order.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-300 mb-4">Manage your users here. You can add, edit, or remove users from the system.</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
                  <thead className="bg-[#464859]">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Name</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Email</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Role</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Status</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    <tr>
                      <td className="py-3 px-4 text-white">John Doe</td>
                      <td className="py-3 px-4 text-white">john@example.com</td>
                      <td className="py-3 px-4 text-white">Admin</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs">Active</span></td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">Jane Smith</td>
                      <td className="py-3 px-4 text-white">jane@example.com</td>
                      <td className="py-3 px-4 text-white">Editor</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs">Active</span></td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-gray-300 mb-4">Manage your products here. You can add, edit, or remove products from the system.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                  <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                  <h3 className="font-semibold text-white">Product Name</h3>
                  <p className="text-gray-300 text-sm">Product description goes here...</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-white">$29.99</span>
                    <div>
                      <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
                  <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                  <h3 className="font-semibold text-white">Another Product</h3>
                  <p className="text-gray-300 text-sm">Product description goes here...</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-white">$49.99</span>
                    <div>
                      <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'category':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Category Management</h1>
              <p className="text-gray-300 mb-4">Manage categories here. Organize your products into different categories.</p>
              
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'].map((category, index) => (
                  <div key={index} className="bg-[#3a3a4b] rounded-full px-4 py-2 flex items-center border border-gray-600">
                    <span className="mr-2 text-white">{category}</span>
                    <button className="text-red-400 hover:text-red-300">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'trendingcategory':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Trending Categories</h1>
              <p className="text-gray-300 mb-4">Manage trending categories here. Highlight popular categories to your users.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-[#3a3a4b]">
                  <div className="flex items-center">
                    <div className="bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 mr-4" />
                    <div>
                      <h3 className="font-semibold text-white">Electronics</h3>
                      <p className="text-gray-400 text-sm">1,248 products</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-yellow-400">⭐ 4.8</span>
                    <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-300 mb-4">Manage notifications here. Send alerts and updates to your users.</p>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-[#3a3a4b] rounded">
                  <h3 className="font-semibold text-white">System Update</h3>
                  <p className="text-gray-300 text-sm">Scheduled maintenance on Sunday at 2 AM</p>
                  <div className="mt-2 text-xs text-gray-400">2 hours ago</div>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-[#3a3a4b] rounded">
                  <h3 className="font-semibold text-white">New User Registration</h3>
                  <p className="text-gray-300 text-sm">John Doe registered for an account</p>
                  <div className="mt-2 text-xs text-gray-400">5 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Banners</h1>
              <p className="text-gray-300 mb-4">Manage banners here. Create promotional banners for your website.</p>
              
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-[#3a3a4b]">
                <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Upload Banner</h3>
                <p className="text-gray-400 text-sm mb-4">Click to upload or drag and drop</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                  Select File
                </button>
              </div>
            </div>
          </div>
        );
      case 'appsetting':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">App Settings</h1>
              <p className="text-gray-300 mb-4">Configure app settings here. Manage general application preferences.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-600">
                  <div>
                    <h3 className="font-medium text-white">Dark Mode</h3>
                    <p className="text-gray-400 text-sm">Enable dark theme for the application</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-600">
                  <div>
                    <h3 className="font-medium text-white">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive email notifications for important events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tabbar':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Tab Bar Settings</h1>
              <p className="text-gray-300 mb-4">Configure tab bar here. Customize navigation tabs for mobile users.</p>
              
              <div className="bg-[#3a3a4b] rounded-lg p-4 mb-4 border border-gray-600">
                <div className="flex justify-around">
                  {['Home', 'Search', 'Profile', 'Settings'].map((tab, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-gray-700 border-2 border-dashed rounded-xl w-6 h-6 mb-1" />
                      <span className="text-xs text-white">{tab}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#3a3a4b] rounded border border-gray-600">
                  <span className="text-white">Home</span>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <button className="text-blue-400 hover:text-blue-300 ml-2">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'setting':
        return (
          <div className="p-6">
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-300 mb-4">General settings here. Configure your application preferences.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-white">Account Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" defaultValue="Admin User" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" defaultValue="admin@example.com" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-white">Security</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome to your admin dashboard! Here you can manage all aspects of your application.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#464859] min-h-screen">
      {renderContent()}
    </div>
  );
};

export default Dashboard;