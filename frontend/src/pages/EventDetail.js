import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="alert alert-warning my-5" role="alert">
        Event not found.
      </div>
    );
  }

  return (
    <div className="row my-5">
      <div className="col-md-6">
        <img 
          src={event.image || 'https://via.placeholder.com/600x400?text=Event'} 
          alt={event.title}
          className="img-fluid rounded"
        />
      </div>
      <div className="col-md-6">
        <h1>{event.title}</h1>
        <p className="lead">{event.description}</p>
        
        <div className="my-4">
          <h5>Event Details</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Date & Time:</strong> {formatDate(event.date)}
            </li>
            <li className="list-group-item">
              <strong>Location:</strong> {event.location}
            </li>
            <li className="list-group-item">
              <strong>Price:</strong> ${event.price}
            </li>
            <li className="list-group-item">
              <strong>Available Tickets:</strong> {event.availableTickets}
            </li>
          </ul>
        </div>
        
        <div>
          <Link to={`/book/${event._id}`} className="btn btn-primary btn-lg">
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 