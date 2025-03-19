'use client';

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

type DeleteConfirmationModalProps = {
  title: string;
  message: string;
  itemName: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({
  title,
  message,
  itemName,
  isOpen,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="bg-red-50 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">{title}</h3>
            </div>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-700">{message}</p>
          <p className="mt-2 text-sm font-medium text-gray-900">
            "{itemName}"
          </p>
        </div>
        
        <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 