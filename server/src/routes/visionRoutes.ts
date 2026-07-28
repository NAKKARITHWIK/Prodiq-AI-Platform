import { Router } from 'express';
import { VisionController } from '../controllers/visionController';

const router = Router();

router.post('/', VisionController.identifyProductImage);

export default router;
