import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  // Fetch initial data for reports
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/api/zeggo/users'),
        api.get('/api/zeggo/products'),
        api.get('/api/zeggo/orders')
      ]);

      const usersData = usersRes.data?.data || usersRes.data || [];
      const productsData = productsRes.data?.data || productsRes.data || [];
      const ordersData = ordersRes.data?.data || ordersRes.data || [];

      const totalSales = ordersData.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount || order.amount) || 0);
      }, 0);

      setStats({
        totalSales,
        totalOrders: ordersData.length,
        totalUsers: usersData.length,
        totalProducts: productsData.length
      });

      setReportData({
        users: usersData,
        products: productsData,
        orders: ordersData
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export to Excel');
    }
  };

  // Generate Sales Report
  const generateSalesReport = () => {
    if (!reportData) return;

    const salesData = reportData.orders.map(order => ({
      'Order ID': order._id || order.id,
      'Customer Name': order.customer_name || order.userName || 'N/A',
      'Customer Email': order.email || 'N/A',
      'Phone': order.phone || order.userPhone || 'N/A',
      'Total Amount': `₹${order.total_amount || order.amount}`,
      'Status': order.status,
      'Payment Method': order.payment_method || 'COD',
      'Date': new Date(order.createdAt).toLocaleDateString()
    }));

    exportToExcel(salesData, `Sales_Report_${new Date().toISOString().split('T')[0]}`, 'Sales');
  };

  // Generate User Report
  const generateUserReport = () => {
    if (!reportData) return;

    const userData = reportData.users.map(user => ({
      'User ID': user._id || user.id,
      'Name': user.name,
      'Email': user.email,
      'Phone': user.phone,
      'Address': user.address ? `${user.address.street}, ${user.address.city}, ${user.address.state}` : 'N/A',
      'Registered Date': new Date(user.createdAt).toLocaleDateString()
    }));

    exportToExcel(userData, `Users_Report_${new Date().toISOString().split('T')[0]}`, 'Users');
  };

  // Generate Product Report
  const generateProductReport = () => {
    if (!reportData) return;

    const productData = reportData.products.map(product => ({
      'Product ID': product._id || product.id,
      'Name': product.name,
      'Description': product.description,
      'Category': product.category,
      'Actual Price': `₹${product.actual_price}`,
      'Offer Price': `₹${product.offer_price}`,
      'Stock Status': product.stock > 0 ? 'In Stock' : 'Out of Stock',
      'Created Date': new Date(product.createdAt).toLocaleDateString()
    }));

    exportToExcel(productData, `Products_Report_${new Date().toISOString().split('T')[0]}`, 'Products');
  };

  // Generate Order Report
  const generateOrderReport = () => {
    if (!reportData) return;

    const orderData = reportData.orders.map(order => ({
      'Order ID': order._id || order.id,
      'Customer': order.customer_name || order.userName,
      'Email': order.email,
      'Phone': order.phone || order.userPhone,
      'Amount': `₹${order.total_amount || order.amount}`,
      'Status': order.status,
      'Delivery Address': order.deliveryAddress ? 
        `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}` : 'N/A',
      'Order Date': new Date(order.createdAt).toLocaleDateString()
    }));

    exportToExcel(orderData, `Orders_Report_${new Date().toISOString().split('T')[0]}`, 'Orders');
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-white mb-2">Reports & Export</h1>
        <p className="text-gray-300">Generate and export business reports in Excel format</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-base font-semibold mb-2">Total Sales</h3>
          <p className="text-2xl font-bold">₹{stats.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs mt-1">All time revenue</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-base font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-xs mt-1">All orders</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-base font-semibold mb-2">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-xs mt-1">Registered users</p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-base font-semibold mb-2">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
          <p className="text-xs mt-1">Active products</p>
        </div>
      </div>

      {/* Report Generation Section */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6 print:hidden">
        <h2 className="text-xl font-bold text-white mb-4">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sales Report */}
          <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Sales Report</h3>
                <p className="text-gray-400 text-xs">Export all sales data</p>
              </div>
            </div>
            <button
              onClick={generateSalesReport}
              disabled={!reportData}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Sales (Excel)
            </button>
          </div>

          {/* User Report */}
          <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">User Report</h3>
                <p className="text-gray-400 text-xs">Export all users data</p>
              </div>
            </div>
            <button
              onClick={generateUserReport}
              disabled={!reportData}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Users (Excel)
            </button>
          </div>

          {/* Product Report */}
          <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Product Report</h3>
                <p className="text-gray-400 text-xs">Export all products data</p>
              </div>
            </div>
            <button
              onClick={generateProductReport}
              disabled={!reportData}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Products (Excel)
            </button>
          </div>

          {/* Order Report */}
          <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Order Report</h3>
                <p className="text-gray-400 text-xs">Export all orders data</p>
              </div>
            </div>
            <button
              onClick={generateOrderReport}
              disabled={!reportData}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Orders (Excel)
            </button>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      {loading && (
        <div className="bg-[#464859] rounded-lg shadow-md p-6 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-2">Loading report data...</p>
        </div>
      )}

      {!loading && reportData && (
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Data Summary</h2>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-2 print:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-2">Recent Orders</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reportData.orders.slice(0, 5).map((order, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Order #{order._id?.slice(-6) || order.id?.slice(-6)}</span>
                    <span className="text-white font-medium">₹{order.total_amount || order.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#3a3a4b] rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-semibold mb-2">Top Users</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reportData.users.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{user.name}</span>
                    <span className="text-gray-400 text-xs">{user.email}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
