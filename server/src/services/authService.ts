import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { config } from '../config/environment';
import { RegisterDTO, LoginDTO, UserPayload, AuthResponse } from '../types/auth';

export class AuthService {
  /**
   * Hashes plain text password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares raw password against bcrypt hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generates a signed JWT token containing user id and email
   */
  static generateToken(user: UserPayload): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );
  }

  /**
   * Registers a new user account
   */
  static async register(dto: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        password: hashedPassword,
        name: dto.name.trim(),
      },
    });

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.generateToken(userPayload);

    return {
      message: 'User registered successfully',
      user: userPayload,
      token,
    };
  }

  /**
   * Authenticates user login credentials
   */
  static async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await this.comparePassword(dto.password, user.password);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.generateToken(userPayload);

    return {
      message: 'Login successful',
      user: userPayload,
      token,
    };
  }

  /**
   * Fetches user profile by ID
   */
  static async getUserById(id: string): Promise<UserPayload | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return user;
  }
}
