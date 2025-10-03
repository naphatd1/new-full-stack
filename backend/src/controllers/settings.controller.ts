import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.systemSettings.findFirst();
    
    // ถ้าไม่มี settings ให้สร้างค่าเริ่มต้น
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {}
      });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า'
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const {
      siteName,
      siteDescription,
      allowRegistration,
      requireEmailVerification,
      enableNotifications,
      maintenanceMode,
      maxFileSize,
      allowedFileTypes,
      commissionRate,
      currency,
      timezone,
      language
    } = req.body;

    // ตรวจสอบว่ามี settings อยู่แล้วหรือไม่
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      // สร้างใหม่ถ้าไม่มี
      settings = await prisma.systemSettings.create({
        data: {
          siteName,
          siteDescription,
          allowRegistration,
          requireEmailVerification,
          enableNotifications,
          maintenanceMode,
          maxFileSize,
          allowedFileTypes,
          commissionRate,
          currency,
          timezone,
          language
        }
      });
    } else {
      // อัปเดตถ้ามีอยู่แล้ว
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          siteDescription,
          allowRegistration,
          requireEmailVerification,
          enableNotifications,
          maintenanceMode,
          maxFileSize,
          allowedFileTypes,
          commissionRate,
          currency,
          timezone,
          language
        }
      });
    }

    res.json({
      success: true,
      message: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า'
    });
  }
};