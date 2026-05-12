import Venue from '../models/Venue.js';
import cloudinary from '../config/cloudinary.js';

export const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().populate('vendor', 'name');
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('vendor', 'name');
    if (venue) res.json(venue);
    else res.status(404).json({ message: 'Venue not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const { title, description, category, price, images, location } = req.body;
    
    let uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.startsWith('data:image')) {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'venues',
          });
          uploadedImages.push(uploadResponse.secure_url);
        } else {
          uploadedImages.push(image);
        }
      }
    }

    const venue = await Venue.create({
      title,
      description,
      category,
      price,
      images: uploadedImages,
      location,
      vendor: req.user._id,
    });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ vendor: req.user._id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateVenue = async (req, res) => {
  try {
    const { title, description, category, price, images, location } = req.body;
    const venue = await Venue.findById(req.params.id);

    if (venue) {
      if (venue.vendor.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      let uploadedImages = [];
      if (images && images.length > 0) {
        for (const image of images) {
          if (image.startsWith('data:image')) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
              folder: 'venues',
            });
            uploadedImages.push(uploadResponse.secure_url);
          } else {
            uploadedImages.push(image);
          }
        }
      }

      venue.title = title || venue.title;
      venue.description = description || venue.description;
      venue.category = category || venue.category;
      venue.price = price || venue.price;
      venue.images = uploadedImages.length > 0 ? uploadedImages : venue.images;
      venue.location = location || venue.location;

      const updatedVenue = await venue.save();
      res.json(updatedVenue);
    } else {
      res.status(404).json({ message: 'Venue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
