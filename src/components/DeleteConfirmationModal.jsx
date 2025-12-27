import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[#464859] rounded-xl shadow-2xl w-full max-w-md p-6 animate-scaleIn border border-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900">
            <FaTrashAlt className="text-red-400 text-lg" />
          </span>

          <h3 className="text-lg font-semibold text-white">
            Delete Confirmation
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{itemName}</span>?  
          This action{" "}
          <span className="text-red-400 font-semibold">
            cannot be undone
          </span>.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-white hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition shadow"
          >
            Yes, Delete
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default DeleteConfirmationModal;