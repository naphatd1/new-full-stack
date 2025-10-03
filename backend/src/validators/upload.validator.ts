import { body } from 'express-validator';

export const avatarUploadValidator = [
  body('avatar')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('รูปภาพต้องเป็น base64 string');
      }
      
      // Check if it's a valid base64 image
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Regex.test(value)) {
        throw new Error('รูปภาพต้องเป็นรูปแบบ base64 ที่ถูกต้อง (jpeg, jpg, png, gif, webp)');
      }
      
      // Check approximate size (base64 is ~33% larger than original)
      const base64Size = (value.length * 3) / 4;
      if (base64Size > 5 * 1024 * 1024) { // 5MB
        throw new Error('รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)');
      }
      
      return true;
    }),
];

export const imageUploadValidator = [
  body('image')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('รูปภาพต้องเป็น base64 string');
      }
      
      // Check if it's a valid base64 image
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Regex.test(value)) {
        throw new Error('รูปภาพต้องเป็นรูปแบบ base64 ที่ถูกต้อง (jpeg, jpg, png, gif, webp)');
      }
      
      // Check approximate size
      const base64Size = (value.length * 3) / 4;
      if (base64Size > 10 * 1024 * 1024) { // 10MB for general images
        throw new Error('รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 10MB)');
      }
      
      return true;
    }),
];