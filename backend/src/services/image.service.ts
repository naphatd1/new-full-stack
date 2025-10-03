import { HouseImage } from "@prisma/client";
import prisma from "../lib/prisma";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export interface CreateImageData {
  houseId: string;
  filename: string;
  originalName: string;
  path: string;
  url?: string;
  size: number;
  mimetype: string;
  width?: number;
  height?: number;
  isMain?: boolean;
  order?: number;
}

export interface ProcessedImageData {
  buffer: Buffer;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  width: number;
  height: number;
}

export const createHouseImage = async (
  data: CreateImageData
): Promise<HouseImage> => {
  return await prisma.houseImage.create({
    data,
  });
};

export const getHouseImages = async (
  houseId: string
): Promise<HouseImage[]> => {
  return await prisma.houseImage.findMany({
    where: { houseId },
    orderBy: [{ isMain: "desc" }, { order: "asc" }, { createdAt: "asc" }],
  });
};

export const updateHouseImage = async (
  id: string,
  data: Partial<CreateImageData>
): Promise<HouseImage> => {
  return await prisma.houseImage.update({
    where: { id },
    data,
  });
};

export const deleteHouseImage = async (id: string): Promise<HouseImage> => {
  const image = await prisma.houseImage.findUnique({
    where: { id },
  });

  if (image) {
    // ลบไฟล์จาก filesystem
    try {
      await fs.unlink(image.path);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  return await prisma.houseImage.delete({
    where: { id },
  });
};

export const setMainImage = async (
  imageId: string,
  houseId: string
): Promise<void> => {
  await prisma.$transaction([
    // ยกเลิกรูปหลักเดิม
    prisma.houseImage.updateMany({
      where: { houseId, isMain: true },
      data: { isMain: false },
    }),
    // ตั้งรูปใหม่เป็นหลัก
    prisma.houseImage.update({
      where: { id: imageId },
      data: { isMain: true },
    }),
  ]);
};

export const reorderImages = async (
  imageOrders: { id: string; order: number }[]
): Promise<void> => {
  await prisma.$transaction(
    imageOrders.map(({ id, order }) =>
      prisma.houseImage.update({
        where: { id },
        data: { order },
      })
    )
  );
};

export const processImage = async (
  buffer: Buffer,
  originalName: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: "jpeg" | "png" | "webp";
  } = {}
): Promise<ProcessedImageData> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = "jpeg",
  } = options;

  // ประมวลผลรูปภาพด้วย Sharp
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();

  let processedBuffer: Buffer;
  let outputFormat = format;
  let mimetype = `image/${format}`;

  // ปรับขนาดและบีบอัด
  if (format === "jpeg") {
    processedBuffer = await sharpInstance
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();
  } else if (format === "webp") {
    processedBuffer = await sharpInstance
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 6,
      })
      .toBuffer();
  } else {
    processedBuffer = await sharpInstance
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({
        quality,
        compressionLevel: 9,
      })
      .toBuffer();
  }

  // ได้ข้อมูลรูปภาพที่ประมวลผลแล้ว
  const processedMetadata = await sharp(processedBuffer).metadata();

  // สร้างชื่อไฟล์ใหม่
  const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
  const filename = `${path.parse(originalName).name}_${Date.now()}.${ext}`;

  return {
    buffer: processedBuffer,
    filename,
    originalName,
    size: processedBuffer.length,
    mimetype,
    width: processedMetadata.width || 0,
    height: processedMetadata.height || 0,
  };
};

export const createHouseFolder = async (houseId: string): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const houseDir = path.join(uploadsDir, "houses", houseId);

  try {
    await fs.mkdir(houseDir, { recursive: true });
    return houseDir;
  } catch (error) {
    console.error("Error creating house folder:", error);
    throw new Error("ไม่สามารถสร้างโฟลเดอร์สำหรับบ้านได้");
  }
};

export const saveImageToFile = async (
  buffer: Buffer,
  filename: string,
  houseId: string
): Promise<{ path: string; url: string }> => {
  const houseDir = await createHouseFolder(houseId);
  const filePath = path.join(houseDir, filename);
  const url = `/uploads/houses/${houseId}/${filename}`;

  try {
    await fs.writeFile(filePath, buffer);
    return { path: filePath, url };
  } catch (error) {
    console.error("Error saving image file:", error);
    throw new Error("ไม่สามารถบันทึกไฟล์รูปภาพได้");
  }
};

export const deleteHouseFolder = async (houseId: string): Promise<void> => {
  const houseDir = path.join(process.cwd(), "uploads", "houses", houseId);

  try {
    await fs.rm(houseDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Error deleting house folder:", error);
  }
};
