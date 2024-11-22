import React, { useContext } from 'react';
import { iconsImgs } from "../../../utils/images";
import { SidebarContext } from "../sidebarContext";
import './volunteertop'

const VolunteerTop = ({  }) => {
    const { toggleSidebar } = useContext(SidebarContext);

    return (
        <div className="main-content-top">
            <div className="content-top-left">
                <button type="button" className="sidebar-toggler" onClick={toggleSidebar}>
                    <img src={iconsImgs.menu} alt="Menu" />
                </button>
                <h3 className="content-top-title">Welcome aboard</h3>
            </div>
            
        </div>
    );
};

export default VolunteerTop;