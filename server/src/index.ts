import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/environment';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import productRoutes from './routes/productRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import visionRoutes from './routes/visionRoutes';
import reportRoutes from './routes/reportRoutes';
import chatRoutes from './routes/chatRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import historyRoutes from './routes/historyRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'ProdIQ AI Platform v1.1 Full Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Boot Server
app.listen(config.port, () => {
  console.log(`🚀 ProdIQ Express API Server v1.1 running on port ${config.port}`);
  console.log(`📡 Health Check endpoint available at http://localhost:${config.port}/api/health`);
});
