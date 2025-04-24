import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '19:00',
    location: '',
    price: '',
    availableTickets: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { title, description, date, time, location, price, availableTickets, image } = formData;

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/create-event' } });
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format date and time
      const combinedDateTime = new Date(`${date}T${time}`);
      
      const eventData = {
        title,
        description,
        date: combinedDateTime,
        location,
        price: parseFloat(price),
        availableTickets: parseInt(availableTickets),
        image
      };
      
      const token = localStorage.getItem('token');
      await axios.post('/api/events', eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '19:00',
        location: '',
        price: '',
        availableTickets: '',
        image: ''
      });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    }
  };

  return (
    <div className="my-5">
      <h2>Create New Event</h2>
      
      {success && (
        <div className="alert alert-success my-3" role="alert">
          Event created successfully! Redirecting to dashboard...
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Event Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="5"
                value={description}
                onChange={onChange}
                required
              ></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={date}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="time" className="form-label">Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="time"
                  name="time"
                  value={time}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={location}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label">Ticket Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  id="price"
                  name="price"
                  value={price}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="availableTickets" className="form-label">Available Tickets</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  id="availableTickets"
                  name="availableTickets"
                  value={availableTickets}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL (optional)</label>
              <input
                type="url"
                className="form-control"
                id="image"
                name="image"
                value={image}
                onChange={onChange}
                placeholder="https://example.com/image.jpg"
              />
              <div className="form-text">
                Provide a URL to an image for your event. If left blank, a default image will be used.
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 