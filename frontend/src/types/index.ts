// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Error Types
export interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Array<{
        path?: string;
        param?: string;
        msg?: string;
        message?: string;
      }>;
    };
    status?: number;
  };
}

// Registration Data Type
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'AGENT';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

// House Types
export interface House {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  bedrooms: number;
  bathrooms: number;
  area: number | string; // รองรับ Decimal จาก backend
  landArea?: number | string; // รองรับ Decimal จาก backend
  parkingSpaces: number; // จำนวนที่จอดรถ
  houseType: HouseType;
  badges?: string[]; // จุดเด่นและสิ่งอำนวยความสะดวก
  status: HouseStatus;
  viewCount?: number;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  images: HouseImage[];
}

export interface HouseImage {
  id: string;
  houseId: string;
  filename: string;
  originalName: string;
  path: string;
  url?: string;
  size: number;
  mimetype: string;
  width?: number;
  height?: number;
  isMain: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type HouseType = 
  | 'DETACHED_HOUSE'
  | 'TOWNHOUSE'
  | 'CONDO'
  | 'APARTMENT'
  | 'COMMERCIAL'
  | 'LAND';

export type HouseStatus = 
  | 'AVAILABLE'
  | 'PENDING'
  | 'SOLD'
  | 'INACTIVE';

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterApiData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface HouseSearchFilters {
  city?: string;
  province?: string;
  houseType?: HouseType;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  status?: HouseStatus;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}