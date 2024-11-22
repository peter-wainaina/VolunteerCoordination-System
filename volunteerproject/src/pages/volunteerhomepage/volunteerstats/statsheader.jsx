import React from 'react'
import './header.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  return (
    <div>
       <header className="stats-header">
        <div className="header-container">
          <h1 className="header-title">Volunteer Dashboard</h1>
          <div className="header-buttons">
            <button className="icon-button">
              <NotificationsIcon />
              <span className="visually-hidden">Notifications</span>
            </button>
            <button className="icon-button">
              <AccountCircleIcon />
              <span className="visually-hidden">Profile</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
