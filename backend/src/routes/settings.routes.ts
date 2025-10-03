import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

// GET /api/settings - ดึงการตั้งค่าระบบ (ต้อง login และเป็น admin)
router.get('/', authenticate, requireAdmin, getSettings);

// PUT /api/settings - อัปเดตการตั้งค่าระบบ (ต้อง login และเป็น admin)
router.put('/', authenticate, requireAdmin, updateSettings);

export default router;