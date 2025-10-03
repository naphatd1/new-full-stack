import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { housesApi } from '@/lib/api'
import { House, HouseSearchFilters, PaginationParams, HouseType } from '@/types'
import toast from 'react-hot-toast'

// Create house data interface
export interface CreateHouseData {
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  landArea?: number;
  parkingSpaces: number; // จำนวนที่จอดรถ
  houseType: HouseType;
  badges?: string[];
  status: 'AVAILABLE';
}

// Get houses with filters and pagination
export const useHouses = (filters?: HouseSearchFilters & PaginationParams) => {
  return useQuery({
    queryKey: ['houses', filters],
    queryFn: async () => {
      const response = await housesApi.getHouses(filters)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch houses')
    },
    staleTime: 5 * 1000, // 5 seconds
  })
}

// Get infinite houses for pagination
export const useInfiniteHouses = (filters?: HouseSearchFilters) => {
  return useInfiniteQuery({
    queryKey: ['houses', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await housesApi.getHouses({ ...filters, page: pageParam })
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch houses')
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 1000, // 5 seconds
  })
}

// Get single house
export const useHouse = (id: string) => {
  return useQuery({
    queryKey: ['house', id],
    queryFn: async () => {
      const response = await housesApi.getHouse(id)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch house')
    },
    enabled: !!id,
    staleTime: 10 * 1000, // 10 seconds - shorter for better data freshness
  })
}

// Get featured houses
export const useFeaturedHouses = () => {
  return useQuery({
    queryKey: ['houses', 'featured'],
    queryFn: async () => {
      const response = await housesApi.getFeaturedHouses()
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch featured houses')
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Create house mutation
export const useCreateHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateHouseData) => {
      const response = await housesApi.createHouse(data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to create house')
    },
    onSuccess: () => {
      // Invalidate houses queries
      queryClient.invalidateQueries({ queryKey: ['houses'] })
      toast.success('ลงประกาศสำเร็จ')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'ลงประกาศไม่สำเร็จ')
    },
  })
}

// Update house mutation
export const useUpdateHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string
      data: Partial<Omit<House, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'owner' | 'ownerId'>>
    }) => {
      const response = await housesApi.updateHouse(id, data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to update house')
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['houses'] })
      queryClient.invalidateQueries({ queryKey: ['house', data.id] })
      toast.success('อัพเดทข้อมูลสำเร็จ')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'อัพเดทข้อมูลไม่สำเร็จ')
    },
  })
}

// Delete house mutation
export const useDeleteHouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await housesApi.deleteHouse(id)
      if (response.success) {
        return response
      }
      throw new Error('Failed to delete house')
    },
    onSuccess: () => {
      // Invalidate houses queries
      queryClient.invalidateQueries({ queryKey: ['houses'] })
      toast.success('ลบข้อมูลสำเร็จ')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'ลบข้อมูลไม่สำเร็จ')
    },
  })
}

// Get user's houses
export const useMyHouses = () => {
  return useQuery({
    queryKey: ['houses', 'my'],
    queryFn: async () => {
      // This would need to be implemented in the API
      // For now, we'll use the regular houses endpoint with user filter
      const response = await housesApi.getHouses({ /* user filter would go here */ })
      if (response.success && response.data) {
        return response.data.data // Return just the houses array
      }
      throw new Error('Failed to fetch my houses')
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}
// Increment house view count mutation
export const useIncrementViewCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (houseId: string) => {
      const response = await housesApi.incrementHouseViewCount(houseId)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to increment view count')
    },
    onSuccess: (data, houseId) => {
      // Update the view count in cache without refetching
      queryClient.setQueryData(['house', houseId], (oldData: House | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            viewCount: data.viewCount
          }
        }
        return oldData
      })
      
      // Only invalidate houses list (not the current house detail)
      queryClient.invalidateQueries({ queryKey: ['houses'] })
      queryClient.invalidateQueries({ queryKey: ['houses', 'featured'] })
    },
    onError: (error: Error) => {
      console.error('Failed to increment view count:', error)
    },
  })
}