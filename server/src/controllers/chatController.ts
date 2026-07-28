import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ChatService } from '../services/chatService';

export class ChatController {
  /**
   * POST /api/chat
   */
  static async handleChat(req: AuthenticatedRequest, res: Response) {
    try {
      const { message, history, contextProduct1Id, contextProduct2Id } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Validation Error', message: 'Message parameter is required' });
      }

      const userId = req.user ? req.user.id : undefined;
      const result = await ChatService.handleChat(userId, { message, history, contextProduct1Id, contextProduct2Id });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Chat Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to process chat request' });
    }
  }
}
