import Cookies from "js-cookie";
import {
  ApiResponse,
  House,
  User,
  LoginForm,
  RegisterApiData,
  HouseSearchFilters,
  PaginationParams,
  PaginatedResponse,
  ApiError,
} from "@/types";
import { apiCache } from "./cache";

// Get API base URL - use environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1/api";

// Dynamic API URL resolver for client-side requests
const getApiUrl = (endpoint: string) => {
  // If we're on the client and not using localhost, use current hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const url = `http://${hostname}:4000/v1/api${endpoint}`;
      console.log('Using network API URL:', url);
      return url;
    }
  }
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Using default API URL:', url);
  return url;
};

// Fetch wrapper with auth and error handling
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = Cookies.get("token");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    // Add timeout for better error handling
    signal: AbortSignal.timeout(10000), // 10 second timeout
  };

  try {
    const response = await fetch(getApiUrl(endpoint), config);

    // Handle 401 unauthorized
    if (response.status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    // Handle network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      }
    }
    throw error;
  }
};



// Request deduplication
const pendingRequests = new Map<string, Promise<unknown>>();

const deduplicateRequest = async <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
  const existingRequest = pendingRequests.get(key);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise as Promise<unknown>);
  return promise;
};



// Auth API
export const authApi = {
  login: async (
    data: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Login API Error:", apiError);
      throw apiError;
    }
  },

  register: async (
    data: RegisterApiData
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Register API Error:", apiError);
      throw error;
    }
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiRequest("/auth/logout", {
        method: "POST",
      });

      const result = await response.json();
      return result;
    } catch (error: unknown) {
      console.error("Logout API Error:", error);
      return { success: true }; // Allow logout even if API fails
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiRequest("/users/profile");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถโหลดโปรไฟล์ได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Profile API Error:", apiError);
      throw error;
    }
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      console.error("Change Password API Error:", error);
      throw error;
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await apiRequest("/auth/refresh-token", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "รีเฟรช token ไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      console.error("Refresh Token API Error:", error);
      throw error;
    }
  },
};

// Houses API
export const housesApi = {
  getHouses: async (
    filters?: HouseSearchFilters & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<House>>> => {
    // Create cache key from filters
    const cacheKey = `houses-${JSON.stringify(filters || {})}`;
    
    // Skip cache if _t parameter is present (force refresh)
    const shouldSkipCache = filters && '_t' in filters;
    const cached = shouldSkipCache ? null : apiCache.get<ApiResponse<PaginatedResponse<House>>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await apiRequest(`/houses?${queryParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถโหลดข้อมูลบ้านได้");
      }

      // Cache successful response for 30 seconds
      apiCache.set(cacheKey, result, 30000);
      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Houses API Error:", apiError);
      throw error;
    }
  },

  getHouse: async (id: string): Promise<ApiResponse<House>> => {
    try {
      const response = await apiRequest(`/houses/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่พบข้อมูลบ้าน");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("House API Error:", apiError);
      throw error;
    }
  },

  createHouse: async (data: Omit<House, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'owner' | 'ownerId'>): Promise<ApiResponse<House>> => {
    try {
      const token = Cookies.get("token");
      
      const response = await fetch(getApiUrl('/houses'), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || "ลงประกาศไม่สำเร็จ") as ApiError;
        error.response = { data: result };
        throw error;
      }

      return result;
    } catch (error: unknown) {
      console.error("Create House API Error:", error);
      throw error;
    }
  },

  updateHouse: async (
    id: string,
    data: Partial<Omit<House, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'owner' | 'ownerId'>>
  ): Promise<ApiResponse<House>> => {
    try {
      const token = Cookies.get("token");
      
      const response = await fetch(getApiUrl(`/houses/${id}`), {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || "อัพเดทข้อมูลไม่สำเร็จ") as ApiError;
        error.response = { data: result };
        throw error;
      }

      // Clear all house-related cache after successful update
      const cacheKeys = Array.from(apiCache.keys()).filter(key => 
        key.startsWith('houses-') || key === 'featured-houses'
      );
      cacheKeys.forEach(key => apiCache.delete(key));

      return result;
    } catch (error: unknown) {
      console.error("Update House API Error:", error);
      throw error;
    }
  },

  deleteHouse: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiRequest(`/houses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ลบข้อมูลไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      console.error("Delete House API Error:", error);
      throw error;
    }
  },

  getFeaturedHouses: async (): Promise<ApiResponse<House[]>> => {
    const cacheKey = 'featured-houses';
    
    return deduplicateRequest(cacheKey, async () => {
      const cached = apiCache.get<ApiResponse<House[]>>(cacheKey);
      if (cached) {
        return cached;
      }

      try {
        const response = await apiRequest("/houses/featured");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "ไม่สามารถโหลดบ้านแนะนำได้");
        }

        // Cache for 2 minutes
        apiCache.set(cacheKey, result, 120000);
        return result;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Featured Houses API Error:", apiError);
        throw error;
      }
    });
  },

  incrementHouseViewCount: async (houseId: string): Promise<ApiResponse<{ viewCount: number }>> => {
    try {
      const response = await apiRequest(`/houses/${houseId}/view`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถเพิ่มจำนวนการเข้าชมได้");
      }

      // Clear houses cache to force refresh
      const cacheKeys = Array.from(apiCache.keys()).filter(key => key.startsWith('houses-'));
      cacheKeys.forEach(key => apiCache.delete(key));

      return result;
    } catch (error: unknown) {
      console.error("Increment View Count API Error:", error);
      throw error;
    }
  },
};
// Users API (Admin)
export const usersApi = {
  getAllUsers: async (
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<ApiResponse<{ users: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiRequest(`/users?${queryParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Get All Users API Error:", apiError);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiRequest(`/users/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่พบข้อมูลผู้ใช้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Get User API Error:", apiError);
      throw error;
    }
  },

  toggleUserStatus: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiRequest(`/users/${id}/toggle-status`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถเปลี่ยนสถานะผู้ใช้ได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Toggle User Status API Error:", apiError);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiRequest(`/users/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถลบผู้ใช้ได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Delete User API Error:", apiError);
      throw error;
    }
  },

  updateUser: async (id: string, data: { firstName?: string; lastName?: string; role?: string }): Promise<ApiResponse<User>> => {
    try {
      const response = await apiRequest(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Update User API Error:", apiError);
      throw error;
    }
  },
};

// Settings API
export const settingsApi = {
  getSettings: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    try {
      const response = await apiRequest("/settings");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถโหลดการตั้งค่าได้");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Settings API Error:", apiError);
      throw error;
    }
  },

  updateSettings: async (data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    try {
      const response = await apiRequest("/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "บันทึกการตั้งค่าไม่สำเร็จ");
      }

      return result;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Update Settings API Error:", apiError);
      throw error;
    }
  },
};