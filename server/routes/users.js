import express from 'express';
import { updateUserProfile, deleteUserAccount } from '../controllers/userController.js';

const router = express.Router();

router.put('/:userId', updateUserProfile);
router.delete('/:userId', deleteUserAccount);

export default router;
