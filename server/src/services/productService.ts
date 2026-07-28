import prisma from './prisma';
import { ProductFilterDTO } from '../types/product';

export class ProductService {
  /**
   * Fetch all products matching search, category, brand, or price constraints
   */
  static async getProducts(filter: ProductFilterDTO) {
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let filtered = products;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.specsJson.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filter.category && filter.category !== 'ALL') {
      filtered = filtered.filter(p => p.category.toUpperCase() === filter.category!.toUpperCase());
    }

    if (filter.brand && filter.brand !== 'ALL') {
      const b = filter.brand.toLowerCase();
      filtered = filtered.filter(p => p.brand.toLowerCase().includes(b));
    }

    if (filter.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filter.maxPrice!);
    }

    return filtered;
  }

  /**
   * Fetch single product details with reviews
   */
  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    return product;
  }
}
