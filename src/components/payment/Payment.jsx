import React, { useState } from 'react';
import Pagination from './Pagination';

// Simple modal component
const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#464859] rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="mb-6">
          {children}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const [paymentType, setPaymentType] = useState('delivery-boy');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sample data for different payment types
  const [deliveryBoyData, setDeliveryBoyData] = useState([
    { id: 'DB-001', name: 'Raj Kumar', phone: '+91 98765 43210', totalOrders: 124, totalEarnings: '₹12,450', pendingPayment: '₹2,450', status: 'Active' },
    { id: 'DB-002', name: 'Amit Sharma', phone: '+91 98765 43211', totalOrders: 98, totalEarnings: '₹9,850', pendingPayment: '₹1,200', status: 'Active' },
    { id: 'DB-003', name: 'Vikash Singh', phone: '+91 98765 43212', totalOrders: 156, totalEarnings: '₹15,670', pendingPayment: '₹3,100', status: 'Active' },
    { id: 'DB-004', name: 'Suresh Patel', phone: '+91 98765 43213', totalOrders: 76, totalEarnings: '₹7,620', pendingPayment: '₹500', status: 'Inactive' },
    { id: 'DB-005', name: 'Ramesh Gupta', phone: '+91 98765 43214', totalOrders: 210, totalEarnings: '₹21,050', pendingPayment: '₹4,200', status: 'Active' },
    { id: 'DB-006', name: 'Anil Kumar', phone: '+91 98765 43215', totalOrders: 89, totalEarnings: '₹8,950', pendingPayment: '₹1,800', status: 'Active' },
    { id: 'DB-007', name: 'Manoj Singh', phone: '+91 98765 43216', totalOrders: 134, totalEarnings: '₹13,470', pendingPayment: '₹2,700', status: 'Active' },
    { id: 'DB-008', name: 'Deepak Sharma', phone: '+91 98765 43217', totalOrders: 65, totalEarnings: '₹6,520', pendingPayment: '₹300', status: 'Inactive' },
    { id: 'DB-009', name: 'Sanjay Patel', phone: '+91 98765 43218', totalOrders: 178, totalEarnings: '₹17,850', pendingPayment: '₹3,500', status: 'Active' },
    { id: 'DB-010', name: 'Vijay Gupta', phone: '+91 98765 43219', totalOrders: 92, totalEarnings: '₹9,250', pendingPayment: '₹1,200', status: 'Active' },
    { id: 'DB-011', name: 'Rajesh Kumar', phone: '+91 98765 43220', totalOrders: 145, totalEarnings: '₹14,570', pendingPayment: '₹2,900', status: 'Active' },
    { id: 'DB-012', name: 'Mukesh Singh', phone: '+91 98765 43221', totalOrders: 78, totalEarnings: '₹7,820', pendingPayment: '₹600', status: 'Inactive' }
  ]);
  
  const [supplierData, setSupplierData] = useState([
    { id: 'SP-001', name: 'Fresh Farms Ltd.', contact: 'John Manager', phone: '+91 98765 43215', totalSupplies: 42, totalAmount: '₹45,200', pendingPayment: '₹12,500', status: 'Active' },
    { id: 'SP-002', name: 'Organic Suppliers', contact: 'Sarah Owner', phone: '+91 98765 43216', totalSupplies: 28, totalAmount: '₹32,100', pendingPayment: '₹8,700', status: 'Active' },
    { id: 'SP-003', name: 'Dairy Products Co.', contact: 'Mike Director', phone: '+91 98765 43217', totalSupplies: 36, totalAmount: '₹38,900', pendingPayment: '₹5,200', status: 'Inactive' },
    { id: 'SP-004', name: 'Vegetable Distributors', contact: 'Peter Manager', phone: '+91 98765 43218', totalSupplies: 52, totalAmount: '₹52,400', pendingPayment: '₹15,300', status: 'Active' },
    { id: 'SP-005', name: 'Fruit Suppliers Inc.', contact: 'Lisa Owner', phone: '+91 98765 43219', totalSupplies: 31, totalAmount: '₹31,700', pendingPayment: '₹7,800', status: 'Active' },
    { id: 'SP-006', name: 'Grain Merchants', contact: 'David Director', phone: '+91 98765 43220', totalSupplies: 45, totalAmount: '₹45,900', pendingPayment: '₹11,200', status: 'Inactive' },
    { id: 'SP-007', name: 'Spice Traders', contact: 'Robert Manager', phone: '+91 98765 43221', totalSupplies: 27, totalAmount: '₹27,300', pendingPayment: '₹6,400', status: 'Active' },
    { id: 'SP-008', name: 'Bakery Ingredients', contact: 'Emma Owner', phone: '+91 98765 43222', totalSupplies: 39, totalAmount: '₹39,600', pendingPayment: '₹9,100', status: 'Active' },
    { id: 'SP-009', name: 'Meat Suppliers', contact: 'Thomas Director', phone: '+91 98765 43223', totalSupplies: 22, totalAmount: '₹22,800', pendingPayment: '₹4,700', status: 'Inactive' },
    { id: 'SP-010', name: 'Seafood Distributors', contact: 'Olivia Manager', phone: '+91 98765 43224', totalSupplies: 34, totalAmount: '₹34,200', pendingPayment: '₹8,300', status: 'Active' },
    { id: 'SP-011', name: 'Beverage Suppliers', contact: 'James Owner', phone: '+91 98765 43225', totalSupplies: 41, totalAmount: '₹41,500', pendingPayment: '₹10,600', status: 'Active' },
    { id: 'SP-012', name: 'Snack Providers', contact: 'Sophia Director', phone: '+91 98765 43226', totalSupplies: 29, totalAmount: '₹29,700', pendingPayment: '₹7,200', status: 'Inactive' }
  ]);

  // Calculate paginated data
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Handle pay now button click
  const handlePayNow = (recipient, amount, type) => {
    setSelectedPayment({ recipient, amount, type });
    setShowModal(true);
  };

  // Process payment
  const processPayment = () => {
    if (selectedPayment) {
      // Update the data based on payment type
      if (selectedPayment.type === 'Delivery Boy') {
        setDeliveryBoyData(prevData => 
          prevData.map(boy => 
            boy.name === selectedPayment.recipient 
              ? { ...boy, pendingPayment: '₹0' } 
              : boy
          )
        );
      } else if (selectedPayment.type === 'Supplier') {
        setSupplierData(prevData => 
          prevData.map(supplier => 
            supplier.name === selectedPayment.recipient 
              ? { ...supplier, pendingPayment: '₹0' } 
              : supplier
          )
        );
      }
      
      // Close modal
      setShowModal(false);
      setSelectedPayment(null);
      
      // Show success message (in a real app, you might want to use a toast notification)
      alert(`Payment of ${selectedPayment.amount} to ${selectedPayment.recipient} processed successfully!`);
    }
  };

  // Get current data based on payment type
  const currentData = paymentType === 'delivery-boy' ? deliveryBoyData : supplierData;
  const paginatedData = getPaginatedData(currentData);
  const totalPages = getTotalPages(currentData);

  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Payments</h1>
        <p className="text-gray-300">Manage all payment transactions.</p>
      </div>

      {/* Payment Type Selector */}
      <div className="bg-[#464859] rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-white">Payment Type:</label>
          <select 
            className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            value={paymentType}
            onChange={(e) => {
              setPaymentType(e.target.value);
              setCurrentPage(1); // Reset to first page when changing payment type
            }}
          >
            <option value="delivery-boy">Delivery Boy Payments</option>
            <option value="supplier">Supplier Payments</option>
          </select>
        </div>
      </div>

      {/* Content based on selected payment type */}
      {paymentType === 'delivery-boy' && (
        <div className="bg-[#464859] rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Delivery Boy Payments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
                <thead className="bg-[#464859]">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Phone</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Total Orders</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Total Earnings</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Pending Payment</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {paginatedData.map((boy, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-white">{boy.id}</td>
                      <td className="py-3 px-4 text-white">{boy.name}</td>
                      <td className="py-3 px-4 text-white">{boy.phone}</td>
                      <td className="py-3 px-4 text-white">{boy.totalOrders}</td>
                      <td className="py-3 px-4 text-white">{boy.totalEarnings}</td>
                      <td className="py-3 px-4 text-white font-medium">{boy.pendingPayment}</td>
                      <td className="py-3 px-4">
                        <button 
                          className={`px-3 py-1 rounded-md text-sm ${
                            boy.pendingPayment === '₹0' 
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          disabled={boy.pendingPayment === '₹0'}
                          onClick={() => handlePayNow(boy.name, boy.pendingPayment, 'Delivery Boy')}
                        >
                          {boy.pendingPayment === '₹0' ? 'Paid' : 'Pay Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {paymentType === 'supplier' && (
        <div className="bg-[#464859] rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Supplier Payments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#3a3a4b] rounded-lg overflow-hidden">
                <thead className="bg-[#464859]">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Company Name</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Contact Person</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Phone</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Total Supplies</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Total Amount</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Pending Payment</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {paginatedData.map((supplier, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-white">{supplier.id}</td>
                      <td className="py-3 px-4 text-white">{supplier.name}</td>
                      <td className="py-3 px-4 text-white">{supplier.contact}</td>
                      <td className="py-3 px-4 text-white">{supplier.phone}</td>
                      <td className="py-3 px-4 text-white">{supplier.totalSupplies}</td>
                      <td className="py-3 px-4 text-white">{supplier.totalAmount}</td>
                      <td className="py-3 px-4 text-white font-medium">{supplier.pendingPayment}</td>
                      <td className="py-3 px-4">
                        <button 
                          className={`px-3 py-1 rounded-md text-sm ${
                            supplier.pendingPayment === '₹0' 
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          disabled={supplier.pendingPayment === '₹0'}
                          onClick={() => handlePayNow(supplier.name, supplier.pendingPayment, 'Supplier')}
                        >
                          {supplier.pendingPayment === '₹0' ? 'Paid' : 'Pay Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Payment Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={processPayment}
        title="Confirm Payment"
      >
        {selectedPayment && (
          <div className="text-white">
            <p className="mb-2">Are you sure you want to process the payment?</p>
            <p className="mb-1"><strong>Recipient:</strong> {selectedPayment.recipient}</p>
            <p className="mb-1"><strong>Amount:</strong> {selectedPayment.amount}</p>
            <p className="mb-1"><strong>Type:</strong> {selectedPayment.type}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payment;