import { House, HouseImage, HouseType, HouseStatus } from "@prisma/client";
import prisma from "../lib/prisma";

export interface CreateHouseData {
  title: string;
  description?: string;
  price: number; // จำนวนเต็ม (บาท)
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // ทศนิยมได้ (ตารางเมตร)
  landArea?: number; // ทศนิยมได้ (ตารางเมตร)
  parkingSpaces: number; // จำนวนที่จอดรถ
  houseType: HouseType;
  badges?: string[]; // จุดเด่นและสิ่งอำนวยความสะดวก
  ownerId: string;
}

export interface UpdateHouseData {
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  landArea?: number;
  parkingSpaces?: number; // จำนวนที่จอดรถ
  houseType?: HouseType;
  badges?: string[]; // จุดเด่นและสิ่งอำนวยความสะดวก
  status?: HouseStatus;
}

export interface HouseWithImages extends House {
  images: HouseImage[];
  owner: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface HouseFilters {
  city?: string;
  province?: string;
  houseType?: HouseType;
  status?: HouseStatus;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
}

interface PrismaWhereClause {
  city?: {
    contains: string;
    mode: "insensitive";
  };
  province?: {
    contains: string;
    mode: "insensitive";
  };
  houseType?: HouseType;
  status?: HouseStatus;
  price?: {
    gte?: number;
    lte?: number;
  };
  bedrooms?: {
    gte?: number;
    lte?: number;
  };
}

export const createHouse = async (data: CreateHouseData): Promise<House> => {
  return await prisma.house.create({
    data,
  });
};

export const getHouseById = async (
  id: string
): Promise<HouseWithImages | null> => {
  return await prisma.house.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ isMain: "desc" }, { order: "asc" }, { createdAt: "asc" }],
      },
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getHousesByOwner = async (
  ownerId: string
): Promise<HouseWithImages[]> => {
  return await prisma.house.findMany({
    where: { ownerId },
    include: {
      images: {
        orderBy: [{ isMain: "desc" }, { order: "asc" }, { createdAt: "asc" }],
      },
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export interface QueryOptions {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllHouses = async (
  filters?: HouseFilters,
  options?: QueryOptions
): Promise<{ data: HouseWithImages[] }> => {
  const where: PrismaWhereClause = {};

  if (filters) {
    if (filters.city)
      where.city = { contains: filters.city, mode: "insensitive" };
    if (filters.province)
      where.province = { contains: filters.province, mode: "insensitive" };
    if (filters.houseType) where.houseType = filters.houseType;
    if (filters.status) where.status = filters.status;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.minBedrooms || filters.maxBedrooms) {
      where.bedrooms = {};
      if (filters.minBedrooms) where.bedrooms.gte = filters.minBedrooms;
      if (filters.maxBedrooms) where.bedrooms.lte = filters.maxBedrooms;
    }
  }

  let orderBy: any = { createdAt: "desc" };
  if (options?.sortBy && options?.sortOrder) {
    orderBy = { [options.sortBy]: options.sortOrder };
  }

  const houses = await prisma.house.findMany({
    where,
    include: {
      images: {
        orderBy: [{ isMain: "desc" }, { order: "asc" }, { createdAt: "asc" }],
      },
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy,
    ...(options?.limit && { take: options.limit }),
  });

  return { data: houses };
};

export const updateHouse = async (
  id: string,
  data: UpdateHouseData
): Promise<House> => {
  return await prisma.house.update({
    where: { id },
    data,
  });
};

export const deleteHouse = async (id: string): Promise<House> => {
  return await prisma.house.delete({
    where: { id },
  });
};

export const checkHouseOwnership = async (
  houseId: string,
  userId: string
): Promise<boolean> => {
  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: { ownerId: true },
  });

  return house?.ownerId === userId;
};
