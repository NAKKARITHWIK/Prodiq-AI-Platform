import prisma from './prisma';
import { SaveHistoryDTO } from '../types/history';

export class HistoryService {
  /**
   * Save AI Recommendation to History
   */
  static async saveHistory(userId: string, dto: SaveHistoryDTO) {
    const entry = await prisma.recommendationHistory.create({
      data: {
        userId,
        product1Id: dto.product1Id,
        product2Id: dto.product2Id,
        resultJson: dto.resultJson,
      },
    });

    return entry;
  }

  /**
   * Fetch Recommendation History with search support
   */
  static async getUserHistory(userId: string, search?: string) {
    const histories = await prisma.recommendationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const populated = await Promise.all(
      histories.map(async (h) => {
        const [p1, p2] = await Promise.all([
          prisma.product.findUnique({ where: { id: h.product1Id } }),
          prisma.product.findUnique({ where: { id: h.product2Id } }),
        ]);

        return {
          ...h,
          product1: p1,
          product2: p2,
          result: JSON.parse(h.resultJson || '{}'),
        };
      })
    );

    if (search) {
      const query = search.toLowerCase();
      return populated.filter(
        (item) =>
          item.product1?.title.toLowerCase().includes(query) ||
          item.product2?.title.toLowerCase().includes(query) ||
          item.product1?.brand.toLowerCase().includes(query) ||
          item.product2?.brand.toLowerCase().includes(query)
      );
    }

    return populated;
  }

  /**
   * Delete History item
   */
  static async deleteHistory(userId: string, id: string) {
    await prisma.recommendationHistory.deleteMany({
      where: { id, userId },
    });
    return { message: 'History record deleted' };
  }
}
