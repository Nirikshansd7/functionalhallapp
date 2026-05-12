import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of Cloudinary URLs
  location: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;
