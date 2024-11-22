import React from 'react';
import Sidebar from './Sidebar';
import Content from './content';
import './organizationdashboard.css';
import { SidebarProvider } from '../../context/sidebarContext';



function OrganizationDashboard() {
  return (
    <div className="dashboard">
      <SidebarProvider>
      <Sidebar />
      <Content></Content>
      
    </SidebarProvider>
      
      
    </div>
  );
}

export default OrganizationDashboard;
