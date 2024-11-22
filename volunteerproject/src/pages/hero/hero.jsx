import React, { useState } from 'react';
import './hero.css';
import arrow_btn from '../../assets/arrow_btn.png';
import pause_icon from '../../assets/pause_icon.png';
import play_icon from '../../assets/play_icon.png';
import { Link } from 'react-router-dom';

const Hero = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
  const [showSignupOptions, setShowSignupOptions] = useState(false);

  return (
    <div className='hero'>
      <div className='hero-text1'>
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="hero-explore" onClick={() => setShowSignupOptions(!showSignupOptions)}>
        <p>Optimize your coordination</p>
        <img src={arrow_btn} alt='' />
        <div className={`dropdown-menu ${showSignupOptions ? 'show' : ''}`}>
          <Link to="/login/Admin" className="dropdown-item">Admin</Link>
        </div>
      </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}></li>
          <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}></li>
          <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}></li>
          <li onClick={() => setHeroCount(3)} className={heroCount === 3 ? "hero-dot orange" : "hero-dot"}></li>
        </ul>
        <div className='videoicon'>
          <div className="hero-play">
            <img onClick={() => setPlayStatus(!playStatus)} src={playStatus ? pause_icon : play_icon} alt='' />
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
