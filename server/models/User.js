import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'vendor'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
