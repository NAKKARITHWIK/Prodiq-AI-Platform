import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types/auth';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Name, email, and password are required fields',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Password must be at least 6 characters long',
        });
      }

      const result = await AuthService.register({ email, password, name });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'EMAIL_EXISTS') {
        return res.status(409).json({
          error: 'Conflict Error',
          message: 'An account with this email address already exists',
        });
      }

      console.error('Registration Error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred during user registration',
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Email and password are required',
        });
      }

      const result = await AuthService.login({ email, password });
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password credentials',
        });
      }

      console.error('Login Error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred during user authentication',
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
      }

      const user = await AuthService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Not Found', message: 'User account not found' });
      }

      return res.status(200).json({ user });
    } catch (error: any) {
      console.error('GetMe Error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve authenticated user profile',
      });
    }
  }
}
