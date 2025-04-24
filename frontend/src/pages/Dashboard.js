import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [navigate]);

  // Fetch user's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/events/user/myevents', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  // Delete event handler
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove deleted event from state
        setEvents(events.filter(event => event._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event.');
        console.error('Error deleting event:', err);
      }
    }
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

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Events</h2>
        <Link to="/create-event" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i> Create New Event
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="alert alert-info">
          <p>You haven't created any events yet.</p>
          <Link to="/create-event" className="btn btn-primary mt-2">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
                <th>Available Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.location}</td>
                  <td>${event.price}</td>
                  <td>{event.availableTickets}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/events/${event._id}`} className="btn btn-sm btn-info me-1">
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 