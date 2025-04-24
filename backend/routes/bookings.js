const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if tickets are available
    if (event.availableTickets < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }
    
    // Calculate total price
    const totalPrice = event.price * numberOfTickets;
    
    // Create booking
    const booking = new Booking({
      event: eventId,
      user: req.user._id,
      numberOfTickets,
      totalPrice
    });
    
    // Update available tickets
    event.availableTickets -= numberOfTickets;
    
    // Save booking and update event
    await booking.save();
    await event.save();
    
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'title date location image'
      })
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title description date location price image'
      });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Get event
    const event = await Event.findById(booking.event);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    
    // Return tickets to available pool
    event.availableTickets += booking.numberOfTickets;
    
    // Save booking and update event
    await booking.save();
    await event.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 