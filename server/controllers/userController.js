import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, phoneNumber, profilePicture } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    if (profilePicture !== undefined) {
      if (profilePicture === '') {
        user.profilePicture = '';
      } else if (profilePicture.startsWith('data:image')) {
        const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
          folder: 'profiles',
        });
        user.profilePicture = uploadResponse.secure_url;
      }
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
