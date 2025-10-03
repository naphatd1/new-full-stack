-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'HouseMarket',
    "siteDescription" TEXT NOT NULL DEFAULT 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์',
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "requireEmailVerification" BOOLEAN NOT NULL DEFAULT true,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maxFileSize" INTEGER NOT NULL DEFAULT 10,
    "allowedFileTypes" TEXT NOT NULL DEFAULT 'jpg,jpeg,png,pdf',
    "commissionRate" DECIMAL(65,30) NOT NULL DEFAULT 3.0,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok',
    "language" TEXT NOT NULL DEFAULT 'th',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);
