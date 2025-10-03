import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    // รองรับไฟล์รูปภาพทั่วไป
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP, GIF)"));
    }
  } else {
    cb(new Error("ไฟล์ต้องเป็นรูปภาพเท่านั้น"));
  }
};

// Multer configuration for house images
export const uploadHouseImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 30, // สูงสุด 30 ไฟล์ต่อครั้ง
  },
}).array("images", 30); // field name 'images', max 30 files

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB ต่อไฟล์)",
      });
      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        success: false,
        message: "จำนวนไฟล์เกินกำหนด (สูงสุด 30 ไฟล์ต่อครั้ง)",
      });
      return;
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        message: 'ชื่อ field ไม่ถูกต้อง (ใช้ "images")',
      });
      return;
    }
  }

  if (error.message) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  next(error);
};

// Validation middleware for house image upload
export const validateHouseImageUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      message: "กรุณาเลือกรูปภาพอย่างน้อย 1 รูป",
    });
    return;
  }

  // ตรวจสอบจำนวนไฟล์ขั้นต่ำสำหรับบ้าน
  if (files.length < 5) {
    res.status(400).json({
      success: false,
      message: "กรุณาอัปโหลดรูปภาพอย่างน้อย 5 รูปสำหรับบ้าน",
    });
    return;
  }

  // ตรวจสอบขนาดไฟล์แต่ละไฟล์
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      res.status(400).json({
        success: false,
        message: `ไฟล์ ${file.originalname} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`,
      });
      return;
    }
  }

  next();
};

// Middleware สำหรับตรวจสอบ content type
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const contentType = req.get("Content-Type");

  if (!contentType || !contentType.includes("multipart/form-data")) {
    res.status(400).json({
      success: false,
      message: "Content-Type ต้องเป็น multipart/form-data",
    });
    return;
  }

  next();
};
