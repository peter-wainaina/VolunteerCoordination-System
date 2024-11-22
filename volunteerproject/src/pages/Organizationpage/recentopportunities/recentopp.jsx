import React from 'react'
import Sidebar from '../Sidebar'
import '../content.css'
import RecentOpportunities from './recentopportunities';
import Contenttopopportunities from './contenttopopportunities';
import { SidebarProvider } from '../../../context/sidebarContext';
import './recent.css'


const Recent = () => {
  return (
    <div className='dashboard'>
      <SidebarProvider>
          <Sidebar />
          <div className="main-content">
          <Contenttopopportunities/>
          <RecentOpportunities/>
          </div>
    </SidebarProvider>
      </div>
      
    
  )
}

export default Recent
