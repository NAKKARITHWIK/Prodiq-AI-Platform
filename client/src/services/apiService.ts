import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  Product,
  UserPreference,
  AIRecommendationResult,
  VisionMatchResult,
  SavedReport,
  RecommendationHistoryEntry,
  AdminAnalytics,
  MultiFacetFilterParams,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('prodiq_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized 401 Globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('prodiq_token');
      localStorage.removeItem('prodiq_user');
    }
    return Promise.reject(error);
  }
);

// Abstracted Product API Service Methods
export const productService = {
  getProducts: async (params?: MultiFacetFilterParams) => {
    const res = await api.get<{ products: Product[]; count: number }>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string) => {
    const res = await api.get<{ product: Product; similarProducts: Product[] }>(`/products/${id}`);
    return res.data;
  },
};

// Abstracted User Profile API Service Methods
export const profileService = {
  getProfile: async () => {
    const res = await api.get<{ profile: UserPreference }>('/user/profile');
    return res.data.profile;
  },

  updateProfile: async (data: Partial<UserPreference>) => {
    const res = await api.put<{ message: string; profile: UserPreference }>('/user/profile', data);
    return res.data.profile;
  },
};

// Abstracted Gemini AI Intelligence API Service Methods
export const aiService = {
  getRecommendation: async (product1Id: string, product2Id: string) => {
    const res = await api.post<AIRecommendationResult>('/recommendation', { product1Id, product2Id });
    return res.data;
  },

  identifyProductImage: async (imageBase64: string, mimeType?: string) => {
    const res = await api.post<VisionMatchResult>('/vision', { imageBase64, mimeType });
    return res.data;
  },
};

// Abstracted Saved Reports API Service Methods
export const reportService = {
  createReport: async (data: { title: string; product1Id: string; product2Id: string; notes?: string }) => {
    const res = await api.post<{ message: string; report: SavedReport }>('/reports', data);
    return res.data;
  },

  getUserReports: async () => {
    const res = await api.get<{ reports: SavedReport[] }>('/reports');
    return res.data.reports;
  },

  deleteReport: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/reports/${id}`);
    return res.data;
  },
};

// Abstracted Contextual AI Chat API Service Methods
export const chatService = {
  sendMessage: async (message: string, contextProduct1Id?: string, contextProduct2Id?: string) => {
    const res = await api.post<{ response: string }>('/chat', { message, contextProduct1Id, contextProduct2Id });
    return res.data.response;
  },
};

// Abstracted Wishlist API Service Methods
export const wishlistService = {
  getWishlist: async () => {
    const res = await api.get<{ products: Product[] }>('/wishlist');
    return res.data.products;
  },

  getWishlistIds: async () => {
    const res = await api.get<{ ids: string[] }>('/wishlist/ids');
    return res.data.ids;
  },

  toggleWishlist: async (productId: string) => {
    const res = await api.post<{ isWishlisted: boolean; message: string }>('/wishlist/toggle', { productId });
    return res.data;
  },
};

// Abstracted Recommendation History API Service Methods
export const historyService = {
  getHistory: async (search?: string) => {
    const res = await api.get<{ history: RecommendationHistoryEntry[] }>('/history', { params: { q: search } });
    return res.data.history;
  },

  saveHistory: async (data: { product1Id: string; product2Id: string; resultJson: string }) => {
    const res = await api.post<{ entry: RecommendationHistoryEntry }>('/history', data);
    return res.data.entry;
  },

  deleteHistory: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/history/${id}`);
    return res.data;
  },
};

// Abstracted Admin Analytics API Service Methods
export const adminService = {
  getAnalytics: async () => {
    const res = await api.get<AdminAnalytics>('/admin/analytics');
    return res.data;
  },
};

export default api;
