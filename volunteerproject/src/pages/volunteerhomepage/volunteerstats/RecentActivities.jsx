import React, { useState } from 'react';
import './Recentactivities.css';
import LogHoursModal from './LogHoursModal';
import ViewActivitiesModal from './ViewActivitiesModal';

const RecentActivities = ({ activities }) => {
  const [isLogHoursModalOpen, setIsLogHoursModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState(activities || []);

  const handleLogHoursSuccess = () => {
    setIsLogHoursModalOpen(false);
    // You might want to refresh the activities list here
  };

  const handleActivityDeleted = (deletedId) => {
    // Update both all activities and recent activities
    setAllActivities(allActivities.filter(activity => activity.id !== deletedId));
  };

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
        <p className="no-activities">No recent activities to display.</p>
      )}

      <div className="button-group">
        <button 
          className="view-all-button"
          onClick={() => setIsViewModalOpen(true)}
        >
          View All Activities
        </button>
        <button 
          className="log-hours-button"
          onClick={() => setIsLogHoursModalOpen(true)}
        >
          Log Hours
        </button>
      </div>

      {/* Log Hours Modal */}
      <LogHoursModal 
        isOpen={isLogHoursModalOpen}
        onClose={() => setIsLogHoursModalOpen(false)}
        onSuccess={handleLogHoursSuccess}
      />

      {/* View All Activities Modal */}
      <ViewActivitiesModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        activities={allActivities}
        onActivityDeleted={handleActivityDeleted}
      />
    </div>
  );
};

export default RecentActivities;