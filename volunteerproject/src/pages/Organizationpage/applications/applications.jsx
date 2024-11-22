import React from 'react'
import '../content.css'
import Sidebar from '../Sidebar';
import Applicationtop from './applicationtop';
import ApplicantsPage from './applicationpage';
import { SidebarProvider } from '../../../context/sidebarContext';

const applications = () => {
  return (
    <div className='dashboard'>
      <SidebarProvider>
          <Sidebar />
          <div className="main-content">
          <Applicationtop/>
          <ApplicantsPage/>

          </div>
    </SidebarProvider>
      </div>
      
    
  )
}

export default applications
