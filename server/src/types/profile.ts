export interface UpdateProfileDTO {
  profileType?: 'DEVELOPER' | 'GAMER' | 'STUDENT' | 'BUDGET';
  maxPrice?: number;
  primaryPriority?: 'performance' | 'battery' | 'display' | 'price';
  minRamGb?: number;
}

export interface UserPreferenceResponse {
  id: string;
  userId: string;
  profileType: string;
  maxPrice: number;
  primaryPriority: string;
  minRamGb: number;
}
