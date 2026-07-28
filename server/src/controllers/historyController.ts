import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { HistoryService } from '../services/historyService';

export class HistoryController {
  static async getUserHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const search = req.query.q as string | undefined;
      const history = await HistoryService.getUserHistory(req.user.id, search);
      return res.status(200).json({ history });
    } catch (error: any) {
      console.error('History error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch recommendation history' });
    }
  }

  static async saveHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { product1Id, product2Id, resultJson } = req.body;
      const entry = await HistoryService.saveHistory(req.user.id, { product1Id, product2Id, resultJson });
      return res.status(201).json({ entry });
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal Error' });
    }
  }

  static async deleteHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const result = await HistoryService.deleteHistory(req.user.id, id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal Error' });
    }
  }
}
