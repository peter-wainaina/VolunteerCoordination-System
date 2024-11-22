import React from 'react'
import './reports.css'
import{ iconsImgs } from '../../../utils/images.js'
import { Link } from 'react-router-dom';

const Reports = () => {
   

  return (
    <div className ='grid-one-item grid-common grid-c1'>
        <div className='grid-c-title'>
        <h3 className="grid-c-title-text">View Recent Applications</h3>
        <Link to="/home/Organization/view-applications">
            <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="Plus icon" />
            </button>
        </Link>
        </div>
        <div className='grid-c3-content'>
            <div className='grid-chart'>
                
            </div>
        </div>
      
    </div>
  )
}

export default Reports
