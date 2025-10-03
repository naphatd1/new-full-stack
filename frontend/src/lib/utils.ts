import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { HouseType } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHouseTypeLabel(type: HouseType): string {
  const labels: Record<HouseType, string> = {
    DETACHED_HOUSE: "บ้านเดี่ยว",
    TOWNHOUSE: "ทาวน์เฮ้าส์",
    CONDO: "คอนโดมิเนียม",
    APARTMENT: "อพาร์ทเมนท์",
    COMMERCIAL: "อาคารพาณิชย์",
    LAND: "ที่ดิน",
  }
  
  return labels[type] || type
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatCurrency(price: number): string {
  return formatPrice(price)
}

export function formatArea(area: number | string): string {
  // แปลง Decimal จาก backend เป็น number
  const numArea = typeof area === 'string' ? parseFloat(area) : area;
  
  // ตรวจสอบว่าเป็นจำนวนเต็มหรือใกล้เคียงจำนวนเต็ม
  const rounded = Math.round(numArea);
  const diff = Math.abs(numArea - rounded);
  
  // ถ้าต่างกันน้อยกว่า 0.1 ให้แสดงเป็นจำนวนเต็ม
  if (diff < 0.1) {
    return `${rounded.toLocaleString('th-TH')} ตร.ม.`;
  }
  
  // ถ้าไม่ใช่ ให้แสดงทศนิยม 1 ตำแหน่ง
  return `${numArea.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ตร.ม.`;
}

export function formatLandArea(area: number | string): string {
  // แปลง Decimal จาก backend เป็น number
  const numArea = typeof area === 'string' ? parseFloat(area) : area;
  
  // ตรวจสอบว่าเป็นจำนวนเต็มหรือใกล้เคียงจำนวนเต็ม
  const rounded = Math.round(numArea);
  const diff = Math.abs(numArea - rounded);
  
  // ถ้าต่างกันน้อยกว่า 0.1 ให้แสดงเป็นจำนวนเต็ม
  if (diff < 0.1) {
    return `${rounded.toLocaleString('th-TH')} ตร.ว.`;
  }
  
  // ถ้าไม่ใช่ ให้แสดงทศนิยม 1 ตำแหน่ง
  return `${numArea.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ตร.ว.`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "พร้อมขาย",
    PENDING: "รอการตัดสินใจ",
    SOLD: "ขายแล้ว",
    INACTIVE: "ไม่ได้ใช้งาน",
  }
  
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    SOLD: "bg-red-100 text-red-800",
    INACTIVE: "bg-gray-100 text-gray-800",
  }
  
  return colors[status] || "bg-gray-100 text-gray-800"
}

export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    // Use a data URL for a simple placeholder to avoid Next.js Image issues
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPgogIDxyZWN0IHg9IjUwIiB5PSIxMDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwb2x5Z29uIHBvaW50cz0iNTAsMTAwIDIwMCw1MCAzNTAsMTAwIiBmaWxsPSIjNmI3MjgwIi8+CiAgPHJlY3QgeD0iMTIwIiB5PSIxNTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMzNzQxNTEiLz4KICA8cmVjdCB4PSIyMjAiIHk9IjE1MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjBhNWZhIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkhvdXNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // If it's a data URL, return as is
  if (imagePath.startsWith('data:')) {
    return imagePath
  }
  
  // Get the base URL (without /v1/api)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'
  
  // If it's a path starting with /uploads/, it's served by backend
  if (imagePath.startsWith('/uploads/')) {
    const fullUrl = `${baseUrl}${imagePath}`
    console.log('Image URL generated:', fullUrl) // Debug log
    return fullUrl
  }
  
  // If it's a relative path starting with /, it's a public asset
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // If it's a relative path, prepend the base URL
  return `${baseUrl}/${imagePath.replace(/^\//, '')}`
}

// Error handling utility
export function isApiError(error: unknown): error is { message: string; response?: { data?: { message?: string } } } {
  return typeof error === 'object' && error !== null && 'message' in error
}

export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || defaultMessage
  }
  return defaultMessage
}