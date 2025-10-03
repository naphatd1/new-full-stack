import { User, Profile, Prisma, Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { hashPassword } from '../utils/auth';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  role?: Role;
}

export interface UpdateProfileData {
  bio?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  
  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'USER', // Default เป็น USER ถ้าไม่ระบุ
      profile: {
        create: {},
      },
    },
    include: {
      profile: true,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
    },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
    include: {
      profile: true,
    },
  });
};

export const updateProfile = async (userId: string, data: UpdateProfileData): Promise<Profile> => {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  });
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ users: User[]; total: number; totalPages: number }> => {
  const skip = (page - 1) * limit;
  
  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!user) {
    throw new Error('ไม่พบผู้ใช้');
  }

  return prisma.user.update({
    where: { id },
    data: {
      isActive: !user.isActive,
    },
    include: {
      profile: true,
    },
  });
};

// สำหรับ backward compatibility
export const UserService = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  updateProfile,
  deleteUser,
  getAllUsers,
  toggleUserStatus,
};