import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ProductService } from '../services/productService';
import { ProfileService } from '../services/profileService';
import { GeminiService } from '../services/geminiService';

export class RecommendationController {
  /**
   * POST /api/recommendation
   */
  static async getRecommendation(req: AuthenticatedRequest, res: Response) {
    try {
      const { product1Id, product2Id } = req.body;

      if (!product1Id || !product2Id) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Both product1Id and product2Id are required parameters',
        });
      }

      const [product1, product2, profile] = await Promise.all([
        ProductService.getProductById(product1Id),
        ProductService.getProductById(product2Id),
        req.user ? ProfileService.getProfile(req.user.id) : null,
      ]);

      if (!product1 || !product2) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'One or both target comparison products were not found in the database',
        });
      }

      const result = await GeminiService.getRecommendation(product1, product2, profile);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Recommendation Error:', error);
      return res.status(500).json({
        error: 'Internal Error',
        message: 'Failed to synthesize AI recommendation report',
      });
    }
  }
}
