import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for videos only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file is a video
  if (file.mimetype.startsWith("video/")) {
    // รองรับไฟล์วิดีโอทั่วไป
    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/mkv",
      "video/x-matroska",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("รองรับเฉพาะไฟล์วิดีโอ (MP4, AVI, MOV, WebM, MKV)"));
    }
  } else {
    cb(new Error("ไฟล์ต้องเป็นวิดีโอเท่านั้น"));
  }
};

// Multer configuration for house videos
export const uploadHouseVideos = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB per file
    files: 5, // สูงสุด 5 ไฟล์ต่อครั้ง
  },
}).array("videos", 5); // field name 'videos', max 5 files

// Error handling middleware for multer
export const handleVideoUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "ไฟล์วิดีโอมีขนาดใหญ่เกินไป (สูงสุด 500MB ต่อไฟล์)",
      });
      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        success: false,
        message: "จำนวนไฟล์วิดีโอเกินกำหนด (สูงสุด 5 ไฟล์ต่อครั้ง)",
      });
      return;
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        message: 'ชื่อ field ไม่ถูกต้อง (ใช้ "videos")',
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

// Validation middleware for house video upload
export const validateHouseVideoUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      message: "กรุณาเลือกไฟล์วิดีโออย่างน้อย 1 ไฟล์",
    });
    return;
  }

  // ตรวจสอบขนาดไฟล์แต่ละไฟล์
  for (const file of files) {
    if (file.size > 500 * 1024 * 1024) {
      // 500MB
      res.status(400).json({
        success: false,
        message: `ไฟล์ ${file.originalname} มีขนาดใหญ่เกินไป (สูงสุด 500MB)`,
      });
      return;
    }
  }

  next();
};

// Middleware สำหรับตรวจสอบ content type
export const validateVideoContentType = (
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