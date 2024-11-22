import React from 'react';
import './Recentactivities.css';

const RecentActivities = ({ activities }) => {
  return (
    <div className="recent-activities">
      <h3>Recent Activities</h3>
      {activities && activities.length > 0 ? (
        <ul className="activities-list">
          {activities.map((activity) => (
            <li key={activity.id} className="activity-item">
              <h4>{activity.title}</h4>
              <div className="activity-details">
                <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                <p><strong>Hours:</strong> {activity.hours}</p>
                <p><strong>Category:</strong> {activity.category}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activities to display.</p>
      )}
      <div className="button-group">
      <button className="view-all-button">View All Activities</button>
      <button className="log-hours-button">
         Log Hours
      </button>
      </div>
    </div>
  );
};

export default RecentActivities;