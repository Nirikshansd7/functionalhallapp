import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';

export const createBooking = async (req, res) => {
  try {
    const { venueId, date, guestCount } = req.body;
    
    // Check for existing confirmed booking to prevent double booking
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0); // normalize date

    const existingBooking = await Booking.findOne({
      venue: venueId,
      date: {
        $gte: bookingDate,
        $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ['Paid', 'Confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Venue is already booked for this date' });
    }

    const booking = await Booking.create({
      venue: venueId,
      customer: req.user._id,
      date: bookingDate,
      guestCount,
      status: 'Pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const query = req.user.role === 'customer' 
      ? { customer: req.user._id } 
      : {}; // Vendors could see their venue bookings by a different route
    
    const bookings = await Booking.find(query).populate('venue');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
