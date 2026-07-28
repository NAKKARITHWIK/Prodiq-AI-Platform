export interface AdminAnalyticsResponse {
  totalUsers: number;
  totalProducts: number;
  totalComparisons: number;
  totalSavedReports: number;
  totalAIRequests: number;
  recentEvents: any[];
  topSearchedCategories: { category: string; count: number }[];
}
