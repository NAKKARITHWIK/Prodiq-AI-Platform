import prisma from './prisma';

export class WishlistService {
  /**
   * Fetch all wishlisted products for user
   */
  static async getUserWishlist(userId: string) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((i) => i.product);
  }

  /**
   * Toggle product in wishlist
   */
  static async toggleWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { isWishlisted: false, message: 'Removed from Wishlist' };
    } else {
      await prisma.wishlist.create({
        data: { userId, productId },
      });
      return { isWishlisted: true, message: 'Added to Wishlist' };
    }
  }

  /**
   * Check wishlist IDs array for user
   */
  static async getUserWishlistIds(userId: string): Promise<string[]> {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });
    return items.map((i) => i.productId);
  }
}
