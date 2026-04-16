import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaEnvelope, FaTrash, FaReply, FaSearch, FaFilter, FaEye, FaCheck } from 'react-icons/fa';
import Pagination from '../payment/Pagination';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import LoadingAnimation from '../LoadingAnimation';
import useToast from '../../hooks/useToast';

const ContactMessages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({ to: '', subject: '', message: '' });
  
  const { showSuccess, showError } = useToast();

  // State for messages
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/contact/messages');
      console.log('Contact Messages:', response.data);
      
      let messagesData = [];
      if (response.data?.data) {
        messagesData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        messagesData = response.data;
      }
      
      setMessages(messagesData);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      showError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (messageId) => {
    setItemToDelete(messageId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/zeggo/contact/messages/${itemToDelete}`);
      showSuccess('Message deleted successfully');
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      showError('Failed to delete message');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // Mark as read
    markAsRead(message.id || message._id);
  };

  const markAsRead = async (messageId) => {
    try {
      await api.patch(`/api/zeggo/contact/messages/${messageId}/read`);
      fetchMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleReplyClick = (message) => {
    setReplyData({
      to: message.email,
      subject: `Re: ${message.subject || 'Contact Form Submission'}`,
      message: ''
    });
    setShowReplyModal(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyData.message.trim()) {
      showError('Please enter a reply message');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/zeggo/contact/messages/reply', replyData);
      showSuccess('Reply sent successfully!');
      setShowReplyModal(false);
      setReplyData({ to: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending reply:', err);
      showError('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedMessage(null);
  };

  // Filter and search messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = (message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          message.message?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'read' && message.isRead) ||
                         (filterStatus === 'unread' && !message.isRead);
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMessages.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredMessages.length / itemsPerPage);
  };

  const paginatedMessages = getPaginatedData();
  const totalPages = getTotalPages();

  const getStatusColor = (isRead) => {
    return isRead 
      ? 'bg-green-800 text-green-200' 
      : 'bg-red-800 text-red-200';
  };

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FaEnvelope className="text-lg md:text-xl" /> Contact Form Messages
            </h1>
            <p className="text-sm md:text-base text-gray-300">View and manage messages from your website's contact form</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Messages</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <LoadingAnimation />
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No contact messages found.
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full border-collapse text-sm text-gray-200 min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-4 py-3 text-left font-medium">Sr. No</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Subject</th>
                    <th className="px-4 py-3 text-left font-medium">Message</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMessages.map((message, index) => (
                    <tr
                      key={message.id || message._id || index}
                      className={`border-b border-white/10 hover:bg-white/5 transition ${
                        !message.isRead ? 'bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-3 font-medium">{message.name}</td>
                      <td className="px-4 py-3">{message.email}</td>
                      <td className="px-4 py-3">{message.subject || '-'}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{message.message}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.isRead)}`}>
                          {message.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="text-gray-300 hover:text-blue-400"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleReplyClick(message)}
                            className="text-gray-300 hover:text-green-400"
                            title="Reply"
                          >
                            <FaReply />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(message.id || message._id)}
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
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#464859] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Message Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white font-medium">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{selectedMessage.email}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white">{selectedMessage.phone}</p>
                  </div>
                )}

                {selectedMessage.subject && (
                  <div>
                    <label className="text-sm text-gray-400">Subject</label>
                    <p className="text-white">{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400">Message</label>
                  <p className="text-white whitespace-pre-wrap mt-2 p-3 bg-gray-700 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Received At</label>
                  <p className="text-gray-300">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleReplyClick(selectedMessage);
                      handleCloseDetails();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Reply to Message
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#464859] rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleReplySubmit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Reply to Message</h2>
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      To
                    </label>
                    <input
                      type="email"
                      value={replyData.to}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={replyData.subject}
                      onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={replyData.message}
                      onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
                      rows="6"
                      placeholder="Type your reply here..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReplyModal(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="message"
      />
    </>
  );
};

export default ContactMessages;
