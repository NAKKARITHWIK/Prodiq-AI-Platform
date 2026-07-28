import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(requireAdmin);
router.get('/analytics', AdminController.getAnalytics);

export default router;
