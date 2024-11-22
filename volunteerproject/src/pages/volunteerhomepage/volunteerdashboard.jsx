import React  from 'react';
import Sidebar from './Sidebar';
import Content from './content';
import './volunteerdashboard.css'
import { SidebarProvider } from './sidebarContext';



function Volunteerdashboard (){
  
  return (
    <div className="dashboard">
      <SidebarProvider>
      <Sidebar />
      <Content></Content>
    
    </SidebarProvider>
     
      
      
    </div>
  );
}

export default Volunteerdashboard
