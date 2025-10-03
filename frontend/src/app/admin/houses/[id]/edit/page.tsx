'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HouseType, HouseStatus } from '@/types'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { housesApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface HouseFormData {
  title: string
  description: string
  price: string
  address: string
  city: string
  province: string
  postalCode: string
  bedrooms: string
  bathrooms: string
  area: string
  landArea: string
  parkingSpaces: string
  houseType: HouseType
  status: string
}

export default function EditHousePage() {
  const router = useRouter()
  const params = useParams()
  const houseId = params.id as string
  const { isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState<HouseFormData>({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    landArea: '',
    parkingSpaces: '',
    houseType: 'DETACHED_HOUSE',
    status: 'AVAILABLE'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const houseTypes = [
    { value: 'DETACHED_HOUSE', label: 'บ้านเดี่ยว' },
    { value: 'TOWNHOUSE', label: 'ทาวน์เฮ้าส์' },
    { value: 'CONDO', label: 'คอนโดมิเนียม' },
    { value: 'APARTMENT', label: 'อพาร์ทเมนท์' },
    { value: 'COMMERCIAL', label: 'อาคารพาณิชย์' },
    { value: 'LAND', label: 'ที่ดิน' }
  ]

  const statusOptions = [
    { value: 'AVAILABLE', label: 'เปิดขาย' },
    { value: 'PENDING', label: 'รอตรวจสอบ' },
    { value: 'SOLD', label: 'ขายแล้ว' },
    { value: 'INACTIVE', label: 'ปิดขาย' }
  ]

  const provinces = [
    'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
    'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย',
    'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา',
    'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์',
    'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา',
    'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต', 'มหาสารคาม',
    'มุกดาหาร', 'แม่ฮ่องสอน', 'ยะลา', 'ยโสธร', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
    'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
    'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
    'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี',
    'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
  ]

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch house data
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true)
        const response = await housesApi.getHouse(houseId)
        if (response.success && response.data) {
          const house = response.data
          setFormData({
            title: house.title || '',
            description: house.description || '',
            price: house.price?.toString() || '',
            address: house.address || '',
            city: house.city || '',
            province: house.province || '',
            postalCode: house.postalCode || '',
            bedrooms: house.bedrooms?.toString() || '',
            bathrooms: house.bathrooms?.toString() || '',
            area: house.area?.toString() || '',
            landArea: house.landArea?.toString() || '',
            parkingSpaces: house.parkingSpaces?.toString() || '',
            houseType: house.houseType || 'DETACHED_HOUSE',
            status: house.status || 'AVAILABLE'
          })
        }
      } catch (error) {
        console.error('Failed to fetch house:', error)
        toast.error('ไม่สามารถโหลดข้อมูลบ้านได้')
        router.push('/admin/houses')
      } finally {
        setLoading(false)
      }
    }

    if (houseId) {
      fetchHouse()
    }
  }, [houseId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for price field
    if (name === 'price') {
      // Remove all non-digits
      const numericValue = value.replace(/[^\d]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Prepare house data
      const houseData = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        price: formData.price ? parseInt(formData.price) : 0,
        address: formData.address || undefined,
        city: formData.city || undefined,
        province: formData.province || undefined,
        postalCode: formData.postalCode || undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? Number(formData.area) : 0,
        landArea: formData.landArea ? Number(formData.landArea) : undefined,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : 0,
        houseType: formData.houseType,
        status: formData.status as HouseStatus,
      }

      const response = await housesApi.updateHouse(houseId, houseData)
      
      if (response.success) {
        toast.success('อัพเดทข้อมูลบ้านสำเร็จ')
        router.push('/admin/houses')
      } else {
        throw new Error('Update failed')
      }
      
    } catch (err) {
      console.error('Update house error:', err)
      setError('เกิดข้อผิดพลาดในการอัพเดทข้อมูล')
      toast.error('เกิดข้อผิดพลาดในการอัพเดทข้อมูล')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center">
          <p>กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/houses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">แก้ไขข้อมูลบ้าน</h1>
            <p className="text-gray-600 dark:text-gray-400">แก้ไขข้อมูลบ้านในระบบ</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
            <CardDescription>แก้ไขข้อมูลพื้นฐานของบ้าน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  ชื่อบ้าน
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="เช่น บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="houseType" className="block text-sm font-medium mb-2">
                  ประเภทบ้าน
                </label>
                <select
                  id="houseType"
                  name="houseType"
                  value={formData.houseType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {houseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  ราคา (บาท)
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price ? parseInt(formData.price).toLocaleString() : ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  สถานะ
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                รายละเอียด
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="อธิบายรายละเอียดของบ้าน เช่น สิ่งอำนวยความสะดวก ความพิเศษ ฯลฯ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>ที่อยู่</CardTitle>
            <CardDescription>ระบุที่อยู่ของบ้าน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                ที่อยู่
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="เลขที่ ซอย ถนน แขวง/ตำบล"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  เขต/อำเภอ
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="เช่น วัฒนา"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium mb-2">
                  จังหวัด
                </label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                  รหัสไปรษณีย์
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  pattern="[0-9]{5}"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="10110"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดทรัพย์สิน</CardTitle>
            <CardDescription>ข้อมูลเกี่ยวกับขนาดและจำนวนห้อง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">
                  ห้องนอน
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium mb-2">
                  ห้องน้ำ
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium mb-2">
                  พื้นที่ใช้สอย (ตร.ม.)
                </label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="landArea" className="block text-sm font-medium mb-2">
                  ขนาดที่ดิน (ตร.ว.)
                </label>
                <input
                  id="landArea"
                  name="landArea"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="parkingSpaces" className="block text-sm font-medium mb-2">
                  ที่จอดรถ (คัน)
                </label>
                <input
                  id="parkingSpaces"
                  name="parkingSpaces"
                  type="number"
                  min="0"
                  value={formData.parkingSpaces}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/houses">ยกเลิก</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}