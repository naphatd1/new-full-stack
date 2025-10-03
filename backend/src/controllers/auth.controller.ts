import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { register, login, logout, refreshToken, changePassword, getUserSessions, revokeSession } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../lib/prisma';

export const registerController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { email, username, password, firstName, lastName, role } = req.body;

  try {
    const result = await register({
      email,
      username,
      password,
      firstName,
      lastName,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('ถูกใช้งานแล้ว')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }
    throw error;
  }
});

export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const result = await login({
      email,
      password,
      userAgent,
      ipAddress,
    });

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes('ไม่ถูกต้อง') || error.message.includes('ถูกระงับ'))) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }
    throw error;
  }
});

export const logoutController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  const sessionToken = req.headers['x-session-token'] as string;
  
  await logout(userId, sessionToken);

  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ',
  });
});

export const refreshTokenController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  try {
    const newToken = await refreshToken(userId);

    res.json({
      success: true,
      message: 'รีเฟรช Token สำเร็จ',
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('ไม่มีอยู่')) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }
    throw error;
  }
});

export const changePasswordController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  try {
    await changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่',
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes('ไม่ถูกต้อง') || error.message.includes('ไม่พบ'))) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    throw error;
  }
});

export const getSessionsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  const sessions = await getUserSessions(userId);

  res.json({
    success: true,
    data: sessions,
  });
});

export const revokeSessionController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  const { sessionId } = req.params;

  await revokeSession(userId, sessionId);

  res.json({
    success: true,
    message: 'ยกเลิก Session สำเร็จ',
  });
});

export const getMeController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  // Get full user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'ไม่พบผู้ใช้',
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

// สำหรับ backward compatibility
export const AuthController = {
  register: registerController,
  login: loginController,
  logout: logoutController,
  refreshToken: refreshTokenController,
  changePassword: changePasswordController,
  getSessions: getSessionsController,
  revokeSession: revokeSessionController,
  getMe: getMeController,
};