import { Router } from 'express';
import { HistoryController } from '../controllers/historyController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', HistoryController.getUserHistory);
router.post('/', HistoryController.saveHistory);
router.delete('/:id', HistoryController.deleteHistory);

export default router;
