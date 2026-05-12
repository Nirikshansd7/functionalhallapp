import axios from 'axios';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Format phone number to include country code if it's missing
    const formattedPhoneNumber = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;

    // MSG91 Send OTP API
    const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
    const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
    console.log("MSG91 Request Params:", { MSG91_TEMPLATE_ID, formattedPhoneNumber, MSG91_AUTH_KEY });
    const response = await axios.post(
      `https://api.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=${formattedPhoneNumber}&authkey=${MSG91_AUTH_KEY}`
    );

    if (response.data.type === 'success') {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(400).json({ message: response.data.message || 'Failed to send OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp, name, role } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // Format phone number to include country code if it's missing
    const formattedPhoneNumber = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;

    // MSG91 Verify OTP API
    const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
    const response = await axios.get(
      `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${formattedPhoneNumber}&authkey=${MSG91_AUTH_KEY}`
    );

    if (response.data.type === 'success') {
      // Find or create user
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        // If user doesn't exist, create one (this assumes it's a registration/login flow)
        // We might need a name and role if it's the first time
        user = await User.create({
          name: name || 'User',
          phoneNumber,
          role: role || 'customer',
          isVerified: true
        });
      } else {
        user.isVerified = true;
        await user.save();
      }

      res.status(200).json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({ message: response.data.message || 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
