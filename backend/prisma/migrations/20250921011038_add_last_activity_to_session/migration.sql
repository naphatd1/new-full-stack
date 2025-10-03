/*
  Warnings:

  - You are about to alter the column `area` on the `houses` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `landArea` on the `houses` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "public"."houses" ADD COLUMN     "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parkingSpaces" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "area" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "landArea" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."sessions" ADD COLUMN     "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
