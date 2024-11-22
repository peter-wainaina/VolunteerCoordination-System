import React from 'react';
import './socialcard.css';

const Socialcard = ({ userData }) => {
  return (
    <div className='card'>
      <div className="card_title">{userData.title}</div>
      <div className="card_body">
        <div className='card_image'>
          
          <img src={userData.organization.logo || 'placeholder.jpg'} alt={`${userData.organization.name} logo`} />
        </div>
        <div className='card_description'>{userData.description}</div>
        <a href={userData.url} target="_blank" rel="noopener noreferrer">Learn More</a>
      </div>
    </div>
  );
};

export default Socialcard;
