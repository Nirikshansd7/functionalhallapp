import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Cancelled', 'Confirmed'], default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
}, { timestamps: true });

// Prevent double booking on the same date for the same venue if confirmed/paid
bookingSchema.index({ venue: 1, date: 1 }, { unique: false });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
