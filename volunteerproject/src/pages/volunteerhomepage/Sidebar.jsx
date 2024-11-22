import React, { useEffect, useState, useContext } from 'react';
import Image12 from '../../assets/profile.jpg';
import { useNavigate } from 'react-router-dom';
import { navigationLinks } from './data';
import './Sidebar.css';
import { SidebarContext } from './sidebarContext';

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(isSidebarOpen) {
      setSidebarClass('sidebar-change'); 
    } else {
      setSidebarClass(''); 
    }
  }, [isSidebarOpen]);

  const handleProfileClick = () => {
    navigate('/volunteer/profile');
  };

  return (
    <div className={`sidebar1 ${sidebarClass}`}>
      <div className='user-info'>
        <div className='info-img' onClick={handleProfileClick} >
          <img src={Image12} alt="profile image" />
        </div>
        <span className='info-name'>Volunteer</span>
      </div>
      
      <nav className="navigation">
        <ul className='nav-list'>
          {
            navigationLinks.map((navigationLink) => (
              <li className="nav-item" key={navigationLink.id}>
                <a href={navigationLink.href} className={'nav-link'}>
                  <img src={navigationLink.image} className='nav-link-icon' alt={navigationLink.title} />
                  <span className='nav-link-text'>
                    {navigationLink.title}
                  </span>
                </a>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
