export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  profileType: 'DEVELOPER' | 'GAMER' | 'STUDENT' | 'BUDGET';
  maxPrice: number;
  primaryPriority: 'performance' | 'battery' | 'display' | 'price';
  minRamGb: number;
}

export interface ProductSpecs {
  processor?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  display?: string;
  battery?: string;
  weight?: string;
  os?: string;
}

export interface PriceHistoryItem {
  month: string;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  date: string;
}

export interface SellerTrustBreakdown {
  trustScore: number;
  ratingScore: number;
  reviewVolumeScore: number;
  deliveryScore: number;
  priceStabilityScore: number;
  returnPolicyScore: number;
  verificationBonus: number;
  trustTier: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'BASIC';
  explanation: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'LAPTOP' | 'SMARTPHONE' | 'MONITOR' | 'HEADPHONES';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  specsJson: string;
  priceHistoryJson: string;
  sellerName: string;
  sellerRating: number;
  warrantyMonths: number;
  deliveryDays: number;
  offersJson: string;
  reviews?: Review[];
  sellerTrust?: SellerTrustBreakdown;
}

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
  match: {
    matchedProductId: string;
    matchedTitle: string;
    brand: string;
    confidenceScore: number;
    reasoning: string;
  };
  product: Product;
}

export interface SavedReport {
  id: string;
  userId: string;
  title: string;
  product1Id: string;
  product2Id: string;
  notes?: string;
  createdAt: string;
  product1?: Product;
  product2?: Product;
}

export interface RecommendationHistoryEntry {
  id: string;
  userId: string;
  product1Id: string;
  product2Id: string;
  resultJson: string;
  createdAt: string;
  product1?: Product;
  product2?: Product;
  result?: AIRecommendationResult;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalProducts: number;
  totalComparisons: number;
  totalSavedReports: number;
  totalAIRequests: number;
  recentEvents: any[];
  topSearchedCategories: { category: string; count: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface MultiFacetFilterParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  seller?: string;
  processor?: string;
  ram?: string;
  gpu?: string;
  storage?: string;
}
