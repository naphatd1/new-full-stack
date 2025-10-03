import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateMessageStatus,
  addAdminResponse,
  deleteContactMessage,
  getContactStats
} from "../controllers/contact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: ID ของข้อความ
 *         name:
 *           type: string
 *           description: ชื่อผู้ส่ง
 *         email:
 *           type: string
 *           format: email
 *           description: อีเมลผู้ส่ง
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์
 *         subject:
 *           type: string
 *           description: หัวข้อ
 *         message:
 *           type: string
 *           description: ข้อความ
 *         status:
 *           type: string
 *           enum: [UNREAD, READ, REPLIED, ARCHIVED]
 *           description: สถานะข้อความ
 *         adminResponse:
 *           type: string
 *           description: การตอบกลับจาก admin
 *         respondedBy:
 *           type: string
 *           description: ID ของ admin ที่ตอบกลับ
 *         respondedAt:
 *           type: string
 *           format: date-time
 *           description: วันที่ตอบกลับ
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: วันที่สร้าง
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: วันที่อัพเดท
 */

/**
 * @swagger
 * /v1/api/contact:
 *   post:
 *     summary: ส่งข้อความติดต่อ
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "สมชาย ใจดี"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "somchai@example.com"
 *               phone:
 *                 type: string
 *                 example: "089-123-4567"
 *               subject:
 *                 type: string
 *                 example: "buy"
 *               message:
 *                 type: string
 *                 example: "สอบถามเรื่องการซื้อบ้าน"
 *     responses:
 *       201:
 *         description: ส่งข้อความสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post("/", createContactMessage);

/**
 * @swagger
 * /v1/api/contact:
 *   get:
 *     summary: ดึงข้อความติดต่อทั้งหมด (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หน้าที่ต้องการ
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: จำนวนรายการต่อหน้า
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, UNREAD, READ, REPLIED, ARCHIVED]
 *         description: กรองตามสถานะ
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาในชื่อ, อีเมล, หัวข้อ, ข้อความ
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.get("/", authenticate, requireAdmin, getContactMessages);

/**
 * @swagger
 * /v1/api/contact/stats:
 *   get:
 *     summary: ดึงสถิติข้อความติดต่อ (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงสถิติสำเร็จ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.get("/stats", authenticate, requireAdmin, getContactStats);

/**
 * @swagger
 * /v1/api/contact/{id}:
 *   get:
 *     summary: ดึงข้อความติดต่อตาม ID (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข้อความ
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *       404:
 *         description: ไม่พบข้อความ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.get("/:id", authenticate, requireAdmin, getContactMessageById);

/**
 * @swagger
 * /v1/api/contact/{id}/status:
 *   patch:
 *     summary: อัพเดทสถานะข้อความ (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข้อความ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [UNREAD, READ, REPLIED, ARCHIVED]
 *                 example: "read"
 *     responses:
 *       200:
 *         description: อัพเดทสถานะสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อความ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.patch("/:id/status", authenticate, requireAdmin, updateMessageStatus);

/**
 * @swagger
 * /v1/api/contact/{id}/response:
 *   post:
 *     summary: เพิ่มการตอบกลับ (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข้อความ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminResponse
 *             properties:
 *               adminResponse:
 *                 type: string
 *                 example: "ขอบคุณสำหรับการติดต่อ เราจะติดต่อกลับภายใน 24 ชั่วโมง"
 *     responses:
 *       200:
 *         description: บันทึกการตอบกลับสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อความ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.post("/:id/response", authenticate, requireAdmin, addAdminResponse);

/**
 * @swagger
 * /v1/api/contact/{id}:
 *   delete:
 *     summary: ลบข้อความติดต่อ (Admin เท่านั้น)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข้อความ
 *     responses:
 *       200:
 *         description: ลบข้อความสำเร็จ
 *       404:
 *         description: ไม่พบข้อความ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 */
router.delete("/:id", authenticate, requireAdmin, deleteContactMessage);

export default router;