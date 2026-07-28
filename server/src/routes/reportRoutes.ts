import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, ReportController.createReport);
router.get('/', authenticateJWT, ReportController.getUserReports);
router.delete('/:id', authenticateJWT, ReportController.deleteReport);

export default router;
