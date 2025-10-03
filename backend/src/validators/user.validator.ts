import { body, param } from 'express-validator';

export const registerValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('กรุณาใส่อีเมลที่ถูกต้อง'),
  
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร และใช้ได้เฉพาะ a-z, A-Z, 0-9, _'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('ชื่อต้องมี 1-50 ตัวอักษร'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('นามสกุลต้องมี 1-50 ตัวอักษร'),
  
  body('role')
    .optional()
    .isIn(['USER', 'MODERATOR', 'ADMIN'])
    .withMessage('สิทธิ์ผู้ใช้ต้องเป็น USER, MODERATOR หรือ ADMIN'),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('กรุณาใส่อีเมลที่ถูกต้อง'),
  
  body('password')
    .notEmpty()
    .withMessage('กรุณาใส่รหัสผ่าน'),
];

export const updateProfileValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('ชื่อต้องมี 1-50 ตัวอักษร'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('นามสกุลต้องมี 1-50 ตัวอักษร'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('ประวัติส่วนตัวต้องไม่เกิน 500 ตัวอักษร'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('หมายเลขโทรศัพท์ไม่ถูกต้อง'),
];

export const userIdValidator = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('User ID ไม่ถูกต้อง'),
];