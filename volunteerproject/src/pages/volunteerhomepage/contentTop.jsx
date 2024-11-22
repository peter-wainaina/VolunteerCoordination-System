import React from 'react'
import { useContext } from "react";
import { iconsImgs } from "../../utils/images";
import { SidebarContext } from "./sidebarContext";
import SearchToggle from './SearchToggle.js';
import "./contentTop.css";

const ContentTop = ({ setOpportunities, allOpportunities, useMockData, setUseMockData  }) => {
    const { toggleSidebar } = useContext(SidebarContext);
    return (
       
      <div className="main-content-top">
          <div className="content-top-left">
              <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar() }>
                  <img src={ iconsImgs.menu } alt="" />
              </button>
              <h3 className="content-top-title">Home</h3>
          </div>
          <div className="search-and-toggle">
          <button type="button" className=" content-top-btn">
          <SearchToggle setOpportunities={setOpportunities} allOpportunities={allOpportunities} />
            </button>
              {/* <button className="notification-btn content-top-btn">
                  <img src={ iconsImgs.bell } />
                  <span className="notification-btn-dot"></span>
              </button> */}
              <div className="toggle-container">
              <label className="switch">
                    <input
                        type="checkbox"
                        checked={useMockData}
                        onChange={(e) => setUseMockData(e.target.checked)}
                    />
                    <span className="slider round"></span>
                </label>
                <span className="toggle-label">Use Mock Data</span>
            </div>
          </div>
      </div>
      
    )
}

export default ContentTop

