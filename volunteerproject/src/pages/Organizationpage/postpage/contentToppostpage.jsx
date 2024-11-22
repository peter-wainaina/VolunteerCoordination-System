import React from 'react'
import { useContext } from "react";
import { iconsImgs } from "../../../utils/images";
import { SidebarContext } from "../../../context/sidebarContext";
import "./contentToppostpage.css";

const ContentToppostpage = () => {
    const { toggleSidebar } = useContext(SidebarContext);
    return (
      <div className="main-content-top">
          <div className="content-top-left">
          
              <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar() }>
                  <img src={ iconsImgs.menu } alt="" />
              </button>
              <h3 className="content-top-title">Explore Opportunities </h3>
          </div>
          <div className="content-top-btns">
            
              <button type="button" className="search-btn content-top-btn">
                  <img src={ iconsImgs.search } alt="" />
              </button>
              <button className="notification-btn content-top-btn">
                  <img src={ iconsImgs.bell } />
                  <span className="notification-btn-dot"></span>
              </button>
          </div>
      </div>
    )
}

export default ContentToppostpage

