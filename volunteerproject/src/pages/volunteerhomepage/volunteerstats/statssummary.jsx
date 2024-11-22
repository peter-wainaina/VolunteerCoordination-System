import React from 'react'
import './statssummary.css'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


const Statssummary = ({volunteerData}) => {
  return (
    <div>
      <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Total Hours</h3>
              <AccessTimeIcon className="stat-icon" />
            </div>
            <div className="stat-value">{volunteerData.totalHours}</div>
            <p className="stat-subtitle">+{volunteerData.recentHours} from last month</p>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Upcoming Events</h3>
              <CalendarTodayIcon className="stat-icon" />
            </div>
            <div className="stat-value">{volunteerData.upcomingEvents.length}</div>
            <p className="stat-subtitle">Events scheduled</p>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Achievements</h3>
              <EmojiEventsIcon className="stat-icon" />
            </div>
            <div className="stat-value">{volunteerData.achievements}</div>
            <p className="stat-subtitle">Badges earned</p>
          </div>
        </div>
    </div>
  )
}

export default Statssummary
