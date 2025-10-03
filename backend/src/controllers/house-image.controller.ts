import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/errorHandler";
import { checkHouseOwnership } from "../services/house.service";
import {
  createHouseImage,
  getHouseImages,
  updateHouseImage,
  deleteHouseImage,
  setMainImage,
  reorderImages,
  processImage,
  saveImageToFile,
} from "../services/image.service";

export const uploadHouseImagesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: validationErrors.array(),
      });
      return;
    }

    const { houseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODERATOR';
    
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์อัปโหลดรูปภาพสำหรับบ้านนี้",
      });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "ไม่พบไฟล์รูปภาพที่จะอัปโหลด",
      });
      return;
    }

    // ตรวจสอบจำนวนรูปภาพ (สูงสุด 50 รูปต่อบ้าน)
    const existingImages = await getHouseImages(houseId);
    if (existingImages.length + files.length > 50) {
      res.status(400).json({
        success: false,
        message: `สามารถอัปโหลดได้สูงสุด 50 รูปต่อบ้าน (ปัจจุบันมี ${existingImages.length} รูป)`,
      });
      return;
    }

    const uploadedImages = [];
    const processingErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // ประมวลผลรูปภาพ
        const processedImage = await processImage(
          file.buffer,
          file.originalname,
          {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 85,
            format: "jpeg",
          }
        );

        // บันทึกไฟล์
        const { path: filePath, url } = await saveImageToFile(
          processedImage.buffer,
          processedImage.filename,
          houseId
        );

        // บันทึกข้อมูลในฐานข้อมูล
        const imageData = {
          houseId,
          filename: processedImage.filename,
          originalName: processedImage.originalName,
          path: filePath,
          url,
          size: processedImage.size,
          mimetype: processedImage.mimetype,
          width: processedImage.width,
          height: processedImage.height,
          order: existingImages.length + i,
          isMain: existingImages.length === 0 && i === 0, // รูปแรกเป็นรูปหลัก
        };

        const savedImage = await createHouseImage(imageData);
        uploadedImages.push(savedImage);
      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        processingErrors.push(`ไม่สามารถประมวลผลรูป ${file.originalname} ได้`);
      }
    }

    if (uploadedImages.length === 0) {
      res.status(400).json({
        success: false,
        message: "ไม่สามารถอัปโหลดรูปภาพใดๆ ได้",
        errors: processingErrors,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: `อัปโหลดรูปภาพสำเร็จ ${uploadedImages.length} รูป`,
      data: {
        uploadedImages,
        errors: processingErrors.length > 0 ? processingErrors : undefined,
      },
    });
  }
);

export const getHouseImagesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId } = req.params;

    const images = await getHouseImages(houseId);

    res.json({
      success: true,
      data: images,
    });
  }
);

export const setMainImageController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId, imageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODERATOR';
    
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์แก้ไขรูปภาพของบ้านนี้",
      });
      return;
    }

    await setMainImage(imageId, houseId);

    res.json({
      success: true,
      message: "ตั้งรูปหลักสำเร็จ",
    });
  }
);

export const reorderImagesController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: validationErrors.array(),
      });
      return;
    }

    const { houseId } = req.params;
    const { imageOrders } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODERATOR';
    
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์แก้ไขรูปภาพของบ้านนี้",
      });
      return;
    }

    await reorderImages(imageOrders);

    res.json({
      success: true,
      message: "จัดเรียงรูปภาพสำเร็จ",
    });
  }
);

export const deleteHouseImageController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { houseId, imageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "ไม่ได้รับอนุญาต",
      });
      return;
    }

    // ตรวจสอบความเป็นเจ้าของหรือเป็น admin
    const isOwner = await checkHouseOwnership(houseId, userId);
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODERATOR';
    
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ลบรูปภาพของบ้านนี้",
      });
      return;
    }

    await deleteHouseImage(imageId);

    res.json({
      success: true,
      message: "ลบรูปภาพสำเร็จ",
    });
  }
);
