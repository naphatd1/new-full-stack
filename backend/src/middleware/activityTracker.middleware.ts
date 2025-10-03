import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from './auth.middleware';

export const activityTracker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ถ้าไม่มี user หรือไม่ใช่ authenticated request ให้ข้ามไป
    if (!req.user) {
      next();
      return;
    }

    const sessionToken = req.headers['x-session-token'] as string;
    
    if (sessionToken) {
      // อัพเดท lastActivity ของ session
      await prisma.session.updateMany({
        where: {
          userId: req.user.id,
          token: sessionToken,
          expiresAt: {
            gt: new Date(), // session ยังไม่หมดอายุ
          },
        },
        data: {
          lastActivity: new Date(),
          // ขยายเวลา session อีก 30 นาที
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });
    }

    next();
  } catch (error) {
    console.error('Activity tracker error:', error);
    // ไม่ให้ error นี้หยุดการทำงานของ API
    next();
  }
};

// Cleanup expired sessions (เรียกใช้เป็นระยะ)
export const cleanupExpiredSessions = async (): Promise<void> => {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};