import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card event-card h-100">
        <img 
          src={event.image || 'https://via.placeholder.com/300x200?text=Event'} 
          className="card-img-top event-image" 
          alt={event.title}
        />
        <div className="card-body">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text">{event.description.substring(0, 100)}...</p>
          <p className="card-text">
            <small className="text-muted">
              <i className="bi bi-calendar"></i> {formatDate(event.date)}
            </small>
          </p>
          <p className="card-text">
            <small className="text-muted">
              <i className="bi bi-geo-alt"></i> {event.location}
            </small>
          </p>
          <p className="card-text">
            <strong>${event.price}</strong>
          </p>
        </div>
        <div className="card-footer">
          <Link to={`/events/${event._id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 