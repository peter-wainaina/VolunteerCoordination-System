import React from 'react';
import './upcoming.css';

const Upcoming = ({ events }) => {
  return (
    <div className="upcoming-events">
      <h3>Upcoming Opportunities</h3>
      {events && events.length > 0 ? (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <h4>{event.title}</h4>
              <div className="event-details">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Availability:</strong> {event.availability}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Organization:</strong> {event.organization}</p>
                <p><strong>Skills needed:</strong> {event.skills}</p>
                <p><strong>Type:</strong> {event.type}</p>
                <p><strong>Status:</strong> {event.status}</p>
              </div>
              <p className="event-description">{event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events match your skills or organizations.</p>
      )}
    </div>
  );
};

export default Upcoming;