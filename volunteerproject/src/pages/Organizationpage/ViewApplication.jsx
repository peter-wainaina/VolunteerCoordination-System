import React from "react";
import { navigationLinks } from '../../assets/data';


const ViewApplication = () => {
  return (
    <div  className="dashboard">
        <div className={'sidebar1'}>
      <div className='user-info'>
        
        <span className='info-name'>view Applications</span>
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
        

       
        
      </div>
  )
}

export default ViewApplication;
