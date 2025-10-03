import { User, Session } from '@prisma/client';
import prisma from '../lib/prisma';
import { generateToken, comparePassword, hashPassword, generateSessionToken } from '../utils/auth';
import { createUser, findUserByEmail, findUserById, CreateUserData } from './user.service';

export interface LoginData {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  sessionToken: string;
  expiresIn: string;
}

export const register = async (data: CreateUserData): Promise<AuthResponse> => {
  // ตรวจสอบว่าอีเมลหรือ username ซ้ำหรือไม่
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
    }
    if (existingUser.username === data.username) {
      throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
    }
  }

  const user = await createUser(data);
  
  // สร้าง session สำหรับ register ด้วย
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt,
      lastActivity: new Date(),
    },
  });

  const token = generateToken(user);

  // ลบ password ออกจาก response
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    sessionToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  if (!user.isActive) {
    throw new Error('บัญชีของคุณถูกระงับ');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  // สร้าง session - ตั้งให้หมดอายุใน 30 นาที
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      lastActivity: new Date(), // เพิ่ม field สำหรับ track activity
    },
  });

  const token = generateToken(user);

  // ลบ password ออกจาก response
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    sessionToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
};

export const logout = async (userId: string, sessionToken?: string): Promise<void> => {
  if (sessionToken) {
    // ลบ session เฉพาะ
    await prisma.session.deleteMany({
      where: {
        userId,
        token: sessionToken,
      },
    });
  } else {
    // ลบ session ทั้งหมดของ user
    await prisma.session.deleteMany({
      where: { userId },
    });
  }
};

export const refreshToken = async (userId: string): Promise<string> => {
  const user = await findUserById(userId);

  if (!user || !user.isActive) {
    throw new Error('ผู้ใช้ไม่มีอยู่หรือถูกระงับ');
  }

  return generateToken(user);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    throw new Error('ไม่พบผู้ใช้');
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  // ลบ session ทั้งหมดเพื่อให้ login ใหม่
  await prisma.session.deleteMany({
    where: { userId },
  });
};

export const getUserSessions = async (userId: string): Promise<Session[]> => {
  return prisma.session.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const revokeSession = async (userId: string, sessionId: string): Promise<void> => {
  await prisma.session.deleteMany({
    where: {
      id: sessionId,
      userId,
    },
  });
};

// สำหรับ backward compatibility
export const AuthService = {
  register,
  login,
  logout,
  refreshToken,
  changePassword,
  getUserSessions,
  revokeSession,
};