import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './stats.css';
import Statssummary from './statssummary';
import Header from './statsheader';
import Upcoming from './upcoming';
import RecentActivities from './RecentActivities';
import Loading1 from './loading1';
import './loading1.css';

const Stats = () => {
  const [volunteerData, setVolunteerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/volunteer-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVolunteerData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching volunteer stats:', err);
        setError('Failed to fetch volunteer stats. Please try again later.');
        setIsLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
      <Loading1 />
      <p className="mt-4 text-gray-600">Loading your stats ...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!volunteerData) {
    return (
      <div className='loading-container'>
        <div className='loading-message'>No data available</div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <Header/>
      <main className="stats-main">
        <div className="welcome-message">
          <h2 className="welcome-title">Welcome back, {volunteerData.name}!</h2>
          <p className="welcome-subtitle">Here's an overview of your volunteer activities.</p>
        </div>
        <Statssummary volunteerData={volunteerData}/>
        <div className="details-grid">
          <Upcoming events={volunteerData.upcomingEvents} />
          <RecentActivities activities={volunteerData.recentActivities} />
        </div>

        <div className="category-breakdown">
          <h3 className="breakdown-title">Hours by Category</h3>
          <p className="breakdown-subtitle">Breakdown of your volunteer hours by category</p>
          <div className="category-list">
            {volunteerData.hoursByCategory.map((category) => (
              <div key={category.category} className="category-item">
                <span className="category-name">{category.category}</span>
                <span className="category-hours">{category.hours} hours</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stats;