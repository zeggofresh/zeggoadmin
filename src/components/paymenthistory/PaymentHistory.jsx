import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Pagination from '../payment/Pagination';
import LoadingAnimation from '../LoadingAnimation';
import useToast from '../../hooks/useToast';

const PaymentHistory = ({ theme }) => {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError, showInfo } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get('/api/zeggo/payment-history/all');

      let paymentsData = [];

      if (response.data?.data) {
        paymentsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        paymentsData = response.data;
      }

      setPayments(paymentsData);
      setError(null);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment history');
      setPayments([]);
      showError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // View details
  const handleViewDetails = (payment) => {
    showInfo(`Payment: ${payment.payment_order_id || payment.id} - ₹${payment.amount}`);
  };

  // ✅ FIXED FILTER
  const filteredPayments = payments.filter(payment => {

    if (statusFilter !== 'All' && payment.status !== statusFilter) {
      return false;
    }

    if (typeFilter !== 'All' && payment.type !== typeFilter) {
      return false;
    }

    if (dateFilter) {
      const paymentDate = payment.createdAt
        ? new Date(payment.createdAt).toISOString().split('T')[0]
        : '';

      if (paymentDate !== dateFilter) {
        return false;
      }
    }

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  return (
    <div>
      <div className="p-4 md:p-6">

        {/* Header */}
        <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Payment History</h1>
          <p className="text-sm md:text-base text-gray-300">
            View and manage all payment transactions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <select
              className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Types</option>
              <option value="Delivery Boy">Delivery Boy</option>
              <option value="Supplier">Supplier</option>
            </select>

            <input
              type="date"
              className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                setStatusFilter('All');
                setTypeFilter('All');
                setDateFilter('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Transactions</h2>

          <div className="overflow-x-auto">

            {loading ? (
              <LoadingAnimation />
            ) : error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : filteredPayments.length === 0 ? (
              <p className="text-center text-gray-400">No data found</p>
            ) : (
              <table className="min-w-full bg-[#3a3a4b]">
                <thead>
                  <tr className="bg-[#464859] text-gray-300">
                    <th className="p-3">ID</th>
                    <th>Recipient</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((p, i) => (
                    <tr key={i} className="border-t border-gray-600 text-white text-center">
                      <td>{p.payment_order_id || p.id}</td>
                      <td>{p.user_name || p.recipient}</td>
                      <td>{p.type}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>{p.status}</td>
                      <td>
                        <button
                          onClick={() => handleViewDetails(p)}
                          className="bg-blue-600 px-2 py-1 rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default PaymentHistory;