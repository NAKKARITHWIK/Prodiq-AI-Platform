import prisma from './prisma';
import { UpdateProfileDTO } from '../types/profile';

export class ProfileService {
  /**
   * Get or initialize default user preference profile
   */
  static async getProfile(userId: string) {
    let pref = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.userPreference.create({
        data: {
          userId,
          profileType: 'DEVELOPER',
          maxPrice: 150000,
          primaryPriority: 'performance',
          minRamGb: 16,
        },
      });
    }

    return pref;
  }

  /**
   * Update user preference profile
   */
  static async updateProfile(userId: string, dto: UpdateProfileDTO) {
    const existing = await this.getProfile(userId);

    const updated = await prisma.userPreference.update({
      where: { id: existing.id },
      data: {
        ...(dto.profileType && { profileType: dto.profileType }),
        ...(dto.maxPrice !== undefined && { maxPrice: dto.maxPrice }),
        ...(dto.primaryPriority && { primaryPriority: dto.primaryPriority }),
        ...(dto.minRamGb !== undefined && { minRamGb: dto.minRamGb }),
      },
    });

    return updated;
  }
}
