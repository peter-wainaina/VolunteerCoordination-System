import React, { useState } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaTools, FaUserClock, FaEdit, FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from './confirmationmodal';

const Opportunitycard = ({ data, handleDelete, handleEdit, handleStatusChange }) => { 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const confirmDelete = () => {
    handleDelete(data.id);
    closeDeleteModal();
  };

  const confirmEdit = () => {
    handleEdit(data);
    closeEditModal();
  };

  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-600',
    ongoing: 'bg-green-50 text-green-600',
    completed: 'bg-gray-50 text-gray-600'
  };

  return (
    <div key={data.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{data.title}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[data.status]}`}>
            {data.status}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <p className="flex items-center text-gray-600 text-sm"><FaBuilding className="mr-2 text-gray-400" /> {data.organization}</p>
          <p className="flex items-center text-gray-600 text-sm"><FaMapMarkerAlt className="mr-2 text-gray-400" /> {data.location}</p>
          <p className="flex items-center text-gray-600 text-sm"><FaCalendarAlt className="mr-2 text-gray-400" /> {new Date(data.date).toLocaleDateString()}</p>
          <p className="flex items-center text-gray-600 text-sm"><FaTools className="mr-2 text-gray-400" /> {data.skills}</p>
          <p className="flex items-center text-gray-600 text-sm"><FaUserClock className="mr-2 text-gray-400" /> {data.availability}</p>
        </div>
        <p className="text-gray-700 text-sm mb-4">{data.description}</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={openEditModal}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition duration-300 text-sm"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button 
            onClick={openDeleteModal}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition duration-300 text-sm"
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this opportunity?"
      />

      <ConfirmationModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={confirmEdit}
        title="Confirm Edit"
        message="Are you sure you want to edit this opportunity?"
      />
    </div>
  );
}

export default Opportunitycard;