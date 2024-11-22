import React from 'react'
import Sidebar from '../Sidebar';
import '../volunteerdashboard.css'
import'../content.css'
import { SidebarProvider } from '../sidebarContext';
import Volunteertop from './volunteertop';
import './savedopportunities.css'
import Applied from './applied';


const Savedopportunities = () => {
  return (
    <div className='dashboard'>
      
      <SidebarProvider>
      <Sidebar />
      <div className= 'main-content'>
      {/* <div className='topheader'>
        <header className="topheader-header">
          <div className="topheader-holder">
            <h1 className="topheader-title">Saved Opportunities</h1>
            <p className="subtitle">Explore opportunities saved</p>
          </div>
        </header>
      </div> */}
      <Volunteertop></Volunteertop>
      <Applied></Applied>
      
      </div>
    
    </SidebarProvider>
    </div>
  )
}

export default Savedopportunities
