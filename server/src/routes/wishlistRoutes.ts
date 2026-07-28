import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', WishlistController.getUserWishlist);
router.get('/ids', WishlistController.getWishlistIds);
router.post('/toggle', WishlistController.toggleWishlist);

export default router;
