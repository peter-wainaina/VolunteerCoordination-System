import React from 'react';
import Sidebar from './Sidebar';
import Content from './content';
import { SidebarProvider } from './sidebarContext';
import VolunteerTop from './volunteerstats/volunteertop';
import Feedforms from './feedform';

const Feedback = () => {
  return (
    <div className="dashboard">
      <SidebarProvider>
        <Sidebar />
        <div className="main-content">
          <VolunteerTop />
          <Feedforms />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Feedback;