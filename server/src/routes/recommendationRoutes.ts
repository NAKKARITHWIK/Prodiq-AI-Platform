import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, RecommendationController.getRecommendation);

export default router;
