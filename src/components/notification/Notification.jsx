import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaBell, FaEnvelope, FaTrash, FaReply, FaSearch, FaFilter } from 'react-icons/fa';
import Pagination from '../payment/Pagination';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import useToast from '../../hooks/useToast';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('send'); // 'send' or 'history'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const { showSuccess, showError } = useToast();

  // Form state
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'general', // general, promotional, urgent, update
    sendEmail: true,
    sendPush: true,
    targetAudience: 'all' // all, specific_users, new_users
  });

  // State for notification history
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fetch notification history
  useEffect(() => {
    if (activeTab === 'history') {
      fetchNotificationHistory();
    }
  }, [activeTab]);

  const fetchNotificationHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/notifications/history');
      console.log('Notification History:', response.data);
      
      let historyData = [];
      if (response.data?.data) {
        historyData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        historyData = response.data;
      }
      
      setNotificationHistory(historyData);
    } catch (err) {
      console.error('Error fetching notification history:', err);
      showError('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!notificationData.title.trim() || !notificationData.message.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/zeggo/notifications/send', notificationData);
      
      showSuccess('Notification sent successfully!');
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'general',
        sendEmail: true,
        sendPush: true,
        targetAudience: 'all'
      });
      
      // Switch to history tab
      setActiveTab('history');
      fetchNotificationHistory();
    } catch (err) {
      console.error('Error sending notification:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send notification';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (notificationId) => {
    setItemToDelete(notificationId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/zeggo/notifications/${itemToDelete}`);
      showSuccess('Notification deleted successfully');
      fetchNotificationHistory();
    } catch (err) {
      console.error('Error deleting notification:', err);
      showError('Failed to delete notification');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Filter and search notifications
  const filteredNotifications = notificationHistory.filter(notification => {
    const matchesSearch = (notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNotifications.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredNotifications.length / itemsPerPage);
  };

  const paginatedNotifications = getPaginatedData();
  const totalPages = getTotalPages();

  const getTypeColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-800 text-red-200';
      case 'promotional': return 'bg-green-800 text-green-200';
      case 'update': return 'bg-blue-800 text-blue-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FaBell className="text-lg md:text-xl" /> Notifications & Messages
            </h1>
            <p className="text-sm md:text-base text-gray-300">Send notifications to users and manage contact form messages</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-600 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('send')}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === 'send'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Send Notification
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Notification History
            </button>
          </div>

          {/* Send Notification Tab */}
          {activeTab === 'send' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notification Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={notificationData.title}
                    onChange={handleInputChange}
                    placeholder="Enter notification title"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notification Type
                  </label>
                  <select
                    name="type"
                    value={notificationData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="promotional">Promotional</option>
                    <option value="urgent">Urgent</option>
                    <option value="update">Update</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notification Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={notificationData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your notification message"
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  value={notificationData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="specific_users">Specific Users</option>
                  <option value="new_users">New Users Only</option>
                </select>
              </div>

              {/* Delivery Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Delivery Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendPush"
                      checked={notificationData.sendPush}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Send Push Notification</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendEmail"
                      checked={notificationData.sendEmail}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Send Email</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Notification'}
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationData({
                    title: '',
                    message: '',
                    type: 'general',
                    sendEmail: true,
                    sendPush: true,
                    targetAudience: 'all'
                  })}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition"
                >
                  Clear Form
                </button>
              </div>
            </form>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="general">General</option>
                    <option value="promotional">Promotional</option>
                    <option value="urgent">Urgent</option>
                    <option value="update">Update</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No notifications found.
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full border-collapse text-sm text-gray-200 min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="px-4 py-3 text-left font-medium">Sr. No</th>
                        <th className="px-4 py-3 text-left font-medium">Title</th>
                        <th className="px-4 py-3 text-left font-medium">Message</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Sent Via</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedNotifications.map((notification, index) => (
                        <tr
                          key={notification.id || notification._id || index}
                          className="border-b border-white/10 hover:bg-white/5 transition"
                        >
                          <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-4 py-3 font-medium">{notification.title}</td>
                          <td className="px-4 py-3 max-w-xs truncate">{notification.message}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {notification.sendPush && (
                                <span className="text-xs bg-blue-800 text-blue-200 px-2 py-1 rounded">Push</span>
                              )}
                              {notification.sendEmail && (
                                <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded">Email</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <button
                                className="text-gray-300 hover:text-blue-400"
                                title="View Details"
                              >
                                <FaEnvelope />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(notification.id || notification._id)}
                                className="text-gray-300 hover:text-red-400"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="notification"
      />
    </>
  );
};

export default Notification;
