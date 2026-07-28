import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticateJWT, ProfileController.getProfile);
router.put('/profile', authenticateJWT, ProfileController.updateProfile);

export default router;
