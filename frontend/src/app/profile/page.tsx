"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    bio: user?.profile?.bio || "",
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    country: user?.profile?.country || "",
    dateOfBirth: user?.profile?.dateOfBirth
      ? new Date(user.profile.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would call the API to update profile
      // const response = await profileApi.updateProfile(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("อัพเดทโปรไฟล์สำเร็จ");
      setIsEditing(false);
    } catch {
      toast.error("เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
          <p className="text-gray-600 mt-2">
            จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h2>
                <p className="text-gray-600 mb-4">@{user.username}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.profile?.phone && (
                    <div className="flex items-center justify-center space-x-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{user.profile.phone}</span>
                    </div>
                  )}
                  {user.profile?.city && (
                    <div className="flex items-center justify-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>
                        {user.profile.city}, {user.profile.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      สมาชิกตั้งแต่{" "}
                      {new Date(user.createdAt).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>

                {user.profile?.bio && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{user.profile.bio}</p>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>{isEditing ? "ยกเลิกแก้ไข" : "แก้ไขโปรไฟล์"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลส่วนตัว</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="ชื่อ"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="ชื่อจริง"
                    />
                    <Input
                      label="นามสกุล"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="นามสกุล"
                    />
                  </div>

                  <Input
                    label="อีเมล"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email usually can't be changed
                    placeholder="อีเมล"
                  />

                  <Input
                    label="เบอร์โทรศัพท์"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="เบอร์โทรศัพท์"
                  />

                  <Input
                    label="วันเกิด"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เกี่ยวกับฉัน
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="เล่าเกี่ยวกับตัวคุณ..."
                    />
                  </div>

                  <Input
                    label="ที่อยู่"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="ที่อยู่"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="เมือง"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="เมือง"
                    />
                    <Input
                      label="ประเทศ"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="ประเทศ"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        ยกเลิก
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>การตั้งค่าบัญชี</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      เปลี่ยนรหัสผ่าน
                    </h4>
                    <p className="text-sm text-gray-600">
                      อัพเดทรหัสผ่านเพื่อความปลอดภัย
                    </p>
                  </div>
                  <Link href="/change-password">
                    <Button variant="outline" size="sm">
                      เปลี่ยน
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">การแจ้งเตือน</h4>
                    <p className="text-sm text-gray-600">
                      จัดการการแจ้งเตือนทางอีเมล
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    ตั้งค่า
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-900">ลบบัญชี</h4>
                    <p className="text-sm text-red-600">
                      ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    ลบบัญชี
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
