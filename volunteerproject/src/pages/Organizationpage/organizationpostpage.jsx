import React from "react";
import Sidebar from './Sidebar';
import Content from './content';
import PostOpportunity from "./postpage/PostOpportunity"
import './content.css'
import { SidebarProvider } from '../../context/sidebarContext';

const Organizationpostpage = () => {
  return (
    <div className="dashboard">
    <SidebarProvider>
          <Sidebar />
          <PostOpportunity/>
    </SidebarProvider>
    
    
  </div>
  )
}

export default Organizationpostpage
