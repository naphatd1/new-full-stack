"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useHouse, useIncrementViewCount } from "@/hooks/api/useHouses";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  formatPrice,
  formatArea,
  formatLandArea,
  getHouseTypeLabel,
  getStatusLabel,
  getStatusColor,
  getImageUrl,
} from "@/lib/utils";
import {
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import HouseVideoGallery from "@/components/HouseVideoGallery";

export default function HouseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const houseId = params.id as string;
  const { data: house, isLoading: loading, error, refetch } = useHouse(houseId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const incrementViewCountMutation = useIncrementViewCount();
  const viewCountIncremented = React.useRef(false);

  // Check for timestamp parameter and refetch if present (coming from edit page)
  React.useEffect(() => {
    const timestamp = searchParams.get("_t");
    if (timestamp) {
      // Force refetch the house data
      queryClient.invalidateQueries({ queryKey: ["house", houseId] });
      refetch();

      // Clean up URL by removing the timestamp parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("_t");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, queryClient, houseId, refetch]);

  // Increment view count every time user visits the page
  React.useEffect(() => {
    if (!houseId) return;

    // Reset ref when houseId changes
    if (viewCountIncremented.current) {
      viewCountIncremented.current = false;
    }

    // Use setTimeout to debounce and prevent double calls in StrictMode
    const timer = setTimeout(() => {
      if (!viewCountIncremented.current) {
        viewCountIncremented.current = true;
        incrementViewCountMutation.mutate(houseId);
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]); // Only depend on houseId to prevent loop

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: house?.title,
          text: house?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("ลิงก์ถูกคัดลอกแล้ว");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ไม่พบข้อมูลบ้าน
          </h2>
          <p className="text-gray-600 mb-4">ไม่สามารถโหลดข้อมูลบ้านได้</p>
          <Link href="/">
            <Button>กลับหน้าหลัก</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <HomeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ไม่พบข้อมูลบ้าน
          </h2>
          <p className="text-muted-foreground mb-4">
            บ้านที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่
          </p>
          <Link href="/search">
            <Button className="hover:scale-105 transition-transform duration-200">
              กลับไปค้นหาบ้าน
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = house.images || [];
  const mainImage = images[currentImageIndex] || images[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <Link
            href="/search"
            className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200 hover:translate-x-1 transform"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            กลับไปค้นหา
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Gallery */}
            <HouseVideoGallery houseId={houseId} className="mb-6" />

            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <Image
                  src={getImageUrl(mainImage?.url || mainImage?.path)}
                  alt={house.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      house.status
                    )}`}
                  >
                    {getStatusLabel(house.status)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="bg-background/90 hover:bg-background p-2 rounded-full shadow-md transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-border"
                  >
                    <ShareIcon className="h-5 w-5 text-foreground" />
                  </button>
                  <button className="bg-background/90 hover:bg-background p-2 rounded-full shadow-md transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-border">
                    <HeartIcon className="h-5 w-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <Image
                        src={getImageUrl(image.url || image.path)}
                        alt={`${house.title} - รูปที่ ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* House Details */}
            <Card className="animate-slide-up">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-card-foreground">
                      {house.title}
                    </h1>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {getHouseTypeLabel(house.houseType)}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-primary mb-4">
                    {formatPrice(house.price)}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <HomeIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground">
                      {house.bedrooms}
                    </div>
                    <div className="text-sm text-muted-foreground">ห้องนอน</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <BuildingOfficeIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground">
                      {house.bathrooms}
                    </div>
                    <div className="text-sm text-muted-foreground">ห้องน้ำ</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {house.parkingSpaces}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ที่จอดรถ
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2">
                      <span className="text-xl">📏</span>
                    </div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {formatArea(house.area)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      พื้นที่ใช้สอย
                    </div>
                  </div>
                  {house.landArea &&
                    (typeof house.landArea === "number"
                      ? house.landArea > 0
                      : parseFloat(house.landArea.toString()) > 0) && (
                      <div className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                        <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2">
                          <span className="text-xl">🌍</span>
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">
                          {formatLandArea(house.landArea)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ขนาดที่ดิน
                        </div>
                      </div>
                    )}
                </div>

                <div className="mb-6">
                  <div className="flex items-start space-x-2 text-muted-foreground mb-4">
                    <MapPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-card-foreground">
                        {house.address}
                      </p>
                      <p>
                        {house.city}, {house.province} {house.postalCode}
                      </p>
                    </div>
                  </div>
                </div>

                {house.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      รายละเอียด
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {house.description}
                    </p>
                  </div>
                )}

                {/* Badges Section */}
                {house.badges && house.badges.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center">
                      <span className="text-2xl mr-2">✨</span>
                      จุดเด่นและสิ่งอำนวยความสะดวก
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {house.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm rounded-full border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    ลงประกาศเมื่อ{" "}
                    {new Date(house.createdAt).toLocaleDateString("th-TH")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="animate-slide-left">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  ติดต่อเจ้าของ
                </h3>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {house.owner.firstName && house.owner.lastName
                        ? `${house.owner.firstName} ${house.owner.lastName}`
                        : house.owner.username}
                    </p>
                    <p className="text-sm text-muted-foreground">เจ้าของบ้าน</p>
                  </div>
                </div>

                {user?.id !== house.ownerId ? (
                  <div className="space-y-3">
                    <Button className="w-full flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-200">
                      <PhoneIcon className="h-4 w-4" />
                      <span>โทรหา</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-200"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>ส่งข้อความ</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground bg-primary/10 p-3 rounded-lg border border-primary/20">
                      นี่คือบ้านของคุณ
                    </p>
                    <Link href={`/houses/${house.id}/edit`}>
                      <Button
                        variant="outline"
                        className="w-full hover:scale-105 transition-transform duration-200"
                      >
                        แก้ไขประกาศ
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card
              className="animate-slide-left"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  ข้อมูลสรุป
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ประเภท:</span>
                    <span className="font-medium text-card-foreground">
                      {getHouseTypeLabel(house.houseType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">สถานะ:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        house.status
                      )}`}
                    >
                      {getStatusLabel(house.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ห้องนอน:</span>
                    <span className="font-medium text-card-foreground">
                      {house.bedrooms} ห้อง
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ห้องน้ำ:</span>
                    <span className="font-medium text-card-foreground">
                      {house.bathrooms} ห้อง
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ที่จอดรถ:</span>
                    <span className="font-medium text-card-foreground">
                      {house.parkingSpaces} คัน
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">พื้นที่:</span>
                    <span className="font-medium text-card-foreground">
                      {formatArea(house.area)}
                    </span>
                  </div>
                  {house.landArea && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ที่ดิน:</span>
                      <span className="font-medium text-card-foreground">
                        {formatLandArea(house.landArea)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
