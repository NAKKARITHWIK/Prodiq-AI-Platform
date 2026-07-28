import prisma from './prisma';
import { CreateReportDTO } from '../types/report';

export class ReportService {
  /**
   * Save a new intelligence report
   */
  static async createReport(userId: string, dto: CreateReportDTO) {
    const report = await prisma.savedReport.create({
      data: {
        userId,
        title: dto.title,
        product1Id: dto.product1Id,
        product2Id: dto.product2Id,
        notes: dto.notes || '',
      },
    });

    return report;
  }

  /**
   * Get user's saved intelligence reports
   */
  static async getUserReports(userId: string) {
    const reports = await prisma.savedReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Populate product details for each report
    const populated = await Promise.all(
      reports.map(async (r) => {
        const [p1, p2] = await Promise.all([
          prisma.product.findUnique({ where: { id: r.product1Id } }),
          prisma.product.findUnique({ where: { id: r.product2Id } }),
        ]);

        return {
          ...r,
          product1: p1,
          product2: p2,
        };
      })
    );

    return populated;
  }

  /**
   * Delete saved report
   */
  static async deleteReport(userId: string, reportId: string) {
    const existing = await prisma.savedReport.findFirst({
      where: { id: reportId, userId },
    });

    if (!existing) {
      throw new Error('NOT_FOUND');
    }

    await prisma.savedReport.delete({
      where: { id: reportId },
    });

    return { message: 'Report deleted successfully' };
  }
}
