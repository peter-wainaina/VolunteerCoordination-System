import React from 'react'
// import ContentTop from './contentTop'
import './content.css'
import Sidebar from './Sidebar'
import { SidebarProvider } from '../../context/sidebarContext'
import VolunteerTop from '../volunteerhomepage/volunteerstats/volunteertop'
import Orgform from './orgform'

const Orgfeedback = () => {
  return (
    <div className='dashboard'>
    <SidebarProvider>
        <Sidebar/>
        <div className='main-content'>
            <VolunteerTop/>
            <Orgform/>

        </div>
    </SidebarProvider>
    </div>
  )
}

export default Orgfeedback

