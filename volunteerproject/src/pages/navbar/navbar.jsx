import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showSignupOptions, setShowSignupOptions] = useState(false);

  return (
    <div className='nav'>
      <div className='nav-logo'>Volunteer Unity</div>
      <div className="nav-menu">
        <button className="signup-btn" onClick={() => setShowSignupOptions(!showSignupOptions)}>
          Get started
        </button>
        <div className={`dropdown-menu ${showSignupOptions ? 'show' : ''}`}>
          <Link to="/signup/volunteer" className="dropdown-item">Volunteer</Link>
          <Link to="/signup/organization" className="dropdown-item">Organization</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
