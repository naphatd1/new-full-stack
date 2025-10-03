import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

// Types
interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: 'SALE' | 'RENT'
  status: 'AVAILABLE' | 'SOLD' | 'RENTED'
  images: string[]
  createdAt: string
  updatedAt: string
}

interface CreatePropertyData {
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: 'SALE' | 'RENT'
  images?: string[]
}

// API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const fetchProperties = async (): Promise<Property[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties`)
  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }
  return response.json()
}

const fetchProperty = async (id: string): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }
  return response.json()
}

const createProperty = async (data: CreatePropertyData): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create property')
  }
  return response.json()
}

const updateProperty = async ({ id, data }: { id: string; data: Partial<CreatePropertyData> }): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update property')
  }
  return response.json()
}

const deleteProperty = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete property')
  }
}

// React Query hooks
export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })
}

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id),
    enabled: !!id,
  })
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create property')
    },
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProperty,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', data.id] })
      toast.success('Property updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update property')
    },
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete property')
    },
  })
}