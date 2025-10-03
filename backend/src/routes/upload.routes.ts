import { Router } from 'express';
import { 
  uploadAvatar, 
  removeAvatar, 
  uploadImage 
} from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';
import { 
  upload, 
  processImage, 
  validateImageUpload, 
  processBase64Image 
} from '../middleware/upload.middleware';
import { avatarUploadValidator, imageUploadValidator } from '../validators/upload.validator';

const router = Router();

// Protected routes - ต้อง authenticate ทุก route
router.use(authenticate);

router.post('/avatar',
  upload.single('avatar'),
  avatarUploadValidator,
  validateImageUpload,
  processImage,
  processBase64Image,
  uploadAvatar
);

router.delete('/avatar', removeAvatar);

router.post('/image',
  upload.single('image'),
  imageUploadValidator,
  validateImageUpload,
  processImage,
  processBase64Image,
  uploadImage
);

export default router;