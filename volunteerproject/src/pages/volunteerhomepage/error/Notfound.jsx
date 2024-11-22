import React from 'react';
import './NotFound.css';

function NotFound({ searchQuery }) {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>No Results Found</h1>
        <h2>We couldn't find any opportunities matching "{searchQuery}"</h2>
        <p>Try searching for something else or check out our popular pages.</p>

        <div className="popular-pages">
          <p>Or try these popular pages:</p>
          <div className="page-links">
            <a href="/" className="page-link">
              🏠
              <span className="sr-only">Home</span>
            </a>
            <a href="/home/volunteer" className="page-link">
              👤
              <span className="sr-only">Volunteer Dashboard</span>
            </a>
            
          </div>
        </div>

       
        
       
      </div>
    </div>
  );
}

export default NotFound;