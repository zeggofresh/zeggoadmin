import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import useToast from '../../hooks/useToast';

const UserEdit = ({ user, onSave, onCancel, isOpen, isAddingUser }) => {
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active'
  });
  
  const { showSuccess, showError } = useToast();

  // Update the form when user prop changes or when switching between add/edit modes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAddingUser) {
        // Clear the form for adding a new user
        setEditedUser({
          name: '',
          email: '',
          role: '',
          status: 'Active'
        });
      } else if (user) {
        try {
          // GET API - Fetch specific user by ID
          const userId = user.id || user._id;
          console.log('Fetching user details for ID:', userId);
          
          const response = await api.get(`/api/zeggo/users/${userId}`);
          console.log('GET User Details Response:', response.data);
          
          // Handle different API response structures
          let userData = response.data?.data || response.data;
          
          // Populate the form with ONLY API-fetched user data
          setEditedUser({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            status: userData.status || 'Active'
          });
        } catch (err) {
          console.error('Error fetching user details:', err);
          showError('Failed to load user details');
        }
      }
    };

    fetchUserDetails();
  }, [user, isAddingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (isAddingUser) {
        // POST - Create new user
        const response = await api.post('/api/zeggo/users', editedUser);
        console.log('POST User Response:', response.data);
        
        const successMessage = response.data?.message || 'User created successfully!';
        showSuccess(successMessage);
        onSave({ ...editedUser, id: response.data?.data?.id || response.data?.id });
      } else {
        // PUT/PATCH - Update existing user
        const userId = user.id || user._id;
        const response = await api.put(`/api/zeggo/users/${userId}`, editedUser);
        console.log('PUT User Response:', response.data);
        
        const successMessage = response.data?.message || 'User updated successfully!';
        showSuccess(successMessage);
        onSave(editedUser);
      }
    } catch (err) {
      console.error('Error saving user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save user';
      showError(errorMessage);
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Fixed positioning container */}
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Sidebar panel - slides from right */}
      <div 
        className={`absolute top-0 right-0 h-full w-96 bg-[#464859] shadow-xl transform transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-[#464859] flex justify-between items-center border-b border-gray-600">
            <h3 className="text-lg leading-6 font-medium text-white">
              {isAddingUser ? 'Add User' : 'Edit User'}
            </h3>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-300 text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-5 flex-grow overflow-y-auto scrollbar-hide">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedUser.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={editedUser.email}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={editedUser.role}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-white mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={editedUser.status}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md px-3 py-2 border bg-gray-700 text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-[#464859] flex justify-end space-x-3 border-t border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {isAddingUser ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserEdit;