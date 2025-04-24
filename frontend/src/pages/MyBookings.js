import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
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
      navigate('/login', { state: { from: '/my-bookings' } });
    }
  }, [navigate]);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  // Cancel booking handler
  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`/api/bookings/${id}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Update booking status in state
        setBookings(
          bookings.map(booking => 
            booking._id === id ? { ...booking, status: 'cancelled' } : booking
          )
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel booking.');
        console.error('Error cancelling booking:', err);
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
      <h2 className="mb-4">My Bookings</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          <p>You have no bookings yet.</p>
          <Link to="/" className="btn btn-primary mt-2">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="row">
          {bookings.map(booking => (
            <div key={booking._id} className="col-md-6 col-lg-4 mb-4">
              <div className={`card h-100 ${booking.status === 'cancelled' ? 'border-danger' : ''}`}>
                {booking.event.image ? (
                  <img 
                    src={booking.event.image} 
                    className="card-img-top event-image" 
                    alt={booking.event.title} 
                  />
                ) : (
                  <div className="card-img-top event-image bg-light d-flex align-items-center justify-content-center">
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{booking.event.title}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {formatDate(booking.event.date)}
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {booking.event.location}
                  </p>
                  <p className="card-text">
                    <strong>Number of Tickets:</strong> {booking.numberOfTickets}
                  </p>
                  <p className="card-text">
                    <strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Booking Date:</strong> {formatDate(booking.bookingDate)}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong> 
                    <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'} ms-2`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <Link to={`/events/${booking.event._id}`} className="btn btn-info">
                      View Event
                    </Link>
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-danger"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 