import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: process.env.NODE_ENV === 'development' 
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10000') // Very high limit for development
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Normal limit for production
  message: {
    success: false,
    message: 'คำขอมากเกินไป กรุณาลองใหม่ในภายหลัง',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // More lenient in development
  message: {
    success: false,
    message: 'พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก 15 นาที',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create account limiter
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 50 : 3, // More lenient in development
  message: {
    success: false,
    message: 'สร้างบัญชีมากเกินไป กรุณาลองใหม่ในอีก 1 ชั่วโมง',
  },
  standardHeaders: true,
  legacyHeaders: false,
});