import { Router } from 'express';
import { 
  registerController, 
  loginController, 
  logoutController, 
  refreshTokenController, 
  changePasswordController, 
  getSessionsController, 
  revokeSessionController,
  getMeController
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, createAccountLimiter } from '../middleware/rateLimiter';
import { registerValidator, loginValidator } from '../validators/user.validator';
import { body } from 'express-validator';

const router = Router();

router.post('/register', 
  createAccountLimiter,
  registerValidator,
  registerController
);

router.post('/login',
  authLimiter,
  loginValidator,
  loginController
);

router.post('/logout',
  authenticate,
  logoutController
);

router.post('/refresh-token',
  authenticate,
  refreshTokenController
);

router.post('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('กรุณาใส่รหัสผ่านปัจจุบัน'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วย ตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ'),
  ],
  changePasswordController
);

router.get('/sessions',
  authenticate,
  getSessionsController
);

router.delete('/sessions/:sessionId',
  authenticate,
  revokeSessionController
);

router.get('/me',
  authenticate,
  getMeController
);

export default router;