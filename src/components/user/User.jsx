import React, { useState } from 'react';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import UserEdit from './UserEdit';
import { FaEdit, FaTrash } from 'react-icons/fa';

const User = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleDeleteClick = (itemName) => {
    setItemToDelete(itemName);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Perform the actual delete operation here
    console.log(`Deleting ${itemToDelete}`);
    // Reset state after deletion
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsEditSidebarOpen(true);
    setIsAddingUser(false);
  };

  const handleSaveUser = (updatedUser) => {
    // Perform the actual save operation here
    console.log('Saving user:', updatedUser);
    // Close the sidebar after saving
    setIsEditSidebarOpen(false);
    setCurrentUser(null);
    setIsAddingUser(false);
  };

  const handleCancelEdit = () => {
    setIsEditSidebarOpen(false);
    setCurrentUser(null);
    setIsAddingUser(false);
  };

  const handleAddUser = () => {
    // Open the edit sidebar for adding a new user
    setCurrentUser(null); // No existing user data for a new user
    setIsEditSidebarOpen(true);
    setIsAddingUser(true);
  };

  // Sample user data - in a real app this would come from an API
  const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { name: 'Robert Johnson', email: 'robert@example.com', role: 'Viewer', status: 'Inactive' },
    { name: 'Emily Davis', email: 'emily@example.com', role: 'Admin', status: 'Active' },
    { name: 'Michael Wilson', email: 'michael@example.com', role: 'Editor', status: 'Inactive' }
  ];

  return (
    <>
      <div className="p-6">
        <div className="bg-[#464859] rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-300">Manage your users here. You can add, edit, or remove users from the system.</p>
            </div>
            <button 
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Add User
            </button>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse text-sm text-gray-200">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left font-medium">Sr. No</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email || '-'}</td>
                    <td className="px-4 py-3">{user.role || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' 
                          ? 'bg-green-800 text-green-200' 
                          : 'bg-red-800 text-red-200'
                      }`}>
                        {user.status || '-'}
                      </span>
                    </td>
                    
                    {/* Action icons */}
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-gray-300 hover:text-white"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(user.name)}
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
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
      
      <UserEdit
        user={currentUser}
        isOpen={isEditSidebarOpen}
        onSave={handleSaveUser}
        onCancel={handleCancelEdit}
        isAddingUser={isAddingUser}
      />
    </>
  );
};

export default User;