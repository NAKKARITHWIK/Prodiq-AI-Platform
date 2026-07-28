export interface ReviewSummary {
  pros: string[];
  cons: string[];
}

export interface AIRecommendationResult {
  overallWinnerId: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'VERY_HIGH';
  whyRankedFirst: string;
  majorStrengths: string[];
  weaknesses: string[];
  tradeOffs: string[];
  bestSuitedUserType: string;
  reviewSummary1: ReviewSummary;
  reviewSummary2: ReviewSummary;
}

export interface VisionMatchResult {
  matchedProductId: string;
  matchedTitle: string;
  brand: string;
  confidenceScore: number;
  reasoning: string;
}
