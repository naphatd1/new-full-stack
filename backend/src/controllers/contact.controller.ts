import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getThaiTimestamp } from "../middleware/timestamp";

const prisma = new PrismaClient();

// สร้างข้อความติดต่อใหม่
export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
        errors: {
          name: !name ? "กรุณากรอกชื่อ" : undefined,
          email: !email ? "กรุณากรอกอีเมล" : undefined,
          subject: !subject ? "กรุณาเลือกหัวข้อ" : undefined,
          message: !message ? "กรุณากรอกข้อความ" : undefined,
        }
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "รูปแบบอีเมลไม่ถูกต้อง"
      });
      return;
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      }
    });

    res.status(201).json({
      success: true,
      message: "ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด",
      data: {
        id: contactMessage.id,
        createdAt: contactMessage.createdAt
      },
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Create contact message error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งข้อความ",
      timestamp: getThaiTimestamp()
    });
  }
};

// ดึงข้อความติดต่อทั้งหมด (สำหรับ admin)
export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = {};
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Date filtering
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999); // End of day
        where.createdAt.lte = endDate;
      }
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      timestamp: getThaiTimestamp()
    });
  }
};

// ดึงข้อความติดต่อตาม ID
export const getContactMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      res.status(404).json({
        success: false,
        message: "ไม่พบข้อความที่ต้องการ",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    // Mark as read if it's unread
    if (message.status === 'UNREAD') {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: 'READ' }
      });
      message.status = 'READ' as any;
    }

    res.json({
      success: true,
      data: message,
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Get contact message by ID error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      timestamp: getThaiTimestamp()
    });
  }
};

// อัพเดทสถานะข้อความ
export const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!status || !['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'].includes(status.toUpperCase())) {
      res.status(400).json({
        success: false,
        message: "สถานะไม่ถูกต้อง",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      res.status(404).json({
        success: false,
        message: "ไม่พบข้อความที่ต้องการ",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        ...(status.toUpperCase() === 'REPLIED' && {
          respondedBy: userId,
          respondedAt: new Date()
        })
      }
    });

    res.json({
      success: true,
      message: "อัพเดทสถานะเรียบร้อยแล้ว",
      data: updatedMessage,
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Update message status error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัพเดทสถานะ",
      timestamp: getThaiTimestamp()
    });
  }
};

// เพิ่มการตอบกลับ
export const addAdminResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;
    const userId = (req as any).user?.id;

    if (!adminResponse || adminResponse.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อความตอบกลับ",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      res.status(404).json({
        success: false,
        message: "ไม่พบข้อความที่ต้องการ",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        adminResponse: adminResponse.trim(),
        respondedBy: userId,
        respondedAt: new Date(),
        status: 'REPLIED'
      }
    });

    res.json({
      success: true,
      message: "บันทึกการตอบกลับเรียบร้อยแล้ว",
      data: updatedMessage,
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Add admin response error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการบันทึกการตอบกลับ",
      timestamp: getThaiTimestamp()
    });
  }
};

// ลบข้อความ
export const deleteContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      res.status(404).json({
        success: false,
        message: "ไม่พบข้อความที่ต้องการ",
        timestamp: getThaiTimestamp()
      });
      return;
    }

    await prisma.contactMessage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "ลบข้อความเรียบร้อยแล้ว",
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Delete contact message error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบข้อความ",
      timestamp: getThaiTimestamp()
    });
  }
};

// สถิติข้อความติดต่อ
export const getContactStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [total, unread, read, replied, archived] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.contactMessage.count({ where: { status: 'READ' } }),
      prisma.contactMessage.count({ where: { status: 'REPLIED' } }),
      prisma.contactMessage.count({ where: { status: 'ARCHIVED' } })
    ]);

    // สถิติรายเดือน (30 วันที่ผ่านมา)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMessages = await prisma.contactMessage.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied,
        archived,
        recentMessages
      },
      timestamp: getThaiTimestamp()
    });

  } catch (error) {
    console.error("Get contact stats error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงสถิติ",
      timestamp: getThaiTimestamp()
    });
  }
};