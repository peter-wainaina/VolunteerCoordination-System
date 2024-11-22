import React from "react";
import Contentmain from "./contentmain";
import './content.css'


const Content = () => {
  return (
    <div className="main-content">
      <div className='topheader'>
        <header className="topheader-header">
          <div className="topheader-holder">
            <h1 className="topheader-title">Volunteer Opportunities</h1>
            <p className="subtitle">Find the perfect volunteer opportunity for you</p>
          </div>
        </header>
      </div>
      <Contentmain></Contentmain>
        
        
      
   
    </div>
  )
}

export default Content
