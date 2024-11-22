import React from 'react';
import { Popover } from './Popover';
import NotificationDropdown from './NotificationDropdown';
import { Avatar } from './CustomComponents';

const Header = ({ adminProfile, notifications, isSidebarOpen, markNotificationAsRead }) => {
  return (
    <header className={`fixed top-0 right-0 left-0 flex justify-between items-center p-4 bg-white shadow-md transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <h1 className="text-3xl font-bold text-[#1E1E2C]">Welcome, {adminProfile.username}!</h1>
      <div className="flex items-center space-x-4">
        < NotificationDropdown/>
        <Avatar src={adminProfile.avatar} alt={adminProfile.username} fallback={adminProfile.username[0]} />
      </div>
    </header>
  );
};

export default Header;