import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all events
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
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

  return (
    <div>
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Welcome to EventMaster</h1>
        <p className="lead">
          Discover and book tickets for amazing events happening around you.
        </p>
        <hr className="my-4" />
        <p>
          From concerts to workshops, conferences to sports events, we've got you covered.
        </p>
      </div>

      <h2 className="mb-4">Upcoming Events</h2>
      
      {events.length === 0 ? (
        <div className="alert alert-info">No events available at the moment.</div>
      ) : (
        <div className="row">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 