import React, { useState } from 'react';
import Pagination from '../payment/Pagination';

const PaymentHistory = () => {
  // Sample payment data - in a real app this would come from an API
  const [payments] = useState([
    { id: 'TXN-001', recipient: 'Raj Kumar', type: 'Delivery Boy', amount: '₹124.99', date: '2023-06-15', status: 'Completed' },
    { id: 'TXN-002', recipient: 'Fresh Farms Ltd.', type: 'Supplier', amount: '₹89.50', date: '2023-06-15', status: 'Completed' },
    { id: 'TXN-003', recipient: 'Amit Sharma', type: 'Delivery Boy', amount: '₹156.75', date: '2023-06-14', status: 'Completed' },
    { id: 'TXN-004', recipient: 'Organic Suppliers', type: 'Supplier', amount: '₹67.25', date: '2023-06-14', status: 'Pending' },
    { id: 'TXN-005', recipient: 'Vikash Singh', type: 'Delivery Boy', amount: '₹210.00', date: '2023-06-13', status: 'Completed' },
    { id: 'TXN-006', recipient: 'Dairy Products Co.', type: 'Supplier', amount: '₹95.40', date: '2023-06-13', status: 'Failed' },
    { id: 'TXN-007', recipient: 'Suresh Patel', type: 'Delivery Boy', amount: '₹178.30', date: '2023-06-12', status: 'Completed' },
    { id: 'TXN-008', recipient: 'Ramesh Gupta', type: 'Delivery Boy', amount: '₹56.90', date: '2023-06-12', status: 'Completed' },
    { id: 'TXN-009', recipient: 'Anil Kumar', type: 'Delivery Boy', amount: '₹145.60', date: '2023-06-11', status: 'Completed' },
    { id: 'TXN-010', recipient: 'Manoj Singh', type: 'Delivery Boy', amount: '₹189.25', date: '2023-06-11', status: 'Pending' },
    { id: 'TXN-011', recipient: 'Vegetable Distributors', type: 'Supplier', amount: '₹245.80', date: '2023-06-10', status: 'Completed' },
    { id: 'TXN-012', recipient: 'Fruit Suppliers Inc.', type: 'Supplier', amount: '₹178.90', date: '2023-06-10', status: 'Completed' },
    { id: 'TXN-013', recipient: 'Deepak Sharma', type: 'Delivery Boy', amount: '₹98.75', date: '2023-06-09', status: 'Failed' },
    { id: 'TXN-014', recipient: 'Sanjay Patel', type: 'Delivery Boy', amount: '₹210.40', date: '2023-06-09', status: 'Completed' },
    { id: 'TXN-015', recipient: 'Grain Merchants', type: 'Supplier', amount: '₹312.60', date: '2023-06-08', status: 'Completed' },
    { id: 'TXN-016', recipient: 'Vijay Gupta', type: 'Delivery Boy', amount: '₹87.30', date: '2023-06-08', status: 'Completed' },
    { id: 'TXN-017', recipient: 'Spice Traders', type: 'Supplier', amount: '₹156.90', date: '2023-06-07', status: 'Pending' },
    { id: 'TXN-018', recipient: 'Rajesh Kumar', type: 'Delivery Boy', amount: '₹198.75', date: '2023-06-07', status: 'Completed' },
    { id: 'TXN-019', recipient: 'Bakery Ingredients', type: 'Supplier', amount: '₹278.40', date: '2023-06-06', status: 'Completed' },
    { id: 'TXN-020', recipient: 'Mukesh Singh', type: 'Delivery Boy', amount: '₹67.80', date: '2023-06-06', status: 'Failed' }
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== 'All' && payment.status !== statusFilter) {
      return false;
    }
    if (typeFilter !== 'All' && payment.type !== typeFilter) {
      return false;
    }
    if (dateFilter && !payment.date.includes(dateFilter)) {
      return false;
    }
    return true;
  });

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredPayments.length / itemsPerPage);
  };

  const paginatedData = getPaginatedData();
  const totalPages = getTotalPages();

  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Payment History</h1>
        <p className="text-gray-300">View and manage all payment transactions.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when changing filter
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when changing filter
              }}
            >
              <option value="All">All Types</option>
              <option value="Delivery Boy">Delivery Boy</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when changing filter
              }}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
              onClick={() => {
                setStatusFilter('All');
                setTypeFilter('All');
                setDateFilter('');
                setCurrentPage(1); // Reset to first page when clearing filters
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-[#464859] rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
              <thead className="bg-[#464859]">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Transaction ID</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Recipient</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Type</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Amount</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Date</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {paginatedData.map((payment, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-white">{payment.id}</td>
                    <td className="py-3 px-4 text-white">{payment.recipient}</td>
                    <td className="py-3 px-4 text-white">{payment.type}</td>
                    <td className="py-3 px-4 text-white font-medium">{payment.amount}</td>
                    <td className="py-3 px-4 text-white">{payment.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Completed' 
                          ? 'bg-green-500 text-white' 
                          : payment.status === 'Pending' 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-red-500 text-white'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No payment records found matching the selected filters.
            </div>
          )}
        </div>
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default PaymentHistory;