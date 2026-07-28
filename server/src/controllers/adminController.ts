import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  static async getAnalytics(req: Request, res: Response) {
    try {
      const data = await AdminService.getPlatformAnalytics();
      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Admin Analytics error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch admin analytics' });
    }
  }
}
