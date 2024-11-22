import React from 'react'
import './location.css'

const Location = ({ location }) => {
  return (
    <div className='location'>
      <p><strong>Location:</strong> {location}</p>
    </div>
  )
}

export default Location