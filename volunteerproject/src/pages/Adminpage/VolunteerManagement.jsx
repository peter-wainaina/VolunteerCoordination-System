import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box,TextField } from "@mui/material";
import { Close, Delete, GetApp, Edit } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminDashboard from './useAdminDashboard';
import Header from './Header';
import Sidebar from './Sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export default function VolunteerManagement() {
  const { users, fetchUsers, updateUser, deleteUser, error, adminProfile, notifications, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useAdminDashboard();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditOpen = (volunteer) => {
    setCurrentVolunteer(volunteer);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentVolunteer(null);
  };

  const handleDeleteOpen = (volunteer) => {
    setCurrentVolunteer(volunteer);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setCurrentVolunteer(null);
  };

  const handleChange = (e) => {
    setCurrentVolunteer({ ...currentVolunteer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser(currentVolunteer.id, currentVolunteer);
    handleEditClose();
  };

  const handleDelete = async () => {
    await deleteUser(currentVolunteer.id);
    handleDeleteClose();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Volunteer Report', 14, 22);
    const headers = ['Name', 'Email', 'Phone', 'Skills', 'Availability'];
    const data = filteredUsers.map(user => [user.name, user.email, user.phonenumber, user.skills, user.availability]);
    doc.autoTable({ head: [headers], body: data, startY: 30, theme: 'grid' });
    doc.save('volunteer_report.pdf');
  };

  return (
    <div className="flex h-screen bg-[#1E1E2C]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          adminProfile={adminProfile} 
          notifications={notifications} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className={`flex-1 p-12  bg-white  transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Box sx={{ width: '100%', height: '90%',margin: 'auto', padding: 4 , display: 'flex', flexDirection: 'column' }}>
           <motion.div initial="hidden"animate="visible"variants={fadeIn} className="">
            <Box className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
              <motion.h1 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                className="text-2xl font-bold text-gray-800"
              >
                Volunteer Management
              </motion.h1>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadPDF}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <GetApp className="mr-2" />Download Report
                </motion.button>
              </div>
            </Box>

            <div className="overflow-hidden rounded-xl border border-gray-200 h-[calc(100vh-280px)]">
              <div className="overflow-x-auto overflow-y-auto h-full">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Phone</th>
                      <th className="px-6 py-3 font-semibold">Skills</th>
                      <th className="px-6 py-3 font-semibold">Availability</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.tr key={`${user.id}-${index}`} variants={tableRowVariants} initial="hidden" animate="visible" exit="hidden"
                          transition={{ delay: index * 0.1 }} className="bg-white hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.phonenumber}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.skills?.split(',').map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">{user.availability}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEditOpen(user)}
                                className="p-1 text-blue-600 hover:text-blue-800">
                                <Edit />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteOpen(user)}
                                className="p-1 text-red-600 hover:text-red-800">
                                <Delete />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={handleEditClose} className="rounded-lg">
              <div className="bg-white rounded-t-lg">
                <DialogTitle className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Edit Volunteer</span>
                  <IconButton onClick={handleEditClose}><Close /></IconButton>
                </DialogTitle>
                <DialogContent className="space-y-4">
                  {currentVolunteer && (
                    <div className="space-y-4 pt-4">
                      <TextField fullWidth label="Name" name="name" value={currentVolunteer.name} onChange={handleChange} className="bg-gray-50" />
                      <TextField fullWidth label="Email" name="email" value={currentVolunteer.email} onChange={handleChange} className="bg-gray-50" />
                      <TextField fullWidth label="Phone Number" name="phonenumber" value={currentVolunteer.phonenumber} onChange={handleChange} className="bg-gray-50" />
                      <TextField fullWidth label="Skills" name="skills" value={currentVolunteer.skills} onChange={handleChange} className="bg-gray-50" />
                      <TextField fullWidth label="Availability" name="availability" value={currentVolunteer.availability} onChange={handleChange} className="bg-gray-50" />
                    </div>
                  )}
                </DialogContent>
                <DialogActions className="p-4">
                  <button onClick={handleEditClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                </DialogActions>
              </div>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDelete} onClose={handleDeleteClose} className="rounded-lg">
              <div className="bg-white rounded-lg">
                <DialogTitle className="text-xl font-semibold">Confirm Delete</DialogTitle>
                <DialogContent className="py-4">
                  <p className="text-gray-600">Are you sure you want to delete this volunteer? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions className="p-4">
                  <button onClick={handleDeleteClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                </DialogActions>
              </div>
            </Dialog>
           </motion.div> 
          </Box>
        </main>
      </div>
    </div>
  );
}