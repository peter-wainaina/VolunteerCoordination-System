import React from 'react'
import './contentmain.css'
import OrganizationDashboard from './cards/orgdashboard'
import Cards from './cards/cards'
import Reports from './reports/reports'

const Contentmain = () => {
  return (
    <div className="main-content-holder">
        
           {/* <Cards></Cards>
           <Reports></Reports>
           <Reports></Reports>
           <Reports></Reports>
           <Reports></Reports>
           <Reports></Reports> */}
           <OrganizationDashboard></OrganizationDashboard>


       
      
    </div>
  )
}

export default Contentmain
