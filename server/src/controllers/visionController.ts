import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { GeminiService } from '../services/geminiService';

export class VisionController {
  /**
   * POST /api/vision
   */
  static async identifyProductImage(req: Request, res: Response) {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Base64 image string is required',
        });
      }

      // Clean base64 header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const products = await ProductService.getProducts({});
      if (products.length === 0) {
        return res.status(404).json({ error: 'Not Found', message: 'No database products available for matching' });
      }

      const match = await GeminiService.identifyProductFromImage(cleanBase64, mimeType || 'image/jpeg', products);

      const fullMatchedProduct = await ProductService.getProductById(match.matchedProductId);

      return res.status(200).json({
        match,
        product: fullMatchedProduct || products[0],
      });
    } catch (error: any) {
      console.error('Vision Error:', error);
      return res.status(500).json({
        error: 'Internal Error',
        message: 'Failed to identify product image with Gemini Vision',
      });
    }
  }
}
