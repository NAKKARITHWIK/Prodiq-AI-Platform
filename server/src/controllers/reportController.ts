import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ReportService } from '../services/reportService';

export class ReportController {
  /**
   * POST /api/reports
   */
  static async createReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User token missing' });
      }

      const { title, product1Id, product2Id, notes } = req.body;
      if (!title || !product1Id || !product2Id) {
        return res.status(400).json({ error: 'Validation Error', message: 'Title, product1Id, and product2Id are required' });
      }

      const report = await ReportService.createReport(req.user.id, { title, product1Id, product2Id, notes });
      return res.status(201).json({ message: 'Intelligence report saved successfully', report });
    } catch (error: any) {
      console.error('CreateReport Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to save intelligence report' });
    }
  }

  /**
   * GET /api/reports
   */
  static async getUserReports(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User token missing' });
      }

      const reports = await ReportService.getUserReports(req.user.id);
      return res.status(200).json({ reports });
    } catch (error: any) {
      console.error('GetUserReports Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch saved reports' });
    }
  }

  /**
   * DELETE /api/reports/:id
   */
  static async deleteReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User token missing' });
      }

      const { id } = req.params;
      const result = await ReportService.deleteReport(req.user.id, id);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Not Found', message: 'Report not found' });
      }
      console.error('DeleteReport Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to delete saved report' });
    }
  }
}
