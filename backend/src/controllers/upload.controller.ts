import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler';
import { updateUser } from '../services/user.service';

export const uploadAvatar = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  let avatarBase64: string;

  // Get base64 from processed image or direct input
  if (req.processedImage) {
    avatarBase64 = req.processedImage.base64;
  } else if (req.body.avatar) {
    avatarBase64 = req.body.avatar;
  } else {
    res.status(400).json({
      success: false,
      message: 'ไม่พบรูปภาพที่จะอัปโหลด',
    });
    return;
  }

  // Update user avatar
  const updatedUser = await updateUser(userId, {
    avatar: avatarBase64,
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    message: 'อัปโหลดรูปโปรไฟล์สำเร็จ',
    data: {
      user: userWithoutPassword,
      imageInfo: req.processedImage ? {
        size: req.processedImage.size,
        originalName: req.processedImage.originalName,
        processedFormat: 'JPEG',
      } : null,
    },
  });
});

export const removeAvatar = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'ไม่ได้รับอนุญาต',
    });
    return;
  }

  // Remove avatar by setting it to null
  const updatedUser = await updateUser(userId, {
    avatar: null,
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    message: 'ลบรูปโปรไฟล์สำเร็จ',
    data: userWithoutPassword,
  });
});

export const uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array(),
    });
    return;
  }

  if (!req.processedImage && !req.body.image) {
    res.status(400).json({
      success: false,
      message: 'ไม่พบรูปภาพที่จะอัปโหลด',
    });
    return;
  }

  let imageBase64: string;
  let imageInfo: {
    size: number;
    originalName: string;
    processedFormat: string;
  };

  if (req.processedImage) {
    imageBase64 = req.processedImage.base64;
    imageInfo = {
      size: req.processedImage.size,
      originalName: req.processedImage.originalName,
      processedFormat: 'JPEG',
    };
  } else {
    imageBase64 = req.body.image;
    // Calculate approximate size for base64
    const base64Size = (req.body.image.length * 3) / 4;
    imageInfo = {
      size: Math.round(base64Size),
      originalName: 'base64-image.jpg',
      processedFormat: 'Base64',
    };
  }

  res.json({
    success: true,
    message: 'อัปโหลดรูปภาพสำเร็จ',
    data: {
      image: imageBase64,
      imageInfo,
    },
  });
});

// สำหรับ backward compatibility
export const UploadController = {
  uploadAvatar,
  removeAvatar,
  uploadImage,
};