import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookTicket = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/book/${id}` } });
    }
  }, [id, navigate]);

  // Fetch event details
  useEffect(() => {
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

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/bookings',
        { 
          eventId: id, 
          numberOfTickets: ticketCount 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookingSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book tickets. Please try again.');
      console.error('Error booking tickets:', err);
    }
  };

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

  if (bookingSuccess) {
    return (
      <div className="alert alert-success my-5" role="alert">
        <h4 className="alert-heading">Booking Successful!</h4>
        <p>You have successfully booked {ticketCount} ticket(s) for {event.title}.</p>
        <hr />
        <p className="mb-0">
          You can view your bookings in the 
          <button 
            onClick={() => navigate('/my-bookings')} 
            className="btn btn-link p-0 mx-1"
          >
            My Bookings
          </button> 
          section.
        </p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <h2>Book Tickets for {event.title}</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              Event Details
            </div>
            <div className="card-body">
              <h5 className="card-title">{event.title}</h5>
              <p className="card-text">{event.description}</p>
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
          </div>
        </div>
        <div className="col-md-6">
          <div className="card booking-form">
            <div className="card-header">
              Booking Details
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="ticketCount" className="form-label">Number of Tickets</label>
                  <input
                    type="number"
                    className="form-control"
                    id="ticketCount"
                    min="1"
                    max={event.availableTickets}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Price</label>
                  <div className="form-control bg-light">
                    ${(event.price * ticketCount).toFixed(2)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={event.availableTickets < 1}
                >
                  {event.availableTickets < 1 ? 'Sold Out' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket; 