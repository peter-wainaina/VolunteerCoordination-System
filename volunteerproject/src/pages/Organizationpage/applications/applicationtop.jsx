import React, { useContext } from 'react'
import { iconsImgs } from "../../../utils/images";
import { SidebarContext } from "../../../context/sidebarContext";
import './applicationstop.css'

const Applicationtop = () => {
    const { toggleSidebar } = useContext(SidebarContext);
    return (
      <div className="main-content-top">
          <div className="content-top-left">
          
              <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar() }>
                  <img src={ iconsImgs.menu } alt="" />
              </button>
              <h3 className="content-top-title"> Check out Recent Applicants </h3>
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

export default Applicationtop
