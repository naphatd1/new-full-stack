import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import uploadRoutes from './upload.routes';
import houseRoutes from './house.routes';
import houseImageRoutes from './house-image.routes';
import houseVideoRoutes from './house-video.routes';
import contactRoutes from './contact.routes';
import settingsRoutes from './settings.routes';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all API routes (skip in development)
if (process.env.NODE_ENV !== 'development') {
  router.use(apiLimiter);
}

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/houses', houseRoutes);
router.use('/houses', houseImageRoutes);
router.use('/houses', houseVideoRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);

// Simple placeholder image route
router.get('/images/placeholder-house.svg', (_req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f3f4f6"/>
      <rect x="50" y="100" width="300" height="150" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
      <polygon points="50,100 200,50 350,100" fill="#6b7280"/>
      <rect x="120" y="150" width="60" height="100" fill="#374151"/>
      <rect x="220" y="150" width="80" height="60" fill="#60a5fa" stroke="#3b82f6" stroke-width="2"/>
      <text x="200" y="280" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">House Image</text>
    </svg>
  `);
});

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'User Management API',
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /v1/api/auth/register',
        login: 'POST /v1/api/auth/login',
        logout: 'POST /v1/api/auth/logout',
        refreshToken: 'POST /v1/api/auth/refresh-token',
        changePassword: 'POST /v1/api/auth/change-password',
        sessions: 'GET /v1/api/auth/sessions',
        revokeSession: 'DELETE /v1/api/auth/sessions/:sessionId',
      },
      users: {
        profile: 'GET /v1/api/users/profile',
        updateProfile: 'PUT /v1/api/users/profile',
        getAllUsers: 'GET /v1/api/users (Admin only)',
        getUserById: 'GET /v1/api/users/:id (Admin only)',
        toggleUserStatus: 'PATCH /v1/api/users/:id/toggle-status (Admin only)',
        deleteUser: 'DELETE /v1/api/users/:id (Admin only)',
      },
      upload: {
        avatar: 'POST /v1/api/upload/avatar',
        removeAvatar: 'DELETE /v1/api/upload/avatar',
        image: 'POST /v1/api/upload/image',
      },
      houses: {
        create: 'POST /v1/api/houses',
        getAll: 'GET /v1/api/houses',
        getMy: 'GET /v1/api/houses/my',
        getById: 'GET /v1/api/houses/:id',
        update: 'PUT /v1/api/houses/:id',
        delete: 'DELETE /v1/api/houses/:id',
        uploadImages: 'POST /v1/api/houses/:houseId/images',
        getImages: 'GET /v1/api/houses/:houseId/images',
        setMainImage: 'PUT /v1/api/houses/:houseId/images/:imageId/main',
        reorderImages: 'PUT /v1/api/houses/:houseId/images/reorder',
        deleteImage: 'DELETE /v1/api/houses/:houseId/images/:imageId',
        uploadVideos: 'POST /v1/api/houses/:houseId/videos',
        getVideos: 'GET /v1/api/houses/:houseId/videos',
        deleteVideo: 'DELETE /v1/api/houses/:houseId/videos/:filename',
      },
      contact: {
        create: 'POST /v1/api/contact',
        getAll: 'GET /v1/api/contact (Admin only)',
        getById: 'GET /v1/api/contact/:id (Admin only)',
        updateStatus: 'PATCH /v1/api/contact/:id/status (Admin only)',
        addResponse: 'POST /v1/api/contact/:id/response (Admin only)',
        delete: 'DELETE /v1/api/contact/:id (Admin only)',
        stats: 'GET /v1/api/contact/stats (Admin only)',
      },
      settings: {
        get: 'GET /v1/api/settings (Admin only)',
        update: 'PUT /v1/api/settings (Admin only)',
      },
    },
  });
});

export default router;