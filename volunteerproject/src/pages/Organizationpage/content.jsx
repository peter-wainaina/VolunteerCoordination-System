import React from "react";
import ContentTop  from "./contentTop";
import Contentmain from "./contentmain";
import './content.css'
import PostOpportunity from "./postpage/PostOpportunity";

const Content = () => {
  return (
    <div className="main-content">
        <ContentTop></ContentTop>
        <Contentmain></Contentmain>
        
        
      
    </div>
  )
}

export default Content
