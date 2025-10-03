import { body, param } from 'express-validator';
import { HouseType, HouseStatus } from '@prisma/client';

export const createHouseValidator = [
  body('title')
    .notEmpty()
    .withMessage('กรุณาระบุชื่อบ้าน')
    .isLength({ min: 5, max: 200 })
    .withMessage('ชื่อบ้านต้องมีความยาว 5-200 ตัวอักษร'),

  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('คำอธิบายต้องไม่เกิน 2000 ตัวอักษร'),

  body('price')
    .notEmpty()
    .withMessage('กรุณาระบุราคา')
    .isFloat({ min: 0 })
    .withMessage('ราคาต้องเป็นตัวเลขที่มากกว่า 0'),

  body('address')
    .notEmpty()
    .withMessage('กรุณาระบุที่อยู่')
    .isLength({ min: 10, max: 500 })
    .withMessage('ที่อยู่ต้องมีความยาว 10-500 ตัวอักษร'),

  body('city')
    .notEmpty()
    .withMessage('กรุณาระบุเมือง/อำเภอ')
    .isLength({ min: 2, max: 100 })
    .withMessage('เมือง/อำเภอต้องมีความยาว 2-100 ตัวอักษร'),

  body('province')
    .notEmpty()
    .withMessage('กรุณาระบุจังหวัด')
    .isLength({ min: 2, max: 100 })
    .withMessage('จังหวัดต้องมีความยาว 2-100 ตัวอักษร'),

  body('postalCode')
    .optional()
    .matches(/^\d{5}$/)
    .withMessage('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'),

  body('bedrooms')
    .notEmpty()
    .withMessage('กรุณาระบุจำนวนห้องนอน')
    .isInt({ min: 0, max: 20 })
    .withMessage('จำนวนห้องนอนต้องเป็นตัวเลข 0-20'),

  body('bathrooms')
    .notEmpty()
    .withMessage('กรุณาระบุจำนวนห้องน้ำ')
    .isInt({ min: 1, max: 20 })
    .withMessage('จำนวนห้องน้ำต้องเป็นตัวเลข 1-20'),

  body('area')
    .notEmpty()
    .withMessage('กรุณาระบุพื้นที่ใช้สอย')
    .isFloat({ min: 1 })
    .withMessage('พื้นที่ใช้สอยต้องเป็นตัวเลขที่มากกว่า 0'),

  body('landArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ขนาดที่ดินต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0'),

  body('parkingSpaces')
    .notEmpty()
    .withMessage('กรุณาระบุจำนวนที่จอดรถ')
    .isInt({ min: 0, max: 50 })
    .withMessage('จำนวนที่จอดรถต้องเป็นตัวเลข 0-50'),

  body('houseType')
    .notEmpty()
    .withMessage('กรุณาระบุประเภทบ้าน')
    .isIn(Object.values(HouseType))
    .withMessage('ประเภทบ้านไม่ถูกต้อง'),

  body('badges')
    .optional()
    .isArray()
    .withMessage('badges ต้องเป็น array')
    .custom((value) => {
      if (Array.isArray(value) && value.length > 30) {
        throw new Error('สามารถเลือกจุดเด่นได้สูงสุด 30 รายการ');
      }
      return true;
    }),
];

export const updateHouseValidator = [
  param('id')
    .notEmpty()
    .withMessage('กรุณาระบุ ID ของบ้าน')
    .isString()
    .withMessage('ID ต้องเป็น string'),

  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('ชื่อบ้านต้องมีความยาว 5-200 ตัวอักษร'),

  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('คำอธิบายต้องไม่เกิน 2000 ตัวอักษร'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ราคาต้องเป็นตัวเลขที่มากกว่า 0'),

  body('address')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('ที่อยู่ต้องมีความยาว 10-500 ตัวอักษร'),

  body('city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('เมือง/อำเภอต้องมีความยาว 2-100 ตัวอักษร'),

  body('province')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('จังหวัดต้องมีความยาว 2-100 ตัวอักษร'),

  body('postalCode')
    .optional()
    .matches(/^\d{5}$/)
    .withMessage('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'),

  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('จำนวนห้องนอนต้องเป็นตัวเลข 0-20'),

  body('bathrooms')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('จำนวนห้องน้ำต้องเป็นตัวเลข 1-20'),

  body('area')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('พื้นที่ใช้สอยต้องเป็นตัวเลขที่มากกว่า 0'),

  body('landArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ขนาดที่ดินต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0'),

  body('parkingSpaces')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('จำนวนที่จอดรถต้องเป็นตัวเลข 0-50'),

  body('houseType')
    .optional()
    .isIn(Object.values(HouseType))
    .withMessage('ประเภทบ้านไม่ถูกต้อง'),

  body('status')
    .optional()
    .isIn(Object.values(HouseStatus))
    .withMessage('สถานะบ้านไม่ถูกต้อง'),

  body('badges')
    .optional()
    .isArray()
    .withMessage('badges ต้องเป็น array')
    .custom((value) => {
      if (Array.isArray(value) && value.length > 30) {
        throw new Error('สามารถเลือกจุดเด่นได้สูงสุด 30 รายการ');
      }
      return true;
    }),
];

export const houseIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('กรุณาระบุ ID ของบ้าน')
    .isString()
    .withMessage('ID ต้องเป็น string'),
];

export const reorderImagesValidator = [
  param('houseId')
    .notEmpty()
    .withMessage('กรุณาระบุ ID ของบ้าน')
    .isString()
    .withMessage('ID ต้องเป็น string'),

  body('imageOrders')
    .isArray({ min: 1 })
    .withMessage('กรุณาระบุลำดับรูปภาพ')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('imageOrders ต้องเป็น array');
      }
      
      for (const item of value) {
        if (!item.id || typeof item.id !== 'string') {
          throw new Error('แต่ละรายการต้องมี id เป็น string');
        }
        if (typeof item.order !== 'number' || item.order < 0) {
          throw new Error('แต่ละรายการต้องมี order เป็นตัวเลขที่มากกว่าหรือเท่ากับ 0');
        }
      }
      
      return true;
    }),
];