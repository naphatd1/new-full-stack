import multer from 'multer';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('ไฟล์ต้องเป็นรูปภาพเท่านั้น (jpg, jpeg, png, gif, webp)'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Image processing middleware
export const processImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    // Process image with Sharp
    const processedImageBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();

    // Convert to base64
    const base64Image = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;

    // Add processed image to request
    req.processedImage = {
      base64: base64Image,
      size: processedImageBuffer.length,
      originalName: req.file.originalname,
      mimetype: 'image/jpeg',
    };

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(400).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ',
    });
  }
};

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      processedImage?: {
        base64: string;
        size: number;
        originalName: string;
        mimetype: string;
      };
    }
  }
}

// Validation middleware
export const validateImageUpload = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file && !req.body.avatar) {
    res.status(400).json({
      success: false,
      message: 'กรุณาเลือกรูปภาพหรือส่ง base64 string',
    });
    return;
  }

  // If base64 is provided directly
  if (req.body.avatar && typeof req.body.avatar === 'string') {
    // Validate base64 format
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (!base64Regex.test(req.body.avatar)) {
      res.status(400).json({
        success: false,
        message: 'รูปภาพต้องเป็นรูปแบบ base64 ที่ถูกต้อง',
      });
      return;
    }

    // Check base64 size (approximate)
    const base64Size = (req.body.avatar.length * 3) / 4;
    if (base64Size > 5 * 1024 * 1024) { // 5MB
      res.status(400).json({
        success: false,
        message: 'รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)',
      });
      return;
    }
  }

  next();
};

// Base64 processing middleware
export const processBase64Image = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.avatar || req.processedImage) {
      return next();
    }

    // Extract base64 data
    const base64Data = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Process with Sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();

    // Convert back to base64
    const processedBase64 = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;

    // Update request body
    req.body.avatar = processedBase64;
    req.processedImage = {
      base64: processedBase64,
      size: processedImageBuffer.length,
      originalName: 'uploaded-image.jpg',
      mimetype: 'image/jpeg',
    };

    next();
  } catch (error) {
    console.error('Base64 processing error:', error);
    res.status(400).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ',
    });
  }
};