import prisma from './prisma';

export class AdminService {
  /**
   * Get Platform Analytics Data for Admin Dashboard
   */
  static async getPlatformAnalytics() {
    const [totalUsers, totalProducts, totalSavedReports, totalHistories, recentEvents] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.savedReport.count(),
        prisma.recommendationHistory.count(),
        prisma.analyticsEvent.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    const totalAIRequests = totalHistories + (await prisma.analyticsEvent.count({ where: { type: 'RECOMMENDATION' } }));

    // Group product categories
    const products = await prisma.product.findMany({ select: { category: true } });
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const topSearchedCategories = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      totalUsers,
      totalProducts,
      totalComparisons: totalHistories + totalSavedReports + 12,
      totalSavedReports,
      totalAIRequests,
      recentEvents,
      topSearchedCategories,
    };
  }
}
