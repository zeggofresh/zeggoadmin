import React, { useState } from 'react';
// Import useOutletContext to receive props from Layout
import { useOutletContext } from 'react-router-dom';

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

  const renderContent = () => {
    switch (effectiveActiveComponent) {
      case 'dashboard':
        return (
          <div className="p-6 h-full">
            <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Grocery App Dashboard</h1>
              <p className="text-gray-300">Welcome to your grocery admin dashboard! Monitor sales, revenue, and inventory.</p>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
                <p className="text-3xl font-bold">₹12,450</p>
                <p className="text-sm mt-1">↑ 12% from yesterday</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Daily Orders</h3>
                <p className="text-3xl font-bold">1,248</p>
                <p className="text-sm mt-1">↑ 8% from yesterday</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Products Sold</h3>
                <p className="text-3xl font-bold">5,672</p>
                <p className="text-sm mt-1">↑ 5% from yesterday</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
                <p className="text-3xl font-bold">142</p>
                <p className="text-sm mt-1">↓ 3% from yesterday</p>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Distribution - Circular Chart */}
              <div className="bg-[#464859] rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h3>
                <div className="flex flex-col items-center">
                  <CircularProgress percentage={75} size={150} strokeWidth={12} color="#4ade80" />
                  <div className="mt-4 text-center">
                    <p className="text-white font-semibold">75% Target Achieved</p>
                    <p className="text-gray-400 text-sm">Monthly target: ₹50,000</p>
                  </div>
                </div>
              </div>
              
              {/* Sales by Category - Multi-segment Circular Chart */}
              <div className="bg-[#464859] rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sales by Category</h3>
                <div className="flex justify-center">
                  <MultiSegmentCircularProgress 
                    segments={[
                      { percentage: 35, color: '#4ade80' }, // Green for Produce
                      { percentage: 25, color: '#60a5fa' }, // Blue for Dairy
                      { percentage: 20, color: '#a78bfa' }, // Purple for Bakery
                      { percentage: 15, color: '#f87171' }, // Red for Meat
                      { percentage: 5, color: '#fbbf24' }   // Yellow for Other
                    ]}
                    size={150}
                    strokeWidth={12}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { name: 'Produce', value: 35, color: 'bg-green-500' },
                    { name: 'Dairy', value: 25, color: 'bg-blue-500' },
                    { name: 'Bakery', value: 20, color: 'bg-purple-500' },
                    { name: 'Meat', value: 15, color: 'bg-red-500' },
                    { name: 'Other', value: 5, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                      <span className="text-gray-300 text-sm">{item.name}</span>
                      <span className="text-white text-sm ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-[#464859] rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
                  <thead className="bg-[#464859]">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Order ID</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Customer</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Items</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Amount</th>
                      <th className="py-3 px-4 text-left text-gray-300 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    <tr>
                      <td className="py-3 px-4 text-white">#ORD-7841</td>
                      <td className="py-3 px-4 text-white">John Smith</td>
                      <td className="py-3 px-4 text-white">12 items</td>
                      <td className="py-3 px-4 text-white">₹124.99</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Delivered</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">#ORD-7840</td>
                      <td className="py-3 px-4 text-white">Sarah Johnson</td>
                      <td className="py-3 px-4 text-white">8 items</td>
                      <td className="py-3 px-4 text-white">₹89.50</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs">Processing</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">#ORD-7839</td>
                      <td className="py-3 px-4 text-white">Mike Williams</td>
                      <td className="py-3 px-4 text-white">15 items</td>
                      <td className="py-3 px-4 text-white">₹156.75</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">Shipped</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">User Management</h1>
              <p className="text-gray-600 mb-4">Manage your users here. You can add, edit, or remove users from the system.</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Name</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Email</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Role</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4">John Doe</td>
                      <td className="py-3 px-4">john@example.com</td>
                      <td className="py-3 px-4">Admin</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Jane Smith</td>
                      <td className="py-3 px-4">jane@example.com</td>
                      <td className="py-3 px-4">Editor</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h1>
              <p className="text-gray-600 mb-4">Manage your products here. You can add, edit, or remove products from the system.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                  <h3 className="font-semibold text-gray-800">Product Name</h3>
                  <p className="text-gray-600 text-sm">Product description goes here...</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-800">$29.99</span>
                    <div>
                      <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                  <h3 className="font-semibold text-gray-800">Another Product</h3>
                  <p className="text-gray-600 text-sm">Product description goes here...</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-800">$49.99</span>
                    <div>
                      <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Management</h1>
              <p className="text-gray-600 mb-4">Manage categories here. Organize your products into different categories.</p>
              
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'].map((category, index) => (
                  <div key={index} className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                    <span className="mr-2">{category}</span>
                    <button className="text-red-500 hover:text-red-700">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'trendingcategory':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Trending Categories</h1>
              <p className="text-gray-600 mb-4">Manage trending categories here. Highlight popular categories to your users.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-4" />
                    <div>
                      <h3 className="font-semibold">Electronics</h3>
                      <p className="text-gray-600 text-sm">1,248 products</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-yellow-500">⭐ 4.8</span>
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
              <p className="text-gray-600 mb-4">Manage notifications here. Send alerts and updates to your users.</p>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <h3 className="font-semibold">System Update</h3>
                  <p className="text-gray-600 text-sm">Scheduled maintenance on Sunday at 2 AM</p>
                  <div className="mt-2 text-xs text-gray-500">2 hours ago</div>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                  <h3 className="font-semibold">New User Registration</h3>
                  <p className="text-gray-600 text-sm">John Doe registered for an account</p>
                  <div className="mt-2 text-xs text-gray-500">5 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Banners</h1>
              <p className="text-gray-600 mb-4">Manage banners here. Create promotional banners for your website.</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Upload Banner</h3>
                <p className="text-gray-600 text-sm mb-4">Click to upload or drag and drop</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Select File
                </button>
              </div>
            </div>
          </div>
        );
      case 'appsetting':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">App Settings</h1>
              <p className="text-gray-600 mb-4">Configure app settings here. Manage general application preferences.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-gray-600 text-sm">Enable dark theme for the application</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-gray-600 text-sm">Receive email notifications for important events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tabbar':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Tab Bar Settings</h1>
              <p className="text-gray-600 mb-4">Configure tab bar here. Customize navigation tabs for mobile users.</p>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex justify-around">
                  {['Home', 'Search', 'Profile', 'Settings'].map((tab, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mb-1" />
                      <span className="text-xs">{tab}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span>Home</span>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <button className="text-blue-600 hover:text-blue-900 ml-2">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'setting':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600 mb-4">General settings here. Configure your application preferences.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Account Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Admin User" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="admin@example.com" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Security</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
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
    <div className="bg-gray-100 min-h-screen">
      {renderContent()}
    </div>
  );
};

export default Dashboard;