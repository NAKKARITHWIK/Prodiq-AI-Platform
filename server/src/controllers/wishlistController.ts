import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { WishlistService } from '../services/wishlistService';

export class WishlistController {
  static async getUserWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const products = await WishlistService.getUserWishlist(req.user.id);
      return res.status(200).json({ products });
    } catch (error: any) {
      console.error('Wishlist error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch wishlist' });
    }
  }

  static async toggleWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ error: 'productId required' });

      const result = await WishlistService.toggleWishlist(req.user.id, productId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Toggle wishlist error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to toggle wishlist item' });
    }
  }

  static async getWishlistIds(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const ids = await WishlistService.getUserWishlistIds(req.user.id);
      return res.status(200).json({ ids });
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal Error' });
    }
  }
}
