import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    return false;
  }
};

export const generateToken = (user: Pick<User, 'id' | 'email' | 'role'>): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const generateSessionToken = (): string => {
  return jwt.sign(
    { type: 'session', timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

// สำหรับ backward compatibility
export const AuthUtils = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateSessionToken,
};