import React from "react";
import Link from "next/link";
import Image from "next/image";
import { House } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
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
  EyeIcon,
} from "@heroicons/react/24/outline";

interface HouseCardProps {
  house: House;
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  const mainImage =
    house.images?.find((img) => img.isMain) || house.images?.[0];
  const imageUrl = getImageUrl(mainImage?.url || mainImage?.path);
  const [imgError, setImgError] = React.useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <Link href={`/houses/${house.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card border-border hover:border-primary/20 h-full flex flex-col">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          {imgError ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <HomeIcon className="h-12 w-12 mx-auto mb-2" />
                <span className="text-sm">ไม่มีรูปภาพ</span>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={house.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          )}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                house.status
              )}`}
            >
              {getStatusLabel(house.status)}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              {getHouseTypeLabel(house.houseType)}
            </span>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {house.title}
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-primary mt-1">
              {formatPrice(house.price)}
            </p>
          </div>

          <div className="flex items-center text-muted-foreground mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm truncate">
              {house.address}, {house.city}, {house.province}
            </span>
          </div>

          {/* Property Details Grid */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 sm:p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              {/* Row 1 */}
              <div className="flex items-center text-muted-foreground">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-1.5 sm:mr-2 flex-shrink-0">
                  <HomeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-card-foreground text-sm sm:text-base">
                    {house.bedrooms}
                  </div>
                  <div className="text-xs text-muted-foreground">ห้องนอน</div>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full mr-1.5 sm:mr-2 flex-shrink-0">
                  <BuildingOfficeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-card-foreground text-sm sm:text-base">
                    {house.bathrooms}
                  </div>
                  <div className="text-xs text-muted-foreground">ห้องน้ำ</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center text-muted-foreground">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-1.5 sm:mr-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm">🚗</span>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-card-foreground text-sm sm:text-base">
                    {house.parkingSpaces}
                  </div>
                  <div className="text-xs text-muted-foreground">ที่จอดรถ</div>
                </div>
              </div>

              <div className="flex items-center text-muted-foreground">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-1.5 sm:mr-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm">📏</span>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-card-foreground text-sm sm:text-base">
                    {formatArea(house.area)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    พื้นที่ใช้สอย
                  </div>
                </div>
              </div>

              {/* Row 3 - Land Area (conditionally shown) */}
              {house.landArea &&
              (typeof house.landArea === "number"
                ? house.landArea > 0
                : parseFloat(house.landArea.toString()) > 0) ? (
                <div className="flex items-center text-muted-foreground col-span-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full mr-2">
                    <span className="text-sm">🌍</span>
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">
                      {formatLandArea(house.landArea)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ขนาดที่ดิน
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Badges Section */}
          {house.badges && house.badges.length > 0 ? (
            <div className="mb-3 flex-grow">
              <div className="flex flex-wrap gap-1">
                {house.badges.slice(0, 4).map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                  >
                    {badge}
                  </span>
                ))}
                {house.badges.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                    +{house.badges.length - 4} อื่นๆ
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-3 flex-grow">
              <p className="text-muted-foreground text-xs italic">
                ไม่มีจุดเด่นที่ระบุ
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>
                  {new Date(house.createdAt).toLocaleDateString("th-TH")}
                </span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-3 w-3 mr-1" />
                <span>การเข้าชม {house.viewCount || 0}</span>
              </div>
            </div>
            <span>โดย {house.owner?.firstName || house.owner?.username}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HouseCard;
