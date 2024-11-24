import React from 'react';
import Sidebar from './Sidebar'
import './content.css'
import { SidebarProvider } from '../../context/sidebarContext';
import Managevolunteers from './Managevolunteers';

const Manage = () => {
  return (
    <div className='dashboard'>
      <SidebarProvider>
        <Sidebar />
        <div className="main-content">
          <Managevolunteers/>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Manage;
