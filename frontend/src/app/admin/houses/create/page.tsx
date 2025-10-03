"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { useCreateHouse } from "@/hooks/api/useHouses";
import { HouseType } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import Input from '@/components/ui/Input';
import { getHouseTypeLabel } from "@/lib/utils";
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";
import VideoUpload from "@/components/VideoUpload";

export default function CreateHousePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const createHouseMutation = useCreateHouse();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">("medium");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    landArea: "",
    parkingSpaces: "",
    houseType: "" as HouseType,
  });
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const houseTypes: HouseType[] = [
    "DETACHED_HOUSE",
    "TOWNHOUSE",
    "CONDO",
    "APARTMENT",
    "COMMERCIAL",
    "LAND",
  ];

  const provinces = [
    "กรุงเทพมหานคร",
    "นนทบุรี",
    "ปทุมธานี",
    "สมุทรปราการ",
    "เชียงใหม่",
    "ภูเก็ต",
    "ชลบุรี",
    "ระยอง",
  ];

  const availableBadges = [
    "🏠 บ้านใหม่",
    "🌟 พร้อมอยู่",
    "🚗 ที่จอดรถ",
    "🏊 สระว่ายน้ำ",
    "🏋️ ฟิตเนส",
    "🛡️ รปภ.24ชม.",
    "🌳 สวนสวย",
    "🏪 ใกล้ห้าง",
    "🚇 ใกล้รถไฟฟ้า",
    "🏥 ใกล้โรงพยาบาล",
    "🎓 ใกล้โรงเรียน",
    "🌅 วิวสวย",
    "🔥 ราคาดี",
    "💎 หรูหรา",
    "🏡 บ้านเดี่ยว",
    "🏢 ทาวน์เฮ้าส์",
    "🏬 คอนโด",
    "🌊 ใกล้ทะเล",
    "⛰️ ใกล้ภูเขา",
    "🌲 บรรยากาศดี",
    "🔒 ปลอดภัย",
    "🎯 ทำเลดี",
    "💰 ผ่อนได้",
    "📶 WiFi ฟรี",
    "❄️ แอร์ทุกห้อง",
    "🚿 น้ำร้อน",
    "🍳 ครัวสวย",
    "🛏️ เฟอร์นิเจอร์",
    "🧹 แม่บ้าน",
    "🎪 สนามเด็กเล่น",
  ];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 40) {
      toast.error("สามารถอัพโหลดรูปได้สูงสุด 40 รูป");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation (5-200 characters)
    if (!formData.title.trim()) {
      newErrors.title = "กรุณากรอกชื่อบ้าน";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "ชื่อบ้านต้องมีความยาวอย่างน้อย 5 ตัวอักษร";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "ชื่อบ้านต้องไม่เกิน 200 ตัวอักษร";
    }

    // Description validation (max 2000 characters)
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "คำอธิบายต้องไม่เกิน 2000 ตัวอักษร";
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = "กรุณากรอกราคา";
    } else if (parseInt(formData.price) <= 0) {
      newErrors.price = "ราคาต้องมากกว่า 0";
    }

    // Address validation (10-500 characters)
    if (!formData.address.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "ที่อยู่ต้องมีความยาวอย่างน้อย 10 ตัวอักษร";
    } else if (formData.address.trim().length > 500) {
      newErrors.address = "ที่อยู่ต้องไม่เกิน 500 ตัวอักษร";
    }

    // City validation (2-100 characters)
    if (!formData.city.trim()) {
      newErrors.city = "กรุณากรอกเมือง/อำเภอ";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "เมือง/อำเภอต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
    } else if (formData.city.trim().length > 100) {
      newErrors.city = "เมือง/อำเภอต้องไม่เกิน 100 ตัวอักษร";
    }

    // Province validation (2-100 characters)
    if (!formData.province) {
      newErrors.province = "กรุณาเลือกจังหวัด";
    } else if (formData.province.length < 2) {
      newErrors.province = "จังหวัดต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
    } else if (formData.province.length > 100) {
      newErrors.province = "จังหวัดต้องไม่เกิน 100 ตัวอักษร";
    }

    // Bedrooms validation (0-20)
    if (!formData.bedrooms) {
      newErrors.bedrooms = "กรุณากรอกจำนวนห้องนอน";
    } else {
      const bedrooms = parseInt(formData.bedrooms);
      if (isNaN(bedrooms) || bedrooms < 0 || bedrooms > 20) {
        newErrors.bedrooms = "จำนวนห้องนอนต้องเป็นตัวเลข 0-20";
      }
    }

    // Bathrooms validation (1-20)
    if (!formData.bathrooms) {
      newErrors.bathrooms = "กรุณากรอกจำนวนห้องน้ำ";
    } else {
      const bathrooms = parseInt(formData.bathrooms);
      if (isNaN(bathrooms) || bathrooms < 1 || bathrooms > 20) {
        newErrors.bathrooms = "จำนวนห้องน้ำต้องเป็นตัวเลข 1-20";
      }
    }

    // Area validation (min 1)
    if (!formData.area) {
      newErrors.area = "กรุณากรอกพื้นที่";
    } else {
      const area = parseFloat(formData.area);
      if (isNaN(area) || area < 1) {
        newErrors.area = "พื้นที่ต้องเป็นตัวเลขที่มากกว่า 0";
      }
    }

    // Land area validation (optional, min 0)
    if (formData.landArea) {
      const landArea = parseFloat(formData.landArea);
      if (isNaN(landArea) || landArea < 0) {
        newErrors.landArea = "ขนาดที่ดินต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0";
      }
    }

    // Parking spaces validation (0-50)
    if (!formData.parkingSpaces) {
      newErrors.parkingSpaces = "กรุณากรอกจำนวนที่จอดรถ";
    } else {
      const parkingSpaces = parseInt(formData.parkingSpaces);
      if (isNaN(parkingSpaces) || parkingSpaces < 0 || parkingSpaces > 50) {
        newErrors.parkingSpaces = "จำนวนที่จอดรถต้องเป็นตัวเลข 0-50";
      }
    }

    // House type validation
    if (!formData.houseType) {
      newErrors.houseType = "กรุณาเลือกประเภทบ้าน";
    }

    // Postal code validation (optional but if provided should be valid)
    if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    // Image validation
    if (images.length === 0) {
      newErrors.images = "กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้อง");
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อนลงประกาศ");
      router.push("/login");
      return;
    }

    // Prepare house data
    const houseData = {
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      price: parseInt(formData.price),
      address: formData.address.trim(),
      city: formData.city.trim(),
      province: formData.province,
      postalCode: formData.postalCode || "",
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: Number(formData.area), // แปลงเป็น number โดยตรง
      landArea: formData.landArea ? Number(formData.landArea) : 0,
      parkingSpaces: parseInt(formData.parkingSpaces),
      houseType: formData.houseType,
      badges: selectedBadges, // เพิ่ม badges ที่เลือก
      status: "AVAILABLE" as const,
    };

    try {
      const house = await createHouseMutation.mutateAsync(houseData);

      const token = Cookies.get("token");

      // Upload videos if any
      if (videos.length > 0 && house.id) {
        try {
          const videoFormData = new FormData();
          videos.forEach((video) => {
            videoFormData.append("videos", video);
          });
          videoFormData.append("quality", videoQuality);

          toast.loading("กำลังอัปโหลดและบีบอัดวิดีโอ...", { id: "video-upload" });

          const videoResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/houses/${house.id}/videos`,
            {
              method: "POST",
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: videoFormData,
            }
          );

          if (videoResponse.ok) {
            const videoResult = await videoResponse.json();
            toast.success(
              `อัปโหลดวิดีโอสำเร็จ ${videoResult.data.totalFiles} ไฟล์ (ประหยัดพื้นที่ ${videoResult.data.averageCompressionRatio.toFixed(1)}%)`,
              { id: "video-upload" }
            );
          } else {
            throw new Error("Failed to upload videos");
          }
        } catch (videoError) {
          console.warn("Failed to upload videos:", videoError);
          toast.error("อัปโหลดวิดีโอล้มเหลว แต่บ้านถูกสร้างเรียบร้อยแล้ว", { id: "video-upload" });
        }
      }

      // Upload images if any
      if (images.length > 0 && house.id) {
        try {
          const imageFormData = new FormData();
          images.forEach((image) => {
            imageFormData.append("images", image);
          });

          // Upload images to the created house
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/houses/${house.id}/images`,
            {
              method: "POST",
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: imageFormData,
            }
          );
        } catch (imageError) {
          console.warn("Failed to upload images:", imageError);
          // Don't fail the whole process if image upload fails
        }
      }

      router.push(`/houses/${house.id}`);
    } catch (error) {
      console.error("Create house error:", error);
      // Error handling is done in the mutation
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            กลับหน้าแรก
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ลงขายบ้าน
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              กรอกข้อมูลบ้านของคุณเพื่อลงประกาศขาย
              ระบบจะช่วยให้คุณเข้าถึงผู้ซื้อได้ง่ายขึ้น
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>ข้อมูลพื้นฐาน</span>
              <span>ที่อยู่</span>
              <span>รายละเอียด</span>
              <span>จุดเด่น</span>
              <span>วิดีโอ</span>
              <span>รูปภาพ</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-red-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">
                      🚨 กรุณาแก้ไขข้อมูลต่อไปนี้:
                    </h3>
                    <div className="text-sm text-red-700">
                      <ul className="space-y-2">
                        {Object.entries(errors).map(([field, message]) => (
                          <li key={field} className="flex items-center">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                            {message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="text-2xl">🏠</span>
                </div>
                ข้อมูลพื้นฐาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mt-3 mb-3">
                  ชื่อบ้าน *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="เช่น บ้านเดี่ยว 2 ชั้น ย่านสุขุมวิท"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="อธิบายรายละเอียดบ้าน เช่น สิ่งอำนวยความสะดวก ตกแต่งภายใน ฯลฯ"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ราคา (บาท) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      ฿
                    </span>
                    <input
                      name="price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ประเภทบ้าน *
                  </label>
                  <select
                    name="houseType"
                    value={formData.houseType}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 cursor-pointer"
                  >
                    <option value="">เลือกประเภทบ้าน</option>
                    {houseTypes.map((type) => (
                      <option key={type} value={type}>
                        {getHouseTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                  {errors.houseType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.houseType}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="text-2xl">📍</span>
                </div>
                ที่อยู่
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mt-3 mb-1">
                  ที่อยู่ *
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="เลขที่ ซอย ถนน"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    เมือง/อำเภอ *
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="เช่น บางนา"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    จังหวัด *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 cursor-pointer"
                  >
                    <option value="">เลือกจังหวัด</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    รหัสไปรษณีย์
                  </label>
                  <input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="10110"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="text-2xl">📐</span>
                </div>
                รายละเอียดบ้าน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ห้องนอน *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                      🛏️
                    </span>
                    <input
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.bedrooms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ห้องน้ำ *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                      🚿
                    </span>
                    <input
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.bathrooms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    พื้นที่ใช้สอย (ตร.ม.) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                      📏
                    </span>
                    <input
                      name="area"
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ขนาดที่ดิน (ตร.ว.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                      🌍
                    </span>
                    <input
                      name="landArea"
                      type="number"
                      step="0.01"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.landArea && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.landArea}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ที่จอดรถ (คัน) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                      🚗
                    </span>
                    <input
                      name="parkingSpaces"
                      type="number"
                      value={formData.parkingSpaces}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white text-gray-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  {errors.parkingSpaces && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.parkingSpaces}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="text-2xl">✨</span>
                </div>
                จุดเด่นและสิ่งอำนวยความสะดวก
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 text-center">
                  ✨ เลือกจุดเด่นและสิ่งอำนวยความสะดวกของบ้านคุณ
                  (เลือกได้หลายรายการ) ✨
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableBadges.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                      selectedBadges.includes(badge)
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
              {selectedBadges.length > 0 && (
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    จุดเด่นที่เลือก ({selectedBadges.length} รายการ)
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedBadges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {badge}
                        <button
                          type="button"
                          onClick={() => toggleBadge(badge)}
                          className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Videos */}
          <VideoUpload
            videos={videos}
            setVideos={setVideos}
            videoPreviews={videoPreviews}
            setVideoPreviews={setVideoPreviews}
            quality={videoQuality}
            setQuality={setVideoQuality}
            errors={errors}
          />

          {/* Images */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="text-2xl">📸</span>
                </div>
                รูปภาพ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mt-3 mb-2">
                  อัพโหลดรูปภาพ * (สูงสุด 40 รูป)
                </label>
                <div className="border-3 border-dashed border-indigo-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-blue-50">
                  <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <PhotoIcon className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    <label
                      htmlFor="images"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
                    >
                      📸 คลิกเพื่อเลือกรูป
                    </label>
                    <span className="text-gray-500"> หรือลากไฟล์มาวาง</span>
                  </div>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 bg-white/70 rounded-lg px-4 py-2 inline-block">
                    รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB ต่อรูป
                  </p>
                </div>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🖼️</span>
                    รูปภาพที่เลือก ({imagePreviews.length}/40)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={128}
                          className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                            ⭐ รูปหลัก
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center space-x-6 pt-8">
            <Link href="/">
              <Button
                variant="outline"
                type="button"
                className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                ❌ ยกเลิก
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createHouseMutation.isPending}
              className="px-12 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {createHouseMutation.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  กำลังลงประกาศ...
                </span>
              ) : (
                "🚀 ลงประกาศ"
              )}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <p className="text-gray-600 text-sm">
              💡 <strong>เคล็ดลับ:</strong> การใส่รูปภาพที่สวยและครบถ้วน
              พร้อมกับข้อมูลที่ละเอียด
              จะช่วยให้ประกาศของคุณดึงดูดผู้ซื้อได้มากขึ้น
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
