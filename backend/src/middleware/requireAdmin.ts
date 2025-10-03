import { Request, Response, NextFunction } from 'express';
import { getThaiTimestamp } from './timestamp';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    username: string;
  };
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'กรุณาเข้าสู่ระบบก่อน',
        timestamp: getThaiTimestamp()
      });
      return;
    }

    if (user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
        timestamp: getThaiTimestamp()
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
      timestamp: getThaiTimestamp()
    });
  }
};