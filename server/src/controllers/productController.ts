import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { calculateSellerTrustScore } from '../utils/sellerTrustEngine';
import prisma from '../services/prisma';

export class ProductController {
  /**
   * GET /api/products (Enhanced Multi-Facet Search & Filter)
   */
  static async getProducts(req: Request, res: Response) {
    try {
      const {
        q,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        seller,
        processor,
        ram,
        gpu,
        storage,
        sortBy,
      } = req.query;

      const products = await ProductService.getProducts({
        search: q as string,
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      // Filter by rating, seller, specs parameters
      let filtered = products;

      if (minRating) {
        filtered = filtered.filter((p) => p.rating >= Number(minRating));
      }
      if (seller) {
        filtered = filtered.filter((p) => p.sellerName.toLowerCase().includes((seller as string).toLowerCase()));
      }
      if (processor) {
        filtered = filtered.filter((p) => p.specsJson.toLowerCase().includes((processor as string).toLowerCase()));
      }
      if (ram) {
        filtered = filtered.filter((p) => p.specsJson.toLowerCase().includes((ram as string).toLowerCase()));
      }
      if (gpu) {
        filtered = filtered.filter((p) => p.specsJson.toLowerCase().includes((gpu as string).toLowerCase()));
      }
      if (storage) {
        filtered = filtered.filter((p) => p.specsJson.toLowerCase().includes((storage as string).toLowerCase()));
      }

      // Populate Seller Trust Scores for every product
      const sellersTrustMap = new Map();
      const sellers = await prisma.sellerTrust.findMany();
      sellers.forEach((s) => sellersTrustMap.set(s.sellerName, s));

      const enrichedProducts = filtered.map((p) => {
        const trustData = sellersTrustMap.get(p.sellerName) || {
          rating: p.sellerRating,
          reviewCount: 500,
          deliveryReliabilityScore: 96,
          priceStabilityScore: 92,
          returnPolicyDays: 14,
          isVerified: true,
        };
        const trust = calculateSellerTrustScore(trustData);

        return {
          ...p,
          sellerTrust: trust,
        };
      });

      return res.status(200).json({ products: enrichedProducts, count: enrichedProducts.length });
    } catch (error: any) {
      console.error('GetProducts Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch products' });
    }
  }

  /**
   * GET /api/products/:id
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: 'Not Found', message: 'Product not found' });
      }

      // Calculate Seller Trust Score
      const sellerData = await prisma.sellerTrust.findUnique({
        where: { sellerName: product.sellerName },
      });

      const trust = calculateSellerTrustScore(
        sellerData || {
          rating: product.sellerRating,
          reviewCount: 500,
          deliveryReliabilityScore: 96,
          priceStabilityScore: 92,
          returnPolicyDays: 14,
          isVerified: true,
        }
      );

      // Fetch Similar Products in same category
      const similarProducts = await prisma.product.findMany({
        where: {
          category: product.category,
          NOT: { id: product.id },
        },
        take: 4,
      });

      const enrichedSimilarProducts = similarProducts.map((p) => {
        const trust = calculateSellerTrustScore({
          rating: p.sellerRating,
          reviewCount: 500,
          deliveryReliabilityScore: 96,
          priceStabilityScore: 92,
          returnPolicyDays: 14,
          isVerified: true,
        });
        return {
          ...p,
          sellerTrust: trust,
        };
      });

      return res.status(200).json({
        product: {
          ...product,
          sellerTrust: trust,
        },
        similarProducts: enrichedSimilarProducts,
      });
    } catch (error: any) {
      console.error('GetProductById Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch product details' });
    }
  }
}
