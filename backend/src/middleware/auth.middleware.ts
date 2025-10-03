import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'ไม่พบ Access Token',
      });
      return;
    }

    const token = authHeader.substring(7);
    const sessionToken = req.headers['x-session-token'] as string;
    
    try {
      const payload: JWTPayload = verifyToken(token);
      
      // ตรวจสอบว่า user ยังมีอยู่ในระบบ
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'ผู้ใช้ไม่มีอยู่หรือถูกระงับ',
        });
        return;
      }

      // ตรวจสอบ session ถ้ามี session token
      if (sessionToken) {
        const session = await prisma.session.findFirst({
          where: {
            userId: user.id,
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!session) {
          res.status(401).json({
            success: false,
            message: 'Session หมดอายุหรือไม่ถูกต้อง',
          });
          return;
        }

        // ตรวจสอบว่า session ไม่ได้ใช้งานเกิน 30 นาที
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (session.lastActivity < thirtyMinutesAgo) {
          // ลบ session ที่หมดอายุ
          await prisma.session.delete({
            where: { id: session.id },
          });

          res.status(401).json({
            success: false,
            message: 'Session หมดอายุเนื่องจากไม่ได้ใช้งาน',
          });
          return;
        }
      }

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Token ไม่ถูกต้องหรือหมดอายุ',
      });
      return;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
    });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'ไม่ได้รับอนุญาต',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง',
      });
      return;
    }

    next();
  };
};