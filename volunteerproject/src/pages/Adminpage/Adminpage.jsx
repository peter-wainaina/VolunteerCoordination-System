import React from 'react'
import './content.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar'
import useAdminDashboard from './useAdminDashboard'
// import Header from './Header'
import DashboardOverview from './DashboardOverview'
import VolunteerManagement from './VolunteerManagement'
import OrganizationManagement from './OrganizationManagement'
import AddUser from './AddUser'
import Feedback from './Feedback'
import AdminProfile from './AdminProfile'

const Adminpage = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarClosed,
    setIsSidebarClosed,
    currentChart,
    setCurrentChart,
    dateRange,
    setDateRange,
    volunteers,
    setVolunteers,
    organizations,
    setOrganizations,
    editingId,
    setEditingId,
    newUser,
    setNewUser,
    feedbacks,
    setFeedbacks,
    adminProfile,
    setAdminProfile,
    notifications,
    setNotifications,
    handleEdit,
    handleSave,
    handleChange,
    handleDelete,
    handleAddUser,
    downloadReport,
    exportData,
    toggleChart,
    markNotificationAsRead,
  } = useAdminDashboard()

  return (
    <div className="flex h-screen bg-[#1E1E2C] overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 p-7 overflow-auto bg-white">
        {/* <Header  className="z-10 bg-white shadow-md"
          adminProfile={adminProfile}
          notifications={notifications}
          isSidebarOpen={isSidebarOpen}
          markNotificationAsRead={markNotificationAsRead}
        /> */}
        <div className="flex-1 overflow-auto">
          <DashboardOverview isSidebarOpen={isSidebarOpen} path="/admin/dashboard" />
          
          {activeTab === 'volunteers' && (
            <VolunteerManagement 
              isSidebarOpen={isSidebarOpen} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'organizations' && <OrganizationManagement />}
          {activeTab === 'add-user' && <AddUser />}
          {activeTab === 'feedback' && <Feedback />}
          {activeTab === 'admin-profile' && <AdminProfile />}
        </div>
      </main>
    </div>
  )
}

export default Adminpage
