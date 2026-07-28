import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ProfileService } from '../services/profileService';

export class ProfileController {
  /**
   * GET /api/user/profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User token missing' });
      }

      const profile = await ProfileService.getProfile(req.user.id);
      return res.status(200).json({ profile });
    } catch (error: any) {
      console.error('GetProfile Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to fetch user preferences' });
    }
  }

  /**
   * PUT /api/user/profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User token missing' });
      }

      const { profileType, maxPrice, primaryPriority, minRamGb } = req.body;
      const updated = await ProfileService.updateProfile(req.user.id, {
        profileType,
        maxPrice,
        primaryPriority,
        minRamGb,
      });

      return res.status(200).json({ message: 'Profile updated successfully', profile: updated });
    } catch (error: any) {
      console.error('UpdateProfile Error:', error);
      return res.status(500).json({ error: 'Internal Error', message: 'Failed to update user preferences' });
    }
  }
}
