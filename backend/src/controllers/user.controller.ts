import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findUserById, updateUser, updateProfile, getAllUsers, toggleUserStatus, deleteUser } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler';

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  const user = await findUserById(userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'ไม่พบผู้ใช้',
    });
    return;
  }

  // ลบ password ออกจาก response
  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword,
  });
});

export const updateProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

  const { firstName, lastName, bio, phone, dateOfBirth, address, city, country } = req.body;

  // อัปเดตข้อมูล user
  const updatedUser = await updateUser(userId, {
    firstName,
    lastName,
  });

  // อัปเดตข้อมูล profile
  const updatedProfile = await updateProfile(userId, {
    bio,
    phone,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    address,
    city,
    country,
  });

  res.json({
    success: true,
    message: 'อัปเดตโปรไฟล์สำเร็จ',
    data: {
      ...updatedUser,
      profile: updatedProfile,
    },
  });
});

export const getUserByIdController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { id } = req.params;
  const user = await findUserById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'ไม่พบผู้ใช้',
    });
    return;
  }

  // ลบ password ออกจาก response
  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword,
  });
});

export const getAllUsersController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const result = await getAllUsers(page, limit, search);

  // ลบ password ออกจาก response
  const usersWithoutPassword = result.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({
    success: true,
    data: {
      users: usersWithoutPassword,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
});

export const toggleUserStatusController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { id } = req.params;
  
  try {
    const user = await toggleUserStatus(id);

    // ลบ password ออกจาก response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: `${user.isActive ? 'เปิดใช้งาน' : 'ระงับ'}บัญชีผู้ใช้สำเร็จ`,
      data: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'ไม่พบผู้ใช้') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    throw error;
  }
});

export const updateUserController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { id } = req.params;
  const { firstName, lastName, role } = req.body;

  // ตรวจสอบว่า user มีอยู่หรือไม่
  const existingUser = await findUserById(id);
  if (!existingUser) {
    res.status(404).json({
      success: false,
      message: 'ไม่พบผู้ใช้',
    });
    return;
  }

  // อัปเดตข้อมูล user
  const updatedUser = await updateUser(id, {
    firstName,
    lastName,
    ...(role && { role }),
  });

  // ลบ password ออกจาก response
  const { password, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
    data: userWithoutPassword,
  });
});

export const deleteUserController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const { id } = req.params;
  
  // ตรวจสอบว่า user มีอยู่หรือไม่
  const user = await findUserById(id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'ไม่พบผู้ใช้',
    });
    return;
  }

  await deleteUser(id);

  res.json({
    success: true,
    message: 'ลบผู้ใช้สำเร็จ',
  });
});

// สำหรับ backward compatibility
export const UserController = {
  getProfile,
  updateProfile: updateProfileController,
  getUserById: getUserByIdController,
  getAllUsers: getAllUsersController,
  toggleUserStatus: toggleUserStatusController,
  updateUser: updateUserController,
  deleteUser: deleteUserController,
};