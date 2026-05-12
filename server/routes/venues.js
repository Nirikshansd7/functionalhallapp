import express from 'express';
import { getVenues, getVenueById, createVenue, getMyVenues, updateVenue } from '../controllers/venueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-venues', protect, getMyVenues);
router.get('/', getVenues);
router.post('/', protect, createVenue);
router.get('/:id', getVenueById);
router.put('/:id', protect, updateVenue);

export default router;
