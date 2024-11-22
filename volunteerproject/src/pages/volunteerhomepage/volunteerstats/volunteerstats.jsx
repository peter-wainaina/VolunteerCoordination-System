import React from 'react'
import Sidebar from '../Sidebar';
import '../volunteerdashboard.css'
import'../content.css'
import Stats from './stats';
import { SidebarProvider } from '../sidebarContext';
import Volunteertop from './volunteertop';

const volunteerstats = () => {
  return (
    <div className='dashboard'>
      
      <SidebarProvider>
      <Sidebar />
      <div className= 'main-content'>
      <Volunteertop></Volunteertop>
      <Stats/>
      </div>
    
    </SidebarProvider>
    </div>
    
  )
}

export default volunteerstats
