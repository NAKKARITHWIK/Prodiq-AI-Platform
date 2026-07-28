import { Response, NextFunction } from 'express';
import prisma from '../services/prisma';
import { AuthenticatedRequest } from '../types/auth';

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin permissions required' });
  }

  next();
};
